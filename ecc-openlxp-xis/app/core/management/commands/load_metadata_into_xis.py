import copy
import json
import logging

import requests
from django.core.management.base import BaseCommand

from api.serializers import CompositeLedgerSerializer
from core.management.utils.xis_internal import update_multilevel_dict
from core.models import XISDownstream

logger = logging.getLogger('dict_config_logger')


class Command(BaseCommand):
    """Django command to load Composite_Ledger to additional Experience Index
        Services (XIS)"""

    def add_arguments(self, parser):
        parser.add_argument('--id', nargs='*', type=int,
                            help='list of IDs for XISDownstream objects to '
                            'run')
        parser.add_argument('--api', nargs='*', type=str,
                            help='list of APIs for XISDownstream objects to '
                            'run')

    def __add_fields(self, include, record):
        """handles selecting the included metadata fields in a single record"""
        return_record = {}
        # iterate over each item in the queryset
        for path in include:
            # iterate over the fields within metadata to the field
            try:
                path = path.split('.')
                metadata = copy.deepcopy(record)
                for step in path:
                    metadata = metadata[step]
                # add it to the return_record
                return_record = update_multilevel_dict(
                    return_record, path, metadata)
            # if the field does not exist, carry on
            except Exception:
                continue

        return return_record

    def __remove_fields(self, exclude, record):
        """handles removing excluded metadata fields in a single record"""
        return_record = record
        # iterate over each item in the queryset
        for path in exclude:
            # iterate over the fields within metadata to the field
            try:
                path = path.split('.')
                metadata = copy.deepcopy(record)
                for step in path:
                    metadata = metadata[step]
                # remove it from the return_record
                return_record = update_multilevel_dict(
                    return_record, path, None)
            # if the field does not exist, carry on
            except Exception:
                continue

        return return_record

    def send_record(self, downstream, record):
        """send record to XISDownstream"""

        self.__update_record(downstream, record)

        headers = {'Content-Type': 'application/json',
                   'Authorization': f'token {downstream.xis_api_key}'}

        xis_response = requests.post(
            url=f'{downstream.xis_api_endpoint}managed-data/catalogs/'
            f'{record["provider_name"]}/{record["metadata_key_hash"]}',
            data=json.dumps(CompositeLedgerSerializer(record).data),
            headers=headers, timeout=3.0)

        if(xis_response.status_code//10 == 20):
            downstream.composite_experiences.add(
                record['unique_record_identifier'])
        else:
            logger.error(
                f"HTTP Error {xis_response.status_code} for {record}" +
                f" to {downstream}")

    def __update_record(self, downstream, record):
        """makes updates to values in record as needed"""
        record['updated_by'] = downstream.source_name

    def handle(self, *args, **options):
        """Metadata load from XIS Composite_Ledger to XIS"""
        # filter to only active XISDownstream objects
        downstream_apis = XISDownstream.objects.all().filter(
            xis_api_endpoint_status=XISDownstream.ACTIVE)
        # if there are ids as an arg, filter to only those ids
        if('id' in options and options['id']):
            downstream_apis = downstream_apis.filter(pk__in=options['id'])
        # if there are apis as an arg, filter to only those apis
        if('api' in options and options['api']):
            downstream_apis = downstream_apis.filter(
                xis_api_endpoint__in=options['api'])

        # iterate over downstream objects
        for ds in downstream_apis:
            # get CompositeLedger objects for this downstream
            queryset = ds.apply_filter().values()
            # get the fields that should be included/excluded in records
            include, exclude = ds.determine_fields()
            if(include):
                for record in queryset:
                    metadata = self.__add_fields(include, record)
                    metadata = self.__remove_fields(exclude, metadata)
                    self.send_record(ds, metadata)
            # if nothing explicitly included, include all
            else:
                for record in queryset:
                    metadata = self.__remove_fields(exclude, record)
                    self.send_record(ds, metadata)
