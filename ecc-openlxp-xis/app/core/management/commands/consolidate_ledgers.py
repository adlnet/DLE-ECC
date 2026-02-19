import hashlib
import logging

from django.core.management.base import BaseCommand
from django.utils import timezone

from core.management.utils.transform_ledgers import \
    append_metadata_ledger_with_supplemental_ledger
from core.models import CompositeLedger, MetadataLedger, SupplementalLedger

logger = logging.getLogger('dict_config_logger')


def put_metadata_ledger_into_composite_ledger(data):
    """ Take Metadata_Ledger data to post to Composite_Ledger"""
    for row in data:
        # Retrieving the supplemental metadata with metadata data
        # from the ledgers
        composite_ledger_dict, supplemental_metadata = \
            append_metadata_ledger_with_supplemental_ledger(row)

        # Hashing the composite metadata
        composite_metadata_hash = hashlib.sha512(
            str(composite_ledger_dict).encode('utf-8')).hexdigest()

        # Setting record_status & deleted_date for updated record
        CompositeLedger.objects.filter(
            metadata_key_hash=row['metadata_key_hash'],
            record_status='Active').exclude(
            metadata_hash=composite_metadata_hash).update(
            date_deleted=timezone.now())
        CompositeLedger.objects.filter(
            metadata_key_hash=row['metadata_key_hash'],
            record_status='Active').exclude(
            metadata_hash=composite_metadata_hash).update(
            record_status='Inactive')
        CompositeLedger.objects.filter(
            metadata_key_hash=row['metadata_key_hash'],
            record_status='Active').exclude(
            metadata_hash=composite_metadata_hash).update(
            metadata_transmission_status="Cancelled")

        # Retrieving existing records or creating new record to CompositeLedger
        CompositeLedger.objects.get_or_create(
            metadata_key=row['metadata_key'],
            metadata_key_hash=row['metadata_key_hash'],
            metadata=composite_ledger_dict,
            metadata_hash=composite_metadata_hash,
            date_inserted=timezone.now(),
            updated_by=row['updated_by'],
            record_status='Active',
            provider_name=row['provider_name'])

        # Updating existing transmission status in Metadata Ledger
        MetadataLedger.objects.filter(
            metadata_key_hash=row['metadata_key_hash'],
            record_status='Active').update(
            composite_ledger_transmission_status='Successful',
            composite_ledger_transmission_date=timezone.now())

        # Updating existing transmission status in Supplemental Ledger
        if supplemental_metadata:
            SupplementalLedger.objects.filter(
                metadata_key_hash=supplemental_metadata[
                    'metadata_key_hash'], record_status='Active').update(
                composite_ledger_transmission_status='Successful',
                composite_ledger_transmission_date=timezone.now())

    check_metadata_ledger_transmission_ready_record()


def check_metadata_ledger_transmission_ready_record():
    """Retrieve number of Metadata_Ledger transmission ready records in XIS to
    load into Composite_Ledger """

    # retrieving the metadata objects ready to get consolidated
    data = MetadataLedger.objects.filter(
        metadata_validation_status='Y',
        record_status='Active',
        composite_ledger_transmission_status='Ready').values(
        'metadata_key',
        'metadata_key_hash',
        'metadata_hash',
        'metadata',
        'provider_name',
        'updated_by')

    # Checking available no. of records to transmit in XIS Metadata Ledger
    if len(data) == 0:
        logger.info("Metadata_Ledger data loading in XIS composite ledger is "
                    "complete")
    else:
        put_metadata_ledger_into_composite_ledger(data)


class Command(BaseCommand):
    """Django command to consolidate the XIS data into XIS Composite_Ledger"""

    def handle(self, *args, **options):
        """ Consolidate the XIS metadata into XIS Composite_Ledger"""
        check_metadata_ledger_transmission_ready_record()
