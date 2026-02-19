import json
import logging
from unittest.mock import Mock, patch

from ddt import ddt
from django.core.management import call_command
from django.db.utils import OperationalError
from django.test import tag
from neo4j import GraphDatabase

from core.management.commands.consolidate_ledgers import (
    append_metadata_ledger_with_supplemental_ledger,
    check_metadata_ledger_transmission_ready_record,
    put_metadata_ledger_into_composite_ledger)
from core.management.commands.load_metadata_from_xis import Command
from core.management.commands.load_metadata_into_neo4j import (
    check_records_to_load_into_neo4j, connect_to_neo4j_driver,
    post_data_to_neo4j, post_metadata_ledger_to_neo4j,
    post_supplemental_ledger_to_neo4j)
from core.management.commands.load_metadata_into_xis import Command as iCommand
from core.management.commands.load_metadata_into_xse import (
    check_records_to_load_into_xse, create_xse_json_document, post_data_to_xse,
    renaming_xis_for_posting_to_xse, setup_index)
from core.management.utils.xse_client import get_elasticsearch_index
from core.models import (CompositeLedger, MetadataLedger, XISDownstream,
                         XISUpstream)

from .test_setup import TestSetUp

logger = logging.getLogger('dict_config_logger')


@tag('unit')
@ddt
class CommandTests(TestSetUp):
    """Test cases for waitdb """

    def test_wait_for_db_ready(self):
        """Test that waiting for db when db is available"""
        with patch('django.db.utils.ConnectionHandler.__getitem__') as gi:
            gi.return_value = gi
            gi.ensure_connection.return_value = True
            call_command('waitdb')
            self.assertEqual(gi.call_count, 1)

    @patch('time.sleep', return_value=True)
    def test_wait_for_db(self, ts):
        """Test waiting for db"""
        with patch('django.db.utils.ConnectionHandler.__getitem__') as gi:
            gi.return_value = gi
            gi.ensure_connection.side_effect = [OperationalError] * 5 + [True]
            call_command('waitdb')
            self.assertEqual(gi.ensure_connection.call_count, 6)

    """Test cases for consolidate_ledgers """

    def test_put_metadata_ledger_into_composite_ledger_zero(self):
        """Test for POSTing XIA metadata_ledger to XIS metadata_ledger
        when data is not present"""
        data = []
        with patch('core.management.commands.consolidate_ledgers'
                   '.check_metadata_ledger_transmission_ready_record',
                   return_value=None) as mock_check_records_to_load:
            put_metadata_ledger_into_composite_ledger(data)
            self.assertEqual(mock_check_records_to_load.call_count, 1)

    def test_check_metadata_ledger_transmission_ready_record_one_record(self):
        """Test to Retrieve number of Metadata_Ledger transmission ready
        records in XIS to load into Composite_Ledger"""
        with patch('core.management.commands.'
                   'consolidate_ledgers'
                   '.put_metadata_ledger_into_composite_ledger',
                   return_value=None)as \
                mock_post_data_to_composite_ledger, \
                patch('core.management.commands.'
                      'consolidate_ledgers'
                      '.MetadataLedger.objects') as meta_obj:
            meta_data = MetadataLedger(
                metadata_validation_status='Y',
                record_status='Active',
                composite_ledger_transmission_status='Failed',
                unique_record_identifier=self.unique_record_identifier,
                metadata_key=self.metadata_key,
                metadata_key_hash=self.metadata_key_hash,
                metadata_hash=self.metadata_hash,
                metadata=self.metadata,
                provider_name=self.provider_name)
            meta_obj.return_value = meta_obj
            meta_obj.exclude.return_value = meta_obj
            meta_obj.values.return_value = [meta_data]
            meta_obj.filter.side_effect = [meta_obj, meta_obj]
            check_metadata_ledger_transmission_ready_record()
            self.assertEqual(
                mock_post_data_to_composite_ledger.call_count, 1)

    def test_check_metadata_ledger_transmission_ready_record_zero(self):
        """Test to Retrieve number of Metadata_Ledger records in XIA to load
        into XIS  and calls the post_data_to_xis accordingly"""
        with patch('core.management.commands.'
                   'consolidate_ledgers'
                   '.put_metadata_ledger_into_composite_ledger',
                   return_value=None)as \
                mock_post_data_to_composite_ledger, \
                patch('core.management.commands.'
                      'consolidate_ledgers.MetadataLedger.'
                      'objects') as meta_obj:
            meta_obj.return_value = meta_obj
            meta_obj.exclude.return_value = meta_obj
            meta_obj.filter.side_effect = [meta_obj, meta_obj]
            check_metadata_ledger_transmission_ready_record()
            self.assertEqual(
                mock_post_data_to_composite_ledger.call_count, 0)

    def test_append_metadata_ledger_with_supplemental_ledger(self):
        """Test to get supplemental metadata to further merge it into metadata
        ledger"""
        with patch('core.management.commands.'
                   'consolidate_ledgers.SupplementalLedger.objects') as \
                Supplemental_obj, \
                patch('core.management.commands.'
                      'consolidate_ledgers.MetadataLedger.objects'
                      ) as meta_obj:
            meta_obj.return_value = meta_obj
            meta_obj.filter.return_value = self.metadata_ledger
            meta_obj.first.return_value = meta_obj

            Supplemental_obj.return_value = Supplemental_obj
            Supplemental_obj.filter.return_value = self.supplemental_ledger
            Supplemental_obj.first.return_value = Supplemental_obj

            for row in meta_obj:
                composite_ledger_dict, supplemental_metadata = \
                    append_metadata_ledger_with_supplemental_ledger(row)
                logger.info(composite_ledger_dict)
                logger.info(supplemental_metadata)

                self.assertTrue(composite_ledger_dict)
                self.assertEquals(self.supplement_metadata,
                                  supplemental_metadata)

    def test_append_metadata_ledger_without_supplemental_ledger(self):
        """Test to get supplemental metadata to further merge it into metadata
        ledger"""
        with patch('core.management.commands.'
                   'consolidate_ledgers.SupplementalLedger.objects',
                   return_value=None), \
                patch('core.management.commands.consolidate_ledgers.'
                      'MetadataLedger.objects') as meta_obj:
            meta_obj.return_value = meta_obj
            meta_obj.filter.return_value = self.metadata_ledger
            meta_obj.first.return_value = meta_obj

            for row in meta_obj:
                composite_ledger_dict, supplemental_metadata = \
                    append_metadata_ledger_with_supplemental_ledger(row)

                self.assertTrue(composite_ledger_dict)
                self.assertTrue(supplemental_metadata)

    """Test cases for load_metadata_into_xse """

    def test_setup_index_no_index(self):
        """Test to create index with mapping"""
        with patch('core.management.commands.load_metadata_into_xse'
                   '.check_records_to_load_into_xse', return_value=None)as \
                mock_check_records_to_load_into_xse, \
                patch('core.management.commands.load_metadata_into_xse'
                      '.Elasticsearch') as mock_es:
            mock_es.exists.return_value = False
            mock_es.indices = mock_es
            mock_es.indices.return_value = mock_es
            setup_index()
            self.assertEqual(
                mock_check_records_to_load_into_xse.call_count, 1)
            self.assertEqual(mock_es.create.call_count, 1)

    def test_setup_index_add_mapping(self):
        """Test to update index with mapping"""
        with patch('core.management.commands.load_metadata_into_xse'
                   '.check_records_to_load_into_xse', return_value=None)as \
                mock_check_records_to_load_into_xse, \
                patch('core.management.commands.load_metadata_into_xse'
                      '.Elasticsearch') as mock_es:
            mock_es.exists.return_value = True
            mock_es.indices = mock_es
            mock_es.indices.return_value = mock_es
            mock_es.get_field_mapping.return_value = {
                get_elasticsearch_index(): {'mappings': []}}
            setup_index()
            self.assertEqual(
                mock_check_records_to_load_into_xse.call_count, 1)
            self.assertEqual(mock_es.put_mapping.call_count, 1)

    def test_setup_index_already_mapped(self):
        """Test to not update index when already mapped"""
        with patch('core.management.commands.load_metadata_into_xse'
                   '.check_records_to_load_into_xse', return_value=None)as \
                mock_check_records_to_load_into_xse, \
                patch('core.management.commands.load_metadata_into_xse'
                      '.Elasticsearch') as mock_es:
            mock_es.exists.return_value = True
            mock_es.indices = mock_es
            mock_es.indices.return_value = mock_es
            mock_es.get_field_mapping.return_value = {
                get_elasticsearch_index(): {'mappings': {"properties": {
                    "filter": {"type":  "keyword"}, "autocomplete": {
                        "type": "completion", "contexts": [
                            {"name": "filter", "type": "category", "path":
                             "filter"}]}}}}}
            setup_index()
            self.assertEqual(
                mock_check_records_to_load_into_xse.call_count, 1)
            self.assertEqual(mock_es.put_mapping.call_count, 0)
            self.assertEqual(mock_es.create.call_count, 0)

    def test_setup_index_fails(self):
        """Test exits when error raised"""
        with patch('core.management.commands.load_metadata_into_xse'
                   '.check_records_to_load_into_xse', return_value=None)as \
                mock_check_records_to_load_into_xse, \
                patch('core.management.commands.load_metadata_into_xse'
                      '.Elasticsearch', side_effect=Exception()) as mock_es:
            self.assertRaises(SystemExit, setup_index)
            self.assertEqual(
                mock_check_records_to_load_into_xse.call_count, 0)
            self.assertEqual(mock_es.put_mapping.call_count, 0)
            self.assertEqual(mock_es.create.call_count, 0)

    def test_create_xse_json_document_empty(self):
        """Test creation of XSE formatted data when no input"""

        resp = create_xse_json_document({'metadata': {'Metadata_Ledger': {}}})
        self.assertEqual(len(resp), 3)
        self.assertEqual(resp['autocomplete'], "Not Available")
        self.assertEqual(resp['filter'], "Not Available")
        self.assertEqual(resp['Supplemental_Ledger'], {})

    def test_create_xse_json_document_autocomplete_and_filter(self):
        """Test creation of XSE formatted data with autocomplete and filter"""
        exp_metadata = {'metadata': {'Metadata_Ledger': {
            "Course": {"CourseTitle": "TestTitle"}}}}

        resp = create_xse_json_document({**exp_metadata, "provider_name":
                                         "TestProvider"})
        self.assertEqual(len(resp), 4)
        self.assertEqual(resp['autocomplete'], "TestTitle")
        self.assertEqual(resp['filter'], "TestProvider")
        self.assertEqual(resp['Supplemental_Ledger'], {})

    def test_renaming_xis_for_posting_to_xse(self):
        """Test for Renaming XIS column names to match with XSE"""
        return_data = renaming_xis_for_posting_to_xse(self.xis_data)
        self.assertEquals(self.xse_expected_data['_id'],
                          return_data['_id'])
        self.assertEquals(self.xse_expected_data['metadata'],
                          return_data['metadata'])

    def test_check_records_to_load_into_xse_one_record(self):
        """Test to Retrieve number of Composite_Ledger records in XIS to load
        into XSE and calls the post_data_to_xis accordingly for one record"""
        with patch('core.management.commands.load_metadata_into_xse'
                   '.post_data_to_xse', return_value=None)as \
                mock_post_data_to_xse, \
                patch('core.management.commands.load_metadata_into_xse'
                      '.CompositeLedger.objects') as composite_obj:
            composite_data = CompositeLedger(
                record_status='Active',
                metadata_transmission_status='Ready',
                metadata_key_hash=self.metadata_key_hash,
                metadata=self.metadata)
            composite_obj.filter.return_value = composite_obj
            composite_obj.values.return_value = [composite_data]
            check_records_to_load_into_xse()
            self.assertEqual(
                mock_post_data_to_xse.call_count, 1)

    def test_check_records_to_load_into_xse_zero(self):
        """Test to Retrieve number of Composite_Ledger records in XIS to load
        into XSE and calls the post_data_to_xis accordingly for zero records"""
        with patch('core.management.commands.load_metadata_into_xse'
                   '.post_data_to_xse', return_value=None)as \
                mock_post_data_to_xse, \
                patch('core.management.commands.load_metadata_into_xse'
                      '.CompositeLedger.objects') as meta_obj:
            meta_obj.return_value = meta_obj
            meta_obj.exclude.return_value = meta_obj
            meta_obj.update.return_value = meta_obj
            meta_obj.filter.side_effect = [meta_obj, meta_obj, meta_obj]
            check_records_to_load_into_xse()
            self.assertEqual(
                mock_post_data_to_xse.call_count, 0)

    def test_json_doc_creation_for_xse(self):
        """Test for function to Create nested json for XSE"""

        with patch('core.management.commands.'
                   'load_metadata_into_xse.CompositeLedger.objects') \
                as composite_obj:
            composite_obj.return_value = composite_obj
            composite_obj.filter.return_value = self.composite_ledger
            composite_obj.first.return_value = composite_obj

            for row in composite_obj:
                composite_ledger_dict = create_xse_json_document(row)

                self.assertEquals(self.composite_ledger_dict_xse_updated,
                                  composite_ledger_dict)

    def test_post_data_to_xse_zero(self):
        """Test POSTing XIS composite_ledger to XSE in JSON format
         data is not present"""
        data = []
        with patch('core.management.commands.load_metadata_into_xse'
                   '.renaming_xis_for_posting_to_xse',
                   return_value=self.xse_expected_data), \
                patch('core.management.commands.load_metadata_into_xse'
                      '.CompositeLedger.objects') as composite_obj, \
                patch('elasticsearch.Elasticsearch.index') as response_obj, \
                patch('core.management.commands.load_metadata_into_xse'
                      '.create_xse_json_document', return_value=None), \
                patch('core.management.commands.load_metadata_into_xse'
                      '.check_records_to_load_into_xse', return_value=None
                      ) as mock_check_records_to_load_into_xse:
            response_obj.return_value = response_obj
            response_obj.return_value = {
                "result": "created"
            }

            composite_obj.return_value = composite_obj
            composite_obj.exclude.return_value = composite_obj
            composite_obj.update.return_value = composite_obj
            composite_obj.filter.side_effect = [composite_obj, composite_obj,
                                                composite_obj,
                                                composite_obj]

            post_data_to_xse(data)
            self.assertEqual(response_obj.call_count, 0)
            self.assertEqual(mock_check_records_to_load_into_xse.call_count, 1)

    def test_post_data_to_xse_more_than_one(self):
        """Test for POSTing XIS composite_ledger to XSE in JSON format
        when more than one rows are passing"""
        data = [self.xis_data,
                self.xis_data]
        with patch('core.management.commands.load_metadata_into_xse'
                   '.renaming_xis_for_posting_to_xse',
                   return_value=self.xse_expected_data), \
                patch('core.management.commands.load_metadata_into_xse'
                      '.CompositeLedger.objects') as composite_obj, \
                patch('core.management.commands.load_metadata_into_xse'
                      '.Elasticsearch') as es_construct, \
                patch('core.management.commands.load_metadata_into_xse'
                      '.create_xse_json_document', return_value=None), \
                patch('core.management.commands.load_metadata_into_xse'
                      '.check_records_to_load_into_xse', return_value=None
                      ) as mock_check_records_to_load_into_xse:
            es_instance = es_construct.return_value
            es_construct.return_value = es_instance
            es_instance.return_value = es_instance
            es_instance.index.return_value = {
                "result": "created"
            }

            composite_obj.return_value = composite_obj
            composite_obj.exclude.return_value = composite_obj
            composite_obj.update.return_value = composite_obj
            composite_obj.filter.side_effect = [composite_obj, composite_obj,
                                                composite_obj,
                                                composite_obj]

            post_data_to_xse(data)
            self.assertEqual(es_instance.index.call_count, 2)
            self.assertEqual(mock_check_records_to_load_into_xse.call_count, 1)

    """Test cases for load_metadata_into_neo4j """

    def test_check_records_to_load_into_neo4j_one_record(self):
        """Test to Retrieve number of Composite_Ledger records in XIS to load
        into Neo4j and calls the post_data_to_neo4j accordingly for one
        record"""
        with patch('core.management.commands.load_metadata_into_neo4j'
                   '.post_data_to_neo4j', return_value=None)as \
                mock_post_data_to_neo4j, \
                patch('core.management.commands.load_metadata_into_neo4j'
                      '.CompositeLedger.objects') as composite_obj:
            composite_data = CompositeLedger(
                record_status='Active',
                metadata_transmission_status='Ready',
                metadata_key_hash=self.metadata_key_hash,
                metadata=self.metadata)
            composite_obj.return_value = composite_obj
            composite_obj.exclude.return_value = composite_obj
            composite_obj.values.return_value = [composite_data]
            composite_obj.filter.side_effect = [composite_obj, composite_obj]
            check_records_to_load_into_neo4j()
            self.assertEqual(
                mock_post_data_to_neo4j.call_count, 1)

    def test_check_records_to_load_into_neo4j_zero(self):
        """Test to Retrieve number of Composite_Ledger records in XIS to load
        into neo4j and calls the post_data_to_neo4j accordingly for
        zero records"""
        with patch('core.management.commands.load_metadata_into_neo4j'
                   '.post_data_to_neo4j', return_value=None)as \
                mock_post_data_to_neo4j, \
                patch('core.management.commands.load_metadata_into_neo4j'
                      '.CompositeLedger.objects') as meta_obj:
            meta_obj.return_value = meta_obj
            meta_obj.exclude.return_value = meta_obj
            meta_obj.update.return_value = meta_obj
            meta_obj.filter.side_effect = [meta_obj, meta_obj, meta_obj]
            check_records_to_load_into_neo4j()
            self.assertEqual(
                mock_post_data_to_neo4j.call_count, 0)

    def test_post_data_to_neo4j_zero(self):
        """Test for POSTing XIS composite_ledger to Neo4j in JSON format"""
        data = []
        with patch('core.management.commands.load_metadata_into_neo4j'
                   '.connect_to_neo4j_driver',
                   return_value=None), \
                patch('core.management.commands.load_metadata_into_neo4j'
                      '.CompositeLedger.objects') as composite_obj, \
                patch('core.management.commands.load_metadata_into_neo4j'
                      '.post_metadata_ledger_to_neo4j', return_value=None) \
                as mock_post_metadata_ledger_to_neo4j, \
                patch('core.management.commands.load_metadata_into_neo4j'
                      '.post_supplemental_ledger_to_neo4j', return_value=None
                      ) as mock_post_supplemental_ledger_to_neo4j:
            composite_obj.return_value = composite_obj
            composite_obj.exclude.return_value = composite_obj
            composite_obj.update.return_value = composite_obj
            composite_obj.filter.side_effect = [composite_obj, composite_obj,
                                                composite_obj,
                                                composite_obj]

            post_data_to_neo4j(data)
            self.assertEqual(mock_post_metadata_ledger_to_neo4j.call_count, 0)
            self.assertEqual(mock_post_supplemental_ledger_to_neo4j.call_count,
                             0)

    def test_post_data_to_neo4j_more_than_one(self):
        """Test for POSTing XIS composite_ledger to Neo4j in JSON format
        when more than one rows are passing"""
        data = [self.xis_data,
                self.xis_data]
        with patch('core.management.commands.load_metadata_into_neo4j'
                   '.connect_to_neo4j_driver',
                   return_value=None), \
                patch('core.management.commands.load_metadata_into_neo4j'
                      '.CompositeLedger.objects') as composite_obj, \
                patch('core.management.commands.load_metadata_into_neo4j'
                      '.post_metadata_ledger_to_neo4j', return_value=None) \
                as mock_post_metadata_ledger_to_neo4j, \
                patch('core.management.commands.load_metadata_into_neo4j'
                      '.post_supplemental_ledger_to_neo4j', return_value=None
                      ) as mock_post_supplemental_ledger_to_neo4j:
            composite_obj.return_value = composite_obj
            composite_obj.exclude.return_value = composite_obj
            composite_obj.update.return_value = composite_obj
            composite_obj.filter.side_effect = [composite_obj, composite_obj,
                                                composite_obj,
                                                composite_obj]

            post_data_to_neo4j(data)
            self.assertEqual(mock_post_metadata_ledger_to_neo4j.call_count, 2)
            self.assertEqual(mock_post_supplemental_ledger_to_neo4j.call_count,
                             2)

    def test_connect_to_neo4j_driver(self):
        """Test of Connection with Neo4j Driver"""
        with patch('core.management.commands.load_metadata_into_neo4j'
                   '.get_neo4j_auth') as obj_get_neo4j_auth, \
                patch('core.management.commands.load_metadata_into_neo4j'
                      '.get_neo4j_endpoint', return_value='neo4j://neo4j:7007'
                      ):
            obj_get_neo4j_auth.return_value = 'user_id', 'pwd'
            connection_driver = connect_to_neo4j_driver()
            self.assertTrue(connection_driver)

    def test_post_metadata_ledger_to_neo4j(self):
        """Test of Connection with Neo4j Driver"""
        with patch('neo4j.GraphDatabase.driver'):
            driver_connection = GraphDatabase.driver(uri='bolt://neo4j:7007',
                                                     auth=('user',
                                                           'password'))
            row = self.composite_data_valid
            post_metadata_ledger_to_neo4j(row, driver_connection)
            self.assertTrue(driver_connection.session.run())

    def test_post_supplemental_ledger_to_neo4j(self):
        """Test of Connection with Neo4j Driver"""
        with patch('neo4j.GraphDatabase.driver'):
            driver_connection = GraphDatabase.driver(uri='bolt://neo4j:7007',
                                                     auth=('user',
                                                           'password'))
            row = self.composite_data_valid
            post_supplemental_ledger_to_neo4j(row, driver_connection)
            self.assertTrue(driver_connection.session.run())

    def test_load_metadata_from_xis_with_options(self):
        """Test of arguments being passed into Upstream Syndication"""
        with patch('core.management.commands.load_metadata_from_xis.'
                   'XISUpstream.objects') as up:
            up.all.return_value = up
            up.filter.return_value = up
            com = Command()
            id_var = ['abc', ]
            api_var = ['123', ]
            com.handle(id=id_var, api=api_var)
            self.assertEqual(up.filter.call_count, 3)
            self.assertEqual(up.filter.call_args_list[0][1],
                             {"xis_api_endpoint_status": 'ACTIVE'})
            self.assertEqual(up.filter.call_args_list[1][1],
                             {"pk__in": id_var})
            self.assertEqual(up.filter.call_args[1],
                             {"xis_api_endpoint__in": api_var})

    def test_load_metadata_from_xis_retrieve_records(self):
        """Test of retrieving records from an Upstream Syndication"""
        with patch('core.management.commands.load_metadata_from_xis.'
                   'requests') as req,\
            patch('core.management.commands.load_metadata_from_xis'
                  '.Command.save_record'):
            mock = Mock()
            req.get.return_value = req
            # req.get.side_effect = [req, mock]
            req.json.side_effect = [
                {'results': [{'test': 'res'}]},
                {'next': 'test_url'},
                {'next': 'test_url'},
                {'results': []},
                {'next': None}]
            req.status_code = 200
            mock.status_code = 300
            com = Command()

            xis_api_endpoint = 'https://newapi123'
            xis_api_endpoint_status = 'ACTIVE'

            xis_syndication = XISUpstream(
                xis_api_endpoint=xis_api_endpoint,
                xis_api_endpoint_status=xis_api_endpoint_status)

            xis_syndication.save()
            com.handle(id=[xis_syndication.pk])
            self.assertEqual(req.get.call_count, 2)
            self.assertDictContainsSubset({"url": "test_url"},
                                          req.get.call_args[1])

    def test_save_metadata_from_xis_retrieve_records(self):
        """Test of saving records from an Upstream Syndication"""

        xis_api_endpoint = 'https://newapi123'
        xis_api_endpoint_status = 'ACTIVE'

        xis_syndication = XISUpstream(
            xis_api_endpoint=xis_api_endpoint,
            xis_api_endpoint_status=xis_api_endpoint_status)
        xis_syndication.save()
        self.supplemental_ledger.save()
        self.metadata_ledger.save()

        with patch('core.management.commands.load_metadata_from_xis.'
                   'SupplementalLedgerSerializer') as sup,\
            patch('core.management.commands.load_metadata_from_xis.'
                  'MetadataLedgerSerializer') as meta:

            com = Command()

            sup.return_value = sup
            sup.is_valid.return_value = True
            sup.instance = self.supplemental_ledger
            meta.return_value = meta
            meta.is_valid.return_value = True
            meta.instance = self.metadata_ledger

            dataSTR = json.dumps(self.composite_data_valid)
            dataJSON = json.loads(dataSTR)
            com.save_record(xis_syndication, dataJSON)

            self.assertEqual(xis_syndication.metadata_experiences.count(),
                             1)
            self.assertEqual(xis_syndication.supplemental_experiences.count(),
                             1)

    def test_load_metadata_into_xis_with_options(self):
        """Test of arguments being passed into Downstream Syndication"""
        with patch('core.management.commands.load_metadata_into_xis.'
                   'XISDownstream.objects') as down:
            down.all.return_value = down
            down.filter.return_value = down
            com = iCommand()
            id_var = [123, ]
            api_var = ['abc', ]
            com.handle(id=id_var, api=api_var)
            self.assertEqual(down.filter.call_count, 3)
            self.assertEqual(down.filter.call_args_list[0][1],
                             {"xis_api_endpoint_status": 'ACTIVE'})
            self.assertEqual(down.filter.call_args_list[1][1],
                             {"pk__in": id_var})
            self.assertEqual(down.filter.call_args[1],
                             {"xis_api_endpoint__in": api_var})

    def test_save_metadata_into_xis_retrieve_records(self):
        """Test of saving records from a Downstream Syndication"""

        xis_api_endpoint = 'https://newapi123'
        xis_api_endpoint_status = 'ACTIVE'

        xis_syndication = XISDownstream(
            xis_api_endpoint=xis_api_endpoint,
            xis_api_endpoint_status=xis_api_endpoint_status,
            source_name=xis_api_endpoint)
        xis_syndication.save()
        self.composite_ledger.save()

        with patch('core.management.commands.load_metadata_into_xis.'
                   'CompositeLedgerSerializer') as comp,\
            patch('core.management.commands.load_metadata_into_xis.'
                  'requests') as req:

            com = iCommand()

            comp.return_value = comp
            comp.is_valid.return_value = True
            comp.instance = self.composite_ledger
            comp['unique_record_identifier'] = self.composite_ledger.\
                unique_record_identifier

            dataSTR = json.dumps(self.composite_data_valid)
            dataJSON = json.loads(dataSTR)
            comp.data = dataJSON

            req.post.return_value = req
            req.status_code = 200

            com.send_record(xis_syndication, self.composite_ledger.__dict__)

            self.assertEqual(xis_syndication.composite_experiences.count(),
                             1)
