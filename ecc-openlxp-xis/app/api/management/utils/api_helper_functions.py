import hashlib
import json
import logging
import uuid

from requests import HTTPError
from rest_framework import status
from rest_framework.response import Response

from api.serializers import MetadataLedgerSerializer
from core.management.utils.transform_ledgers import \
    append_metadata_ledger_with_supplemental_ledger
from core.management.utils.xis_internal import multi_dict_sort
from core.models import MetadataLedger, SupplementalLedger

logger = logging.getLogger('dict_config_logger')


def add_metadata_ledger(data, experience_id):
    """Calls the metadata serializer with data sent over
     and older instance of the data """

    # Updating date inserted value for newly saved values
    if 'unique_record_identifier' not in data:
        data['unique_record_identifier'] = str(uuid.uuid4())

    if MetadataLedger.objects.filter(
            unique_record_identifier=data
            ['unique_record_identifier']).exists():
        logger.info("Assigning new UUID to updated value")
        data['unique_record_identifier'] = str(uuid.uuid4())

   # sorting the metadata for consistency
    if 'metadata' in data:
        data['metadata'] = multi_dict_sort(data['metadata'])
    else:
        data['metadata'] = {}

    # create hash values of metadata and supplemental data
    metadata_hash = hashlib.sha512(str(data['metadata']).encode(
        'utf-8')).hexdigest()

    # assign hash values to hash key in data
    data['metadata_hash'] = metadata_hash

    # Obtaining key value for comparison of records in metadata ledger
    if experience_id:
        key_hash_value = experience_id
    else:
        key_hash_value = data.get('metadata_key_hash', None)

    record_in_table = None
    if key_hash_value is not None:
        # Comparing metadata_key value in metadata ledger
        # to find older instances
        record_in_table = MetadataLedger.objects.filter(
            metadata_key_hash=key_hash_value, record_status='Active') \
            .first()
        if record_in_table:
            data['metadata_key'] = record_in_table.metadata_key

    if 'metadata_key_hash' not in data:
        data['metadata_key_hash'] = hashlib. \
            sha512(str(data['metadata_key']).encode('utf-8')).hexdigest()

    return data, record_in_table


def add_supplemental_ledger(data, experience_id):
    """Calls the supplemental serializer with data sent over
         and older instance of the data """

    # Updating date inserted value for newly saved values
    if 'unique_record_identifier' not in data:
        data['unique_record_identifier'] = str(uuid.uuid4())

    if SupplementalLedger.objects.filter(
            unique_record_identifier=data
            ['unique_record_identifier']).exists():
        logger.info("Assigning new UUID to updated value")
        data['unique_record_identifier'] = str(uuid.uuid4())

    # sorting the metadata for consistency
    if 'metadata' in data:
        data['metadata'] = multi_dict_sort(data['metadata'])
    else:
        data['metadata'] = {}

    # create hash values of metadata and supplemental data
    supplemental_hash = hashlib.sha512(str(data['metadata'])
                                       .encode('utf-8')).hexdigest()

    # assign hash values to hash key in data
    data['metadata_hash'] = supplemental_hash

    # Obtaining key value for comparison of records in metadata ledger
    if experience_id:
        key_hash_value = experience_id
    else:
        key_hash_value = data.get('metadata_key_hash', None)

    record_in_table = None
    if key_hash_value is not None:
        # Comparing key value in metadata ledger
        # to find older instances
        record_in_table = SupplementalLedger.objects.filter(
            metadata_key_hash=key_hash_value, record_status='Active') \
            .first()
        if record_in_table:
            data['metadata_key'] = record_in_table.metadata_key

    return data, record_in_table


def get_managed_data(querySet):
    """Function to respond with consolidated data to be managed"""

    errorMsg = {
        "message": "Error fetching records please check the logs."
    }

    fields = ('unique_record_identifier', 'metadata_key',
              'metadata_key_hash', 'metadata_hash', 'metadata',
              'provider_name')

    try:
        serializer_data = MetadataLedgerSerializer(querySet,
                                                   many=True,
                                                   fields=fields).data
        for index in range(len(serializer_data)):
            transformed_metadata = \
                append_metadata_ledger_with_supplemental_ledger(
                    serializer_data[index])[0]
            serializer_data[index]['metadata'] = transformed_metadata

    except HTTPError as http_err:
        logger.error(http_err)
        return Response(errorMsg, status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as err:
        logger.error(err)
        return Response(errorMsg,
                        status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(serializer_data, status.HTTP_200_OK)


def get_catalog_list(ledger):
    """Function to respond with catalog list"""

    errorMsg = {
        "message": "Error fetching records please check the logs."
    }

    try:
        providers = list(ledger.objects.
                         order_by().values_list('provider_name',
                                                flat=True).distinct())

        if not providers:
            errorMsg = {
                "message": "No catalogs present in records"
            }
            logger.error(errorMsg)
            return Response(errorMsg, status.HTTP_404_NOT_FOUND)

        result = json.dumps(providers)

    except HTTPError as http_err:
        logger.error(http_err)
        return Response(errorMsg,
                        status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as err:
        logger.error(err)
        return Response(errorMsg, status.HTTP_404_NOT_FOUND)
    else:
        return Response(result, status.HTTP_200_OK)
