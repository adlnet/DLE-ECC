import copy
import logging
import uuid

from celery.result import AsyncResult
from django.http import JsonResponse
from requests.exceptions import HTTPError
from rest_framework import filters, pagination, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.utils import json
from rest_framework.views import APIView

from api.management.utils.api_helper_functions import (add_metadata_ledger,
                                                       add_supplemental_ledger,
                                                       get_catalog_list,
                                                       get_managed_data)
from api.serializers import (CompositeLedgerSerializer,
                             MetadataLedgerSerializer,
                             SupplementalLedgerSerializer)
from core.management.utils.transform_ledgers import \
    detach_metadata_ledger_from_supplemental_ledger
from core.management.utils.xis_internal import (bleach_data_to_json,
                                                update_multilevel_dict)
from core.management.utils.xss_client import \
    get_optional_and_recommended_fields_for_validation
from core.models import CompositeLedger, MetadataLedger
from core.tasks import (xis_downstream_workflow, xis_upstream_workflow,
                        xis_workflow)

logger = logging.getLogger('dict_config_logger')


class CustomPagination(pagination.PageNumberPagination):
    """custom pagination to add page_size from api. For example:

    http://api.example.org/accounts/?page=4
    http://api.example.org/accounts/?page=4&page_size=100"""

    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class CatalogDataView(APIView):
    """Handles HTTP requests for Provider data from XIS"""

    def get(self, request):
        """This method defines an API to fetch the names of all
         course providers"""

        catalog_list_response = get_catalog_list(CompositeLedger)

        return catalog_list_response


class ManagedCatalogListView(APIView):
    """Handles HTTP requests for Provider data from XIS"""

    def get(self, request):
        """This method defines an API to fetch the names of all
         course providers"""

        managed_catalog_list_response = get_catalog_list(MetadataLedger)

        return managed_catalog_list_response


@permission_classes([IsAuthenticatedOrReadOnly])
class MetaDataView(ListAPIView):
    """Handles HTTP requests for Metadata for XIS"""

    # add fields to be searched on in the query
    search_fields = ['metadata_key_hash',
                     'provider_name', 'unique_record_identifier']
    serializer_class = CompositeLedgerSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        """override queryset to filter using provider_id"""

        queryset = CompositeLedger.objects.all().order_by().filter(
            record_status="Active"
        )

        args = self.request.query_params

        if 'provider' in args and args['provider']:
            queryset = queryset.filter(provider_name=args['provider'])
        if 'id' in args and args['id']:
            queryset = queryset.filter(
                unique_record_identifier__in=args['id'].split(","))
        if 'metadata_key_hash_list' in args\
                and args['metadata_key_hash_list']:
            queryset = queryset.filter(
                metadata_key_hash__in=args['metadata_key_hash_list']
                .split(","))

        return queryset

    def filter_queryset(self, queryset):
        """override search filter to filter using ?search=value1 value2..."""

        filter_backends = (filters.SearchFilter,)

        for backend in list(filter_backends):
            queryset = backend().filter_queryset(self.request, queryset,
                                                 view=self)
        return queryset

    def post(self, request):
        """This method defines the API's to save data to the
        metadata ledger in the XIS"""
        logger.info("Start processing")
        logger.error("Incoming experience")

        # Add optional/recommended fields to the metadata
        extra_fields = get_optional_and_recommended_fields_for_validation()

        # bleaching/cleaning HTML tags from request data
        metadata = bleach_data_to_json(request.data['metadata'])

        for field in extra_fields:
            meta_path = copy.deepcopy(metadata)
            path = field.split('.')
            try:
                for step in path:
                    meta_path = meta_path[step]
            except Exception:
                update_multilevel_dict(metadata, path, None)
        request.data['metadata'] = metadata

        # Tracking source of changes to metadata/supplementary data
        request.data['updated_by'] = "System"
        data, instance = add_metadata_ledger(request.data, None)
        serializer = \
            MetadataLedgerSerializer(instance, data=data)

        if not serializer.is_valid():
            # If not received send error and bad request status
            logger.error(serializer.errors)
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        # If received save record in ledger and send response of UUID &
        # status created
        serializer.save()

        # add created_by\
        serializer.instance.created_by = request.user
        serializer.instance.save()

        return Response(serializer.data['unique_record_identifier'],
                        status=status.HTTP_201_CREATED)


@permission_classes([IsAuthenticatedOrReadOnly])
class SupplementalDataView(APIView):
    """Handles HTTP requests for Supplemental data for XIS"""

    def post(self, request):
        """This method defines the API's to save data to the
        metadata ledger in the XIS"""

        # Tracking source of changes to metadata/supplementary data
        request.data['updated_by'] = 'System'

        # bleaching/cleaning HTML tags from request data
        data = bleach_data_to_json(request.data)

        data, instance = add_supplemental_ledger(data, None)

        serializer = \
            SupplementalLedgerSerializer(instance,
                                         data=data)

        if not serializer.is_valid():
            # If not received send error and bad request status
            logger.error(serializer.errors)
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

        # If received save record in ledger and send response of UUID &
        # status created
        serializer.save()

        # add created_by
        serializer.instance.created_by = request.user
        serializer.instance.save()

        return Response(serializer.data['unique_record_identifier'],
                        status=status.HTTP_201_CREATED)


class UUIDDataView(APIView):
    """Handles HTTP requests using UUID from composite ledger"""

    def get(self, request, course_id):
        """This method defines an API to fetch or modify the record of the
        corresponding course id"""
        errorMsg = {
            "message": "error: no record for corresponding course id; " +
                       "please check the logs"
        }
        try:
            queryset = CompositeLedger.objects.order_by() \
                .get(unique_record_identifier=course_id,
                     record_status='Active')
            serializer_class = CompositeLedgerSerializer(queryset)
        except HTTPError as http_err:
            logger.error(http_err)
            return Response(errorMsg, status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as err:
            logger.error(err)
            return Response(errorMsg, status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer_class.data, status.HTTP_200_OK)


class ManagedCatalogDataView(ListAPIView):
    """Handles HTTP requests for Managing catalog data from XMS"""

    # add fields to be searched on in the query
    search_fields = ['metadata_key',
                     'metadata_key_hash', 'provider_name',
                     'unique_record_identifier']

    serializer_class = MetadataLedgerSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        """override queryset to filter using provider_id"""

        provider_id = self.kwargs['provider_id']
        if 'fields' in self.request.GET and\
                self.request.GET.get('fields') is not None:
            self.search_fields += self.request.GET.get('fields').\
                replace('.', '__').split(',')
        queryset = MetadataLedger.objects.filter(
            provider_name=provider_id,
            record_status="Active"
        )

        return queryset

    def filter_queryset(self, queryset):
        """override search filter to filter using ?search=value1 value2..."""

        filter_backends = (filters.SearchFilter,)

        for backend in list(filter_backends):
            queryset = backend().filter_queryset(self.request, queryset,
                                                 view=self)
        return queryset


@permission_classes([IsAuthenticatedOrReadOnly])
class ManageDataView(APIView):
    """Handles HTTP requests for Managing data from XMS"""

    def get(self, request, provider_id, experience_id):
        """This method defines the API's to retrieve data to be managed
         from XMS"""

        querySet = MetadataLedger.objects.filter(
            metadata_key_hash=experience_id,
            provider_name=provider_id,
            record_status="Active"
        )

        if not querySet:
            errorMsg = {"Error; no active records found for metadata key " +
                        experience_id + " in provider " + provider_id}
            logger.error(errorMsg)
            return Response(errorMsg, status.HTTP_404_NOT_FOUND)

        manage_data_response = get_managed_data(querySet)

        return manage_data_response

    def post(self, request, provider_id, experience_id):
        """This method defines the API's to save data
        after it's been managed in XMS"""

        # Tracking source of changes to metadata/supplementary data
        request.data['updated_by'] = "Owner"
        request.data['provider_name'] = provider_id
        request.data['metadata_key_hash'] = experience_id
        request.data['unique_record_identifier'] = str(uuid.uuid4())

        # bleaching/cleaning HTML tags from request data
        data = bleach_data_to_json(request.data)

        # Detach supplemental metadata and metadata from consolidated data
        metadata_data, supplemental_data = \
            detach_metadata_ledger_from_supplemental_ledger(data)

        metadata, metadata_instance = add_metadata_ledger(metadata_data,
                                                          experience_id)

        supplementalData, supplemental_instance = \
            add_supplemental_ledger(supplemental_data, experience_id)

        if metadata_instance:
            metadata['metadata_key'] = metadata_instance.metadata_key

        # Assign data from request to serializer
        metadata_serializer = MetadataLedgerSerializer(metadata_instance,
                                                       data=metadata)

        # Assign data from request to serializer
        supplemental_serializer = \
            SupplementalLedgerSerializer(supplemental_instance,
                                         data=supplementalData)

        if not metadata_serializer.is_valid():
            # If not received send error and bad request status
            logger.info(json.dumps(metadata_data))
            logger.error(metadata_serializer.errors)
            return Response(metadata_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

        if not supplemental_serializer.is_valid():
            # If not received send error and bad request status
            logger.info(json.dumps(supplemental_data))
            logger.error(supplemental_serializer.errors)
            return Response(supplemental_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

        # If received save record in ledger and send response of UUID &
        # status created
        metadata_serializer.save()
        supplemental_serializer.save()

        # add created_by
        metadata_serializer.instance.created_by = request.user
        metadata_serializer.instance.save()
        supplemental_serializer.instance.created_by = request.user
        supplemental_serializer.instance.save()

        if (metadata_instance):
            return Response(metadata_serializer.data['metadata_key_hash'],
                            status=status.HTTP_200_OK)
        else:
            return Response(metadata_serializer.data['metadata_key_hash'],
                            status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes((permissions.IsAdminUser,))
def xis_workflow_api(request):
    logger.info('XIS workflow api')
    task = xis_workflow.delay()
    return JsonResponse({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)


@api_view(['GET'])
@permission_classes((permissions.IsAdminUser,))
def xis_downstream_workflow_api(request):
    logger.info('Downstream workflow api')
    task = xis_downstream_workflow.delay()
    return JsonResponse({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)


@api_view(['GET'])
@permission_classes((permissions.IsAdminUser,))
def xis_upstream_workflow_api(request):
    logger.info('Upstream workflow api')
    task = xis_upstream_workflow.delay()
    return JsonResponse({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)


@api_view(['GET'])
@permission_classes((permissions.IsAdminUser,))
def get_status(request, task_id):
    task_result = AsyncResult(task_id)
    result = {
        "task_id": task_id,
        "task_status": task_result.status,
        "task_result": task_result.result
    }
    return JsonResponse(result, status=200)
