import logging
import uuid

import requests
from django.core.management.base import BaseCommand

from api.management.utils.api_helper_functions import (add_metadata_ledger,
                                                       add_supplemental_ledger)
from api.serializers import (MetadataLedgerSerializer,
                             SupplementalLedgerSerializer)
from core.management.utils.transform_ledgers import \
    detach_metadata_ledger_from_supplemental_ledger
from core.management.utils.xis_internal import bleach_data_to_json
from core.models import XISUpstream

logger = logging.getLogger('dict_config_logger')


class Command(BaseCommand):
    """Django command to load Metadata_Ledger and Supplemental_Ledger from
        additional Experience Index Services (XIS)"""

    def add_arguments(self, parser):
        parser.add_argument('--id', nargs='*', type=int,
                            help='list of IDs for XISUpstream objects to '
                            'run')
        parser.add_argument('--api', nargs='*', type=str,
                            help='list of APIs for XISUpstream objects to '
                            'run')

    def retrieve_records(self, upstream):
        """get records from XISUpstream"""

        headers = {'Content-Type': 'application/json'}

        xis_response = requests.get(
            url=upstream.xis_api_endpoint + 'metadata/',
            headers=headers, timeout=3.0)

        while (xis_response.status_code//10 == 20):
            for record in xis_response.json()['results']:
                self.save_record(upstream, bleach_data_to_json(record))

            if (xis_response.json()['next'] is not None):
                xis_response = requests.get(
                    url=xis_response.json()['next'], headers=headers,
                    timeout=3.0)
            else:
                return

        logger.error(
            "HTTP Error %s from %s", xis_response.status_code, upstream)

    def save_record(self, upstream, record):
        """saves record to metadata and supplemental ledgers as needed"""
        # Tracking source of changes to metadata/supplementary data
        record['updated_by'] = "System"
        record['unique_record_identifier'] = str(uuid.uuid4())

        # Detach supplemental metadata and metadata from consolidated data
        metadata_data, supplemental_data = \
            detach_metadata_ledger_from_supplemental_ledger(record)

        metadata, metadata_instance = add_metadata_ledger(
            metadata_data,
            record['metadata_key_hash'])

        supplementalData, supplemental_instance = \
            add_supplemental_ledger(
                supplemental_data, record['metadata_key_hash'])

        if metadata_instance:
            metadata['metadata_key'] = metadata_instance.metadata_key

        # Assign data from request to serializer
        metadata_serializer = MetadataLedgerSerializer(metadata_instance,
                                                       data=metadata)

        # Assign data from request to serializer
        supplemental_serializer = \
            SupplementalLedgerSerializer(supplemental_instance,
                                         data=supplementalData)

        if metadata_serializer.is_valid():
            metadata_serializer.save()
            upstream.metadata_experiences.add(metadata_serializer.instance)

        if supplemental_serializer.is_valid():
            supplemental_serializer.save()
            upstream.supplemental_experiences.add(
                supplemental_serializer.instance)

    def handle(self, *args, **options):
        """Metadata load from XIS to Metadata and Supplemental Ledgers"""
        # filter to only active XISDownstream objects
        upstream_apis = XISUpstream.objects.all().filter(
            xis_api_endpoint_status=XISUpstream.ACTIVE)
        # if there are ids as an arg, filter to only those ids
        if ('id' in options and options['id']):
            upstream_apis = upstream_apis.filter(pk__in=options['id'])
        # if there are apis as an arg, filter to only those apis
        if ('api' in options and options['api']):
            upstream_apis = upstream_apis.filter(
                xis_api_endpoint__in=options['api'])

        # iterate over upstream objects
        for us in upstream_apis:
            self.retrieve_records(us)
