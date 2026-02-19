import logging

from core.models import SupplementalLedger

logger = logging.getLogger('dict_config_logger')


def append_metadata_ledger_with_supplemental_ledger(data):
    """ Get supplemental metadata and consolidate it with
    metadata ledger data"""

    # retrieving the supplemental data corresponding to the data value
    supplemental_metadata = SupplementalLedger.objects.filter(
        metadata_key=data['metadata_key'],
        metadata_key_hash=data['metadata_key_hash'],
        record_status='Active').values('metadata',
                                       'metadata_key_hash', 'record_status',
                                       'metadata_hash').first()

    # Consolidating Metadata Ledger with Supplemental Ledger
    if supplemental_metadata:
        composite_ledger_dict = {"Metadata_Ledger": data['metadata'],
                                 "Supplemental_Ledger": supplemental_metadata[
                                     'metadata']}
    else:
        composite_ledger_dict = {"Metadata_Ledger": data['metadata'],
                                 "Supplemental_Ledger": None}

    return composite_ledger_dict, supplemental_metadata


def detach_metadata_ledger_from_supplemental_ledger(data):
    """ Detach supplemental metadata and metadata from consolidated data"""

    # initializing the data objects
    metadata_data = {}
    supplemental_data = {}

    # initializing the fields required for the metadata and
    # supplemental data ledgers
    metadata_fields = ['unique_record_identifier', 'metadata_key',
                       'metadata_key_hash', 'metadata_hash', 'metadata',
                       'provider_name', 'metadata_validation_status',
                       'record_status', 'updated_by']
    supplemental_fields = ['unique_record_identifier', 'metadata_key',
                           'metadata_key_hash', 'metadata_hash', 'metadata',
                           'provider_name', 'record_status', 'updated_by']

    # assigning the metadata and supplemental data to be saved in the ledgers
    if data:
        metadata_data = {key: data[key] if key in data else ''
                         for key in metadata_fields}
        supplemental_data = {key: data[key] if key in data else ''
                             for key in supplemental_fields}

        metadata_data['metadata'] = data['metadata']['Metadata_Ledger']
        supplemental_data['metadata'] = data['metadata']['Supplemental_Ledger']

    return metadata_data, supplemental_data
