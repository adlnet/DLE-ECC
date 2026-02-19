import logging
from unittest.mock import patch

from ddt import ddt
from django.test import tag

from core.management.commands.consolidate_ledgers import (
    check_metadata_ledger_transmission_ready_record,
    put_metadata_ledger_into_composite_ledger)
from core.management.commands.load_metadata_into_xse import (
    check_records_to_load_into_xse, post_data_to_xse)
from core.models import CompositeLedger, MetadataLedger

from .test_setup import TestSetUp

logger = logging.getLogger('dict_config_logger')


@tag('integration')
@ddt
class CommandIntegration(TestSetUp):
    """Test cases for consolidate_ledgers """

    def test_put_metadata_ledger_into_composite_ledger(self):
        """Test to take Metadata_Ledger data to post to Composite_Ledger """
        self.metadata_ledger.save()
        self.supplemental_ledger.save()
        data = MetadataLedger.objects.filter(
            metadata_validation_status='Y',
            record_status='Active',
            composite_ledger_transmission_status='Ready').values(
            'unique_record_identifier',
            'metadata_key',
            'metadata_key_hash',
            'metadata_hash',
            'metadata',
            'provider_name',
            'updated_by')
        put_metadata_ledger_into_composite_ledger(data)

        result_query_composite_ledger = CompositeLedger.objects.values(
            'metadata_key',
            'metadata_key_hash',
            'metadata_hash',
            'metadata',
            'date_inserted',
            'updated_by',
            'record_status',
            'provider_name').filter(
            metadata_key=self.metadata_key).first()

        result_query_metadata_ledger = MetadataLedger.objects.values(
            'composite_ledger_transmission_status',
            'composite_ledger_transmission_date').filter(
            unique_record_identifier=self.unique_record_identifier).first()

        self.assertTrue(result_query_metadata_ledger.get(
            'composite_ledger_transmission_status'))
        self.assertTrue(result_query_metadata_ledger.get(
            'composite_ledger_transmission_date'))
        self.assertEquals(data[0].get('metadata_key'),
                          result_query_composite_ledger['metadata_key'])
        self.assertEquals(data[0].get('metadata_key_hash'),
                          result_query_composite_ledger.get(
                              'metadata_key_hash'))
        self.assertEquals(self.composite_ledger_metadata_hash_valid,
                          result_query_composite_ledger.get('metadata_hash'))
        self.assertTrue(result_query_composite_ledger.get('date_inserted'))
        self.assertEquals(self.updated_by,
                          result_query_composite_ledger.get('updated_by'))
        self.assertEquals(data[0].get('provider_name'),
                          result_query_composite_ledger.get('provider_name'))

    def test_check_metadata_ledger_transmission_ready_record_one_record(
            self):
        """Test to retrieve number of Metadata_Ledger transmission ready
        records in XIS to load into Composite_Ledger """
        with patch('core.management.commands.consolidate_ledgers'
                   '.put_metadata_ledger_into_composite_ledger',
                   return_value=None
                   ) as mock_put_metadata_ledger_into_composite_ledger:
            self.metadata_ledger.save()
            check_metadata_ledger_transmission_ready_record()
            self.assertEqual(
                mock_put_metadata_ledger_into_composite_ledger.call_count, 1)

    def test_check_metadata_ledger_transmission_ready_record_zero_record(self):
        """Test to retrieve number of Metadata_Ledger transmission ready
        records in XIS to load into Composite_Ledger """
        with patch('core.management.commands.consolidate_ledgers'
                   '.put_metadata_ledger_into_composite_ledger',
                   return_value=None
                   ) as mock_put_metadata_ledger_into_composite_ledger:
            check_metadata_ledger_transmission_ready_record()
            self.assertEqual(
                mock_put_metadata_ledger_into_composite_ledger.call_count, 0)

    """Test cases for load_metadata_into_xse """

    def test_post_data_to_xse_created(self):
        """Test for POSTing XIS composite_ledger to XSE in JSON format when
            record gets created in XSE"""

        self.composite_ledger.save()

        data = CompositeLedger.objects.filter(
            record_status='Active',
            metadata_transmission_status='Ready').values(
            'metadata_key_hash',
            'metadata')

        post_data_to_xse(data)

        result_query = CompositeLedger.objects.values(
            'metadata_transmission_status_code',
            'metadata_transmission_status',
            'date_transmitted').filter(
            metadata_key_hash=self.metadata_key_hash).first()

        self.assertTrue(result_query.get(
            'metadata_transmission_status_code'))
        self.assertEqual('Successful', result_query.get(
            'metadata_transmission_status'))
        self.assertTrue(result_query.get(
            'date_transmitted'))

    def test_check_records_to_load_into_xse_one_record(self):
        """Test to retrieve number of Composite_Ledger records in XIS to load
         into XSE and calls the post_data_to_xis accordingly"""
        with patch('core.management.commands.load_metadata_into_xse'
                   '.post_data_to_xse',
                   return_value=None) as mock_post_data_to_xse:
            self.composite_ledger.save()
            check_records_to_load_into_xse()
            self.assertEqual(
                mock_post_data_to_xse.call_count, 1)

    def test_check_records_to_load_into_xse_zero_record(self):
        """Test to retrieve number of Composite_Ledger records in XIS to load
        into XSE and calls the post_data_to_xis accordingly"""
        with patch('core.management.commands.load_metadata_into_xse'
                   '.post_data_to_xse', return_value=None) as \
                mock_post_data_to_xse:
            check_records_to_load_into_xse()
            self.assertEqual(
                mock_post_data_to_xse.call_count, 0)
