from unittest.mock import patch

from ddt import data, ddt, unpack
from django.test import tag

from core.management.utils.neo4j_client import (get_neo4j_auth,
                                                get_neo4j_endpoint)
from core.management.utils.xis_internal import (dict_flatten,
                                                flatten_dict_object,
                                                flatten_list_object,
                                                update_flattened_object)
from core.management.utils.xse_client import (get_autocomplete_field,
                                              get_elasticsearch_endpoint,
                                              get_elasticsearch_index,
                                              get_filter_field)
from core.management.utils.xss_client import (
    get_required_recommended_fields_for_validation,
    get_target_validation_schema)
from core.models import MetadataLedger, Neo4jConfiguration, XISConfiguration

from ..management.utils.transform_ledgers import (
    append_metadata_ledger_with_supplemental_ledger,
    detach_metadata_ledger_from_supplemental_ledger)
from .test_setup import TestSetUp


@tag('unit')
@ddt
class UtilsTests(TestSetUp):
    """This cases for xis_internal.py"""

    def test_dict_flatten(self):
        """Test function to navigate to value in source
        metadata to be validated"""
        test_data_dict = {"key1": "value1",
                          "key2": {"sub_key1": "sub_value1"},
                          "key3": [{"sub_key2": "sub_value2"},
                                   {"sub_key3": "sub_value3"}]}

        with patch('core.management.utils.xis_internal.flatten_list_object') \
                as mock_flatten_list, \
                patch('core.management.utils.xis_internal.flatten_dict_'
                      'object') as mock_flatten_dict, \
                patch('core.management.utils.xis_internal.update_flattened_'
                      'object') as mock_update_flattened:
            mock_flatten_list.return_value = mock_flatten_list
            mock_flatten_list.return_value = None
            mock_flatten_dict.return_value = mock_flatten_dict
            mock_flatten_dict.return_value = None
            mock_update_flattened.return_value = mock_update_flattened
            mock_update_flattened.return_value = None

        return_value = dict_flatten(test_data_dict,
                                    self.test_required_column_names)
        self.assertTrue(return_value)

    @data(
        ([{'a.b': None, 'a.c': 'value2', 'd': None},
          {'a.b': 'value1', 'a.c': 'value2', 'd': None}]))
    def test_flatten_list_object_loop(self, value):
        """Test the looping od the function to flatten
        list object when the value is list"""
        prefix = 'a'
        flatten_dict = {}
        required_list = ['a.b', 'a.c', 'd']
        with patch('core.management.utils.xis_internal.flatten_list_object') \
                as mock_flatten_list, \
                patch('core.management.utils.xis_internal.flatten_dict_'
                      'object') as mock_flatten_dict, \
                patch('core.management.utils.xis_internal.update_flattened_'
                      'object') as mock_update_flattened:
            mock_flatten_list.return_value = mock_flatten_list
            mock_flatten_list.return_value = None
            mock_flatten_dict.return_value = mock_flatten_dict
            mock_flatten_dict.return_value = None
            mock_update_flattened.side_effect = flatten_dict = \
                {'a.b': None, 'a.c': 'value2'}

            flatten_list_object(value, prefix, flatten_dict, required_list)
            self.assertEqual(mock_flatten_dict.call_count, 2)

    @data(
        ([{'b': [None]}]))
    def test_flatten_list_object_multilevel(self, value):
        """Test the function to flatten list object
         when the value is list for multilevel lists"""
        prefix = 'a'
        flatten_dict = {}
        required_list = ['a.b', 'd']
        with patch('core.management.utils.xis_internal.flatten_list_object') \
                as mock_flatten_list, \
                patch('core.management.utils.xis_internal.flatten_dict_'
                      'object') as mock_flatten_dict, \
                patch('core.management.utils.xis_internal.update_flattened_'
                      'object') as mock_update_flattened:
            mock_flatten_list.return_value = mock_update_flattened
            mock_flatten_dict.return_value = mock_flatten_list()
            mock_update_flattened.side_effect = flatten_dict = \
                {'a.b': None}

            flatten_list_object(value, prefix, flatten_dict, required_list)
            self.assertEqual(mock_flatten_list.call_count, 1)

    @data(([{'A': 'a'}]), ([{'B': 'b', 'C': 'c'}]))
    def test_flatten_list_object_list(self, value):
        """Test the function to flatten list object when the value is list"""
        prefix = 'test'
        flatten_dict = []
        with patch('core.management.utils.xis_internal.flatten_list_object') \
                as mock_flatten_list, \
                patch('core.management.utils.xis_internal.flatten_dict_'
                      'object') as mock_flatten_dict, \
                patch('core.management.utils.xis_internal.update_flattened_'
                      'object') as mock_update_flattened:
            mock_flatten_list.return_value = mock_flatten_list
            mock_flatten_list.return_value = None
            mock_flatten_dict.return_value = mock_flatten_dict
            mock_flatten_dict.return_value = None
            mock_update_flattened.return_value = mock_update_flattened
            mock_update_flattened.return_value = None

            flatten_list_object(value, prefix, flatten_dict,
                                self.test_required_column_names)

            self.assertEqual(mock_flatten_dict.call_count, 1)

    @data(([{'A': 'a'}]), ([{'B': 'b', 'C': 'c'}]))
    def test_flatten_list_object_dict(self, value):
        """Test the function to flatten list object when the value is dict"""
        prefix = 'test'
        flatten_dict = []
        with patch('core.management.utils.xis_internal.flatten_list_object') \
                as mock_flatten_list, \
                patch('core.management.utils.xis_internal.flatten_dict_'
                      'object') as mock_flatten_dict, \
                patch('core.management.utils.xis_internal.update_flattened_'
                      'object') as mock_update_flattened:
            mock_flatten_list.return_value = mock_flatten_list
            mock_flatten_list.return_value = None
            mock_flatten_dict.return_value = mock_flatten_dict
            mock_flatten_dict.return_value = None
            mock_update_flattened.return_value = mock_update_flattened
            mock_update_flattened.return_value = None

            flatten_list_object(value, prefix, flatten_dict,
                                self.test_required_column_names)

            self.assertEqual(mock_flatten_dict.call_count, 1)

    @data((['hello']), (['hi']))
    def test_flatten_list_object_str(self, value):
        """Test the function to flatten list object when the value is string"""
        prefix = 'test'
        flatten_dict = []
        with patch('core.management.utils.xis_internal.flatten_list_object') \
                as mock_flatten_list, \
                patch('core.management.utils.xis_internal.flatten_dict_'
                      'object') as mock_flatten_dict, \
                patch('core.management.utils.xis_internal.update_flattened_'
                      'object') as mock_update_flattened:
            mock_flatten_list.return_value = mock_flatten_list
            mock_flatten_list.return_value = None
            mock_flatten_dict.return_value = mock_flatten_dict
            mock_flatten_dict.return_value = None
            mock_update_flattened.return_value = mock_update_flattened
            mock_update_flattened.return_value = None
            flatten_list_object(value, prefix, flatten_dict,
                                self.test_required_column_names)

            self.assertEqual(mock_update_flattened.call_count, 1)

    @data(({'abc': {'A': 'a'}}), ({'xyz': {'B': 'b'}}))
    def test_flatten_dict_object_dict(self, value):
        """Test the function to flatten dictionary object when input value is
        a dict"""
        prefix = 'test'
        flatten_dict = []
        with patch('core.management.utils.xis_internal.flatten_list_object') \
                as mock_flatten_list, \
                patch('core.management.utils.xis_internal.flatten_dict_'
                      'object') as mock_flatten_dict, \
                patch('core.management.utils.xis_internal.update_flattened_'
                      'object') as mock_update_flattened:
            mock_flatten_list.return_value = mock_flatten_list
            mock_flatten_list.return_value = None
            mock_flatten_dict.return_value = mock_flatten_dict
            mock_flatten_dict.return_value = None
            mock_update_flattened.return_value = mock_update_flattened
            mock_update_flattened.return_value = None

            flatten_dict_object(value, prefix, flatten_dict,
                                self.test_required_column_names)

            self.assertEqual(mock_flatten_dict.call_count, 1)

    @data(({'abc': [1, 2, 3]}), ({'xyz': [1, 2, 3, 4, 5]}))
    def test_flatten_dict_object_list(self, value):
        """Test the function to flatten dictionary object when input value is
        a list"""
        prefix = 'test'
        flatten_dict = []
        with patch('core.management.utils.xis_internal.flatten_list_object') \
                as mock_flatten_list, \
                patch('core.management.utils.xis_internal.flatten_dict_'
                      'object') as mock_flatten_dict, \
                patch('core.management.utils.xis_internal.update_flattened_'
                      'object') as mock_update_flattened:
            mock_flatten_list.return_value = mock_flatten_list
            mock_flatten_list.return_value = None
            mock_flatten_dict.return_value = mock_flatten_dict
            mock_flatten_dict.return_value = None
            mock_update_flattened.return_value = mock_update_flattened
            mock_update_flattened.return_value = None

            flatten_dict_object(value, prefix, flatten_dict,
                                self.test_required_column_names)

            self.assertEqual(mock_flatten_list.call_count, 1)

    @data(({'abc': 'A'}), ({'xyz': 'B'}))
    def test_flatten_dict_object_str(self, value):
        """Test the function to flatten dictionary object when input value is
        a string"""
        prefix = 'test'
        flatten_dict = []
        with patch('core.management.utils.xis_internal.flatten_list_object') \
                as mock_flatten_list, \
                patch('core.management.utils.xis_internal.flatten_dict_'
                      'object') as mock_flatten_dict, \
                patch('core.management.utils.xis_internal.update_flattened_'
                      'object') as mock_update_flattened:
            mock_flatten_list.return_value = mock_flatten_list
            mock_flatten_list.return_value = None
            mock_flatten_dict.return_value = mock_flatten_dict
            mock_flatten_dict.return_value = None
            mock_update_flattened.return_value = mock_update_flattened
            mock_update_flattened.return_value = None

            flatten_dict_object(value, prefix, flatten_dict,
                                self.test_required_column_names)

            self.assertEqual(mock_update_flattened.call_count, 1)

    @data('', 'str1')
    def test_update_flattened_object(self, value):
        """Test the function which returns the source bucket name"""
        prefix = 'test'
        flatten_dict = {}
        update_flattened_object(value, prefix, flatten_dict)
        self.assertTrue(flatten_dict)

    """This cases for xse_client.py"""

    def test_get_elasticsearch_endpoint(self):
        """This test is to check if function returns the elasticsearch
        endpoint """
        with patch('core.management.utils.xse_client.XISConfiguration.objects'
                   ) as xis_config:
            configObj = XISConfiguration(target_schema="test.json",
                                         xse_host="host:8080",
                                         xse_index="test-index")
            xis_config.first.return_value = configObj
            result_api_es_endpoint = get_elasticsearch_endpoint()

            self.assertTrue(result_api_es_endpoint)

    def test_get_elasticsearch_index(self):
        """This test is to check if function returns the elasticsearch index"""
        with patch('core.management.utils.xse_client.XISConfiguration.objects'
                   ) as xis_config:
            configObj = XISConfiguration(target_schema="test.json",
                                         xse_host="host:8080",
                                         xse_index="test-index")
            xis_config.first.return_value = configObj
            result_api_es_index = get_elasticsearch_index()

            self.assertTrue(result_api_es_index)

    def test_get_autocomplete_field(self):
        """This test is to check if function returns the autocomplete field"""
        with patch('core.management.utils.xse_client.XISConfiguration.objects'
                   ) as xis_config:
            configObj = XISConfiguration(target_schema="test.json",
                                         xse_host="host:8080",
                                         xse_index="test-index")
            xis_config.first.return_value = configObj
            result = get_autocomplete_field()

            self.assertEquals(result,
                              "metadata.Metadata_Ledger.Course.CourseTitle")

    def test_get_filter_field(self):
        """This test is to check if function returns the filter field"""
        with patch('core.management.utils.xse_client.XISConfiguration.objects'
                   ) as xis_config:
            configObj = XISConfiguration(target_schema="test.json",
                                         xse_host="host:8080",
                                         xse_index="test-index")
            xis_config.first.return_value = configObj
            result = get_filter_field()

            self.assertEquals(result, "provider_name")

    # Test cases for XSS

    def test_get_target_validation_schema(self):
        """Test to retrieve target_metadata_schema from XIS configuration"""
        with patch('core.management.utils.xss_client'
                   '.XISConfiguration.objects') as xisconfigobj, \
                patch('core.management.utils.xss_client'
                      '.read_json_data') as read_obj:
            xisConfig = XISConfiguration(
                target_schema='p2881_schema.json')
            xisconfigobj.return_value = xisConfig
            read_obj.return_value = read_obj
            read_obj.return_value = self.target_data_dict
            return_from_function = get_target_validation_schema()
            self.assertEqual(read_obj.return_value,
                             return_from_function)

    def test_get_required_recommended_fields_for_validation(self):
        """Test for Creating list of fields which are Required """
        with patch('core.management.utils.xss_client'
                   '.get_target_validation_schema',
                   return_value=self.target_data_dict):
            required_column_name, recommended_column_name = \
                get_required_recommended_fields_for_validation()

            self.assertTrue(required_column_name)
            self.assertTrue(recommended_column_name)

    # This cases for neo4j_client.py

    @data(('id', 'pwd'), ('user_id', 'password'))
    @unpack
    def test_get_neo4j_auth(self, first_value, second_value):
        """This test is to Get user id and password to connect to Neo4j"""
        with patch(
                'core.management.utils.neo4j_client.Neo4jConfiguration.objects'
        ) as neo4j_config:
            neo4j_user = first_value
            neo4j_pwd = second_value
            configObj = Neo4jConfiguration(neo4j_uri="endpoint",
                                           neo4j_user=neo4j_user,
                                           neo4j_pwd=neo4j_pwd)
            neo4j_config.first.return_value = configObj
            user_id, pwd = get_neo4j_auth()

            self.assertEqual(user_id, neo4j_user)
            self.assertEqual(pwd, neo4j_pwd)

    def test_get_neo4j_endpoint(self):
        """This test is to check if function returns the Neo4j
        endpoint """
        with patch('core.management.utils.neo4j_client.Neo4jConfiguration.'
                   'objects') as neo4j_config:
            configObj = Neo4jConfiguration(neo4j_uri="test.json")
            neo4j_config.first.return_value = configObj
            result_api_es_endpoint = get_neo4j_endpoint()

            self.assertTrue(result_api_es_endpoint)

    # Cases for transform_ledger.py

    def test_append_metadata_ledger_with_supplemental_ledger(self):
        """This tests to check method which finds
        supplemental metadata and consolidate it with metadata ledger data"""

        self.supplemental_ledger.save()
        self.metadata_ledger.save()

        metadata = MetadataLedger.objects.filter(
            metadata_validation_status='Y',
            record_status='Active',
            composite_ledger_transmission_status='Ready').values(
            'metadata_key',
            'metadata_key_hash',
            'metadata_hash',
            'metadata',
            'provider_name',
            'updated_by')
        for metadata_instance in metadata:
            composite_data, supplemental_data = \
                append_metadata_ledger_with_supplemental_ledger(
                    metadata_instance)

            self.assertEqual(self.supplement_metadata,
                             supplemental_data['metadata'])
            self.assertEqual(self.metadata,
                             composite_data["Metadata_Ledger"])
            self.assertEqual(self.supplement_metadata,
                             composite_data["Supplemental_Ledger"])

    def test_detach_metadata_ledger_from_supplemental_ledger(self):
        """This test checks method to Detach supplemental metadata
        and metadata from consolidated data"""

        meta_data, supplemental_data = \
            detach_metadata_ledger_from_supplemental_ledger(
                self.composite_data_valid)

        self.assertEqual(meta_data["metadata"], self.metadata)
        self.assertEqual(meta_data["metadata_key"], self.metadata_key)
        self.assertEqual(supplemental_data["metadata"],
                         self.supplement_metadata)
        self.assertEqual(supplemental_data["metadata_key"],
                         self.metadata_key)
