from unittest.mock import patch

from ddt import ddt
from django.test import tag
from rest_framework.exceptions import ValidationError

from api.serializers import (CompositeLedgerSerializer,
                             MetadataLedgerSerializer,
                             SupplementalLedgerSerializer)

from .test_setup import TestSetUp


@tag('unit')
@ddt
class SerializerTests(TestSetUp):

    def test_MetadataLedgerSerializer_validate(self):
        """Test to check validation in metadata serializer"""

        with patch('api.serializers.'
                   'get_required_recommended_fields_for_validation') as \
                mock_validate_list, \
                patch('api.serializers.get_data_types_for_validation',
                      return_value=[]):
            mock_validate_list.return_value = self.required_dict, \
                                              self.recommended_dict

            return_obj = MetadataLedgerSerializer. \
                validate(self, {"metadata": self.metadata_valid})

            self.assertEqual(return_obj.get('metadata_validation_status'), 'Y')
            self.assertEqual(return_obj.get('record_status'), "Active")
            self.assertTrue(return_obj.get('date_validated'))

    def test_MetadataLedgerSerializer_validate_invalid(self):
        """Test to check validation in metadata serializer invalid"""
        with patch('api.serializers.'
                   'get_required_recommended_fields_for_validation') as \
                mock_validate_list, \
                patch('api.serializers.get_data_types_for_validation',
                      return_value=[]):
            mock_validate_list.return_value = self.required_dict, \
                                              self.recommended_dict
            with self.assertRaises(ValidationError):
                MetadataLedgerSerializer. \
                    validate(self, {"metadata": self.metadata_invalid})

    def test_SupplementalLedgerSerializer_validate(self):
        """Test to check validation in supplemental serializer"""

        return_obj = SupplementalLedgerSerializer. \
            validate(self, self.supplemental_data_valid)

        self.assertEqual(return_obj.get('record_status'), "Active")

    def test_CompositeLedgerSerializer_validate(self):
        """Test to check validation in composite serializer"""
        with patch('core.management.utils.xss_client'
                   '.get_required_recommended_fields_for_validation') as \
                mock_validate_list, \
                patch('core.management.utils.xss_client.'
                      'get_target_validation_schema',
                      return_value=self.target_data_dict), \
                patch('core.management.utils.xss_client.read_json_data',
                      return_value=None):
            mock_validate_list.return_value = self.required_dict, \
                                              self.recommended_dict
            return_obj = CompositeLedgerSerializer. \
                validate(self, self.composite_data_valid)

            self.assertEqual(return_obj.get('metadata_validation_status'), 'Y')
            self.assertEqual(return_obj.get('record_status'), "Active")
            self.assertTrue(return_obj.get('date_validated'))

    def test_CompositeLedgerSerializer_validate_invalid(self):
        """Test to check validation in composite serializer invalid"""
        with patch('core.management.utils.xss_client'
                   '.get_required_recommended_fields_for_validation') as \
                mock_validate_list, \
                patch('core.management.utils.xss_client.'
                      'get_target_validation_schema',
                      return_value=self.target_data_dict), \
                patch('core.management.utils.xss_client.read_json_data',
                      return_value=None):
            mock_validate_list.return_value = self.required_dict, \
                                              self.recommended_dict
            with self.assertRaises(ValidationError):
                CompositeLedgerSerializer. \
                    validate(self, self.composite_data_invalid)
