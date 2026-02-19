import copy
import json
import logging

import elasticsearch
import requests
from django.core.management.base import BaseCommand
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Q
from django.utils import timezone
from elasticsearch import Elasticsearch

from core.management.utils.xse_client import (get_autocomplete_field,
                                              get_elasticsearch_endpoint,
                                              get_elasticsearch_index,
                                              get_filter_field)
from core.models import CompositeLedger

es = Elasticsearch()

logger = logging.getLogger('dict_config_logger')


def renaming_xis_for_posting_to_xse(data):
    """Renaming XIS column names to match with XSE"""

    data['_id'] = data.pop('metadata_key_hash')
    data['metadata'] = data.pop('metadata')
    return data


def post_data_to_xse(data):
    """POSTing XIS composite_ledger to XSE in JSON format"""
    # Traversing through each row one by one from data
    for row in data:
        # Creating nested json format for XSE
        composite_ledger = create_xse_json_document(row)

        data = renaming_xis_for_posting_to_xse(row)
        renamed_data = json.dumps(composite_ledger, cls=DjangoJSONEncoder)
        # Getting UUID to update metadata_transmission_status to pending
        metadata_key_hash_val = data.get('_id')

        # Updating status in XIS Composite_Ledger to 'Pending'
        CompositeLedger.objects.filter(
            metadata_key_hash=metadata_key_hash_val).update(
            metadata_transmission_status='Pending')
        # POSTing Composite_Ledger to XSE
        try:
            es = Elasticsearch(get_elasticsearch_endpoint())
            res = es.index(index=get_elasticsearch_index(), doc_type="_doc",
                           id=data['_id'],
                           body=renamed_data)

            # Receiving XSE response after validation and updating
            # Composite_Ledger
            if res['result'] == "created" or res['result'] == "updated":
                CompositeLedger.objects.filter(
                    metadata_key_hash=metadata_key_hash_val).update(
                    metadata_transmission_status_code=res['result'],
                    metadata_transmission_status='Successful',
                    date_transmitted=timezone.now())
            else:
                CompositeLedger.objects.filter(
                    metadata_key_hash=metadata_key_hash_val).update(
                    metadata_transmission_status_code=res['result'],
                    metadata_transmission_status='Failed',
                    date_transmitted=timezone.now())
                logger.warning("Bad request sent " + str(res['result'])
                               + "error found ")

        except requests.exceptions.RequestException as e:
            logger.error(e)
            # Updating status in XIS metadata_ledger to 'Failed'
            CompositeLedger.objects.filter(
                metadata_key_hash=metadata_key_hash_val).update(
                metadata_transmission_status='Failed')
            raise SystemExit('Exiting! Can not make connection with XSE.')

        except elasticsearch.exceptions.ConnectionError as e:
            logging.error(e)
            CompositeLedger.objects.filter(
                metadata_key_hash=metadata_key_hash_val).update(
                metadata_transmission_status='Failed')
            raise SystemExit('Exiting! Connection error with elastic search')
        except elasticsearch.exceptions.RequestError as e:
            logging.error(e)
            CompositeLedger.objects.filter(
                metadata_key_hash=metadata_key_hash_val).update(
                metadata_transmission_status='Pending')
            continue

    check_records_to_load_into_xse()


def create_xse_json_document(row):
    """ Function to Create nested json for XSE """
    composite_ledger_dict = {}
    # Removing empty/Null data fields in supplemental data to be sent to XSE
    supplemental_data = {}
    if 'Supplemental_Ledger' in row['metadata'] and\
            row['metadata']['Supplemental_Ledger'] and\
            row['metadata']['Supplemental_Ledger']:
        supplemental_data = {k: v for k, v in row['metadata'][
            'Supplemental_Ledger'].items() if v != "NaT"
            and v and v != "null"}
    composite_ledger_dict = {"Supplemental_Ledger": supplemental_data}
    for item in row['metadata']['Metadata_Ledger']:
        # Removing empty/Null data fields in metadata to be sent to XSE
        for item_nested in row['metadata']['Metadata_Ledger'][item]:
            if not row['metadata']['Metadata_Ledger'][item][item_nested] or \
                    row['metadata']['Metadata_Ledger'][item][item_nested] == \
                    "NaT" or \
                    row['metadata']['Metadata_Ledger'][item][item_nested] == \
                    "null":
                row['metadata']['Metadata_Ledger'][item][item_nested] = None
    composite_ledger_dict.update(row['metadata']['Metadata_Ledger'])
    composite_ledger_dict = set_autocomplete_data(row, composite_ledger_dict)
    return composite_ledger_dict


def set_autocomplete_data(row, composite_ledger_dict):
    """helper function to add autocomplete and filter to json doc"""
    try:
        autocomplete_path = get_autocomplete_field().split('.')
        autocomplete = copy.deepcopy(row)
        for step in autocomplete_path:
            autocomplete = autocomplete[step]
        composite_ledger_dict['autocomplete'] = autocomplete
    except Exception as e:
        composite_ledger_dict['autocomplete'] = "Not Available"
        logging.error(e)
    try:
        filter_path = get_filter_field().split('.')
        filtering_object = copy.deepcopy(row)
        for step in filter_path:
            filtering_object = filtering_object[step]
        composite_ledger_dict['filter'] = filtering_object
    except Exception as e:
        composite_ledger_dict['filter'] = "Not Available"
        logging.error(e)
    return composite_ledger_dict


def check_records_to_load_into_xse():
    """Retrieve number of Composite_Ledger records in XIS to load into XSE and
    calls the post_data_to_xis accordingly"""

    data = CompositeLedger.objects.filter((
        Q(metadata_transmission_status='Ready') | Q(
            metadata_transmission_status='Failed')) &
        Q(record_status='Active')).values()

    # Checking available no. of records in XIA to load into XIS is Zero or not
    if len(data) == 0:
        # Making Pending records to failed
        CompositeLedger.objects.filter(
            metadata_transmission_status='Pending').update(
            metadata_transmission_status='Failed')
        logger.info("Data Loading in XSE is complete, Zero records are "
                    "available in XIS to transmit")
    else:
        post_data_to_xse(data)


def setup_index():
    """Sets up index and mapping if needed"""
    try:
        es = Elasticsearch(get_elasticsearch_endpoint()).indices

        # create index with mapping if needed
        if not es.exists(index=get_elasticsearch_index()):
            es.create(index=get_elasticsearch_index(
            ), body='{"mappings": {"properties": {"filter": {' +
                '"type":  "keyword"},"autocomplete": {"type": "completion"' +
                ',"contexts": [{"name": "filter","type": "category","path":' +
                ' "filter"}]}}}}')
        # add mapping if needed
        elif len(es.get_field_mapping(fields='autocomplete',
                                      index=get_elasticsearch_index())
                 [get_elasticsearch_index()]['mappings']) == 0:
            es.put_mapping(index=get_elasticsearch_index(
            ), body='{"mappings": {"properties": {"filter": {' +
                '"type":  "keyword"},"autocomplete": {"type": "completion"' +
                ',"contexts": [{"name": "filter","type": "category","path":' +
                ' "filter"}]}}}}')

        # continue workflow
        check_records_to_load_into_xse()
    except Exception as e:
        logging.error(e)
        raise SystemExit('Exiting! Connection error with elastic search')


class Command(BaseCommand):
    """Django command to load Composite_Ledger in the Experience Search Engine
        (XSE)"""

    def handle(self, *args, **options):
        """Metadata load from XIS Composite_Ledger to XSE"""
        setup_index()
