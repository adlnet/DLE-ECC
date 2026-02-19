import logging
from unittest.mock import patch

from django.test import tag

from api.serializers import MetadataLedgerSerializer
from core.models import MetadataLedger

from .test_setup import TestSetUp

logger = logging.getLogger('dict_config_logger')


@tag('integration')
class TestSerializer(TestSetUp):
    """Class with tests related to Serializer"""

    def test_validate(self):
        """Test to check if serializer is validating data sent
               accurately  """
        valid_validated_data = MetadataLedgerSerializer. \
            validate(self, self.metadataLedger_data_valid)
        invalid_validated_data = MetadataLedgerSerializer. \
            validate(self, self.metadataLedger_data_invalid)
        self.assertEqual("Y",
                         valid_validated_data.get('metadata_validation_status')
                         )
        self.assertEqual("N",
                         invalid_validated_data.get(
                             'metadata_validation_status'))

    def test_create(self):
        """Test to check if serializer is creating data sent
                       accurately  """
        self.active_data = MetadataLedgerSerializer. \
            validate(self, self.metadataLedger_data_valid)
        self.inactive_data = MetadataLedgerSerializer. \
            validate(self, self.metadataLedger_data_invalid)

        created_data_active = MetadataLedgerSerializer. \
            create(self,
                   self.active_data)
        created_data_inactive = MetadataLedgerSerializer. \
            create(self,
                   self.inactive_data)

        # Check create for active records
        self.assertEqual(
            self.metadataLedger_data_valid.get('unique_record_identifier'),
            getattr(created_data_active, 'unique_record_identifier')
        )
        self.assertTrue(getattr(created_data_active, 'date_inserted'))

        # Check create for inactive records
        self.assertTrue(getattr(created_data_inactive, 'date_inserted'))
        self.assertTrue(getattr(created_data_inactive, 'date_deleted'))

    def test_update(self):
        """Test to check if serializer is updating data sent
                       accurately  """

        # storing values of records after validations in serializer
        self.active_data1 = MetadataLedgerSerializer. \
            validate(self, self.metadataLedger_data_valid)
        self.active_data2 = MetadataLedgerSerializer. \
            validate(self, self.metadataLedger_data_valid_2)
        self.inactive_data = MetadataLedgerSerializer. \
            validate(self, self.metadataLedger_data_invalid)

        # create valid data record in table
        serializer = MetadataLedgerSerializer(None,
                                              data=self.
                                              metadataLedger_data_valid)
        # passing through validation and saving record in table
        serializer.is_valid()
        serializer.save()

        # # finding previous valid instance of record from table
        self.record_in_table = MetadataLedger.objects.filter(
            metadata_key_hash=self.metadata_key_hash_valid).first()

        # passing through validation and updating record in table
        # for invalid data instance
        serializer_invalid = \
            MetadataLedgerSerializer(self.record_in_table,
                                     data=self.metadataLedger_data_invalid)

        serializer_invalid.is_valid()
        # calling update function with previous instance
        # and invalid present instance

        updated_invalid = serializer_invalid. \
            update(self.record_in_table, self.inactive_data)
        #  previous instance of record remains Active
        self.assertEqual("Active", getattr(updated_invalid, 'record_status'))

        # finding previous valid instance of record from table
        self.record_in_table = MetadataLedger.objects.filter(
            metadata_key_hash=self.metadata_key_hash_valid).first()

        # passing through validation and updating record in table
        # for valid data instance
        serializer_valid = MetadataLedgerSerializer(
            self.record_in_table, data=self.metadataLedger_data_valid_2)
        serializer_valid.is_valid()
        # calling update function with previous instance
        # and valid present instance
        updated_valid = serializer_valid.update(self.record_in_table,
                                                self.active_data2)
        #  previous instance of record is updated to Inactive
        self.assertEqual("Active", getattr(updated_valid, 'record_status'))

    @patch('api.serializers.MetadataLedgerSerializer.create',
           return_value='True')
    @patch('api.serializers.MetadataLedgerSerializer.update',
           return_value='True')
    def test_save(self, mock_create, mock_update):
        """Test to check if serializer is saving data sent
                       accurately  """
        # getting validated data for save()
        self.validated_data = MetadataLedgerSerializer. \
            validate(self, self.metadataLedger_data_valid)
        # calling mock update function
        self.update = mock_update
        # calling mock create function
        self.create = mock_create
        # calling instance with No value
        self.instance = None
        # return value from save()
        value = MetadataLedgerSerializer.save(self)
        self.assertTrue(value)
