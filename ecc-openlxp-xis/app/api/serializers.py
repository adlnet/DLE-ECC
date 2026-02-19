import logging

from django.utils import timezone
from rest_framework import serializers

from core.management.utils.xis_internal import (confusable_homoglyphs_check,
                                                dict_flatten, is_date,
                                                required_recommended_logs)
from core.management.utils.xss_client import (
    get_data_types_for_validation,
    get_required_recommended_fields_for_validation)
from core.models import CompositeLedger, MetadataLedger, SupplementalLedger

logger = logging.getLogger('dict_config_logger')


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)


def validate_recommended(data, recommended_column_list, flattened_source_data):
    for item_name in recommended_column_list:
        # Log out warning for missing recommended values
        # item_name = item[:-len(".use")]
        if item_name in flattened_source_data:
            if not flattened_source_data[item_name]:
                required_recommended_logs(data.get
                                          ('unique_record_identifier'),
                                          "Recommended", item_name)
        else:
            required_recommended_logs(data.get
                                      ('unique_record_identifier'),
                                      "Recommended", item_name)


def validate_required(data, required_column_list, flattened_source_data):
    validation_result = 'Y'
    record_status_result = 'Active'
    for item_name in required_column_list:
        # update validation and record status for invalid data
        # Log out error for missing required values
        # item_name = item[:-len(".use")]
        if item_name in flattened_source_data:
            if not flattened_source_data[item_name]:
                validation_result = 'N'
                record_status_result = 'Inactive'
                required_recommended_logs(data.get
                                          ('unique_record_identifier'),
                                          "Required", item_name)
        else:
            validation_result = 'N'
            record_status_result = 'Inactive'
            required_recommended_logs(data.get
                                      ('unique_record_identifier'),
                                      "Required", item_name)

    return validation_result, record_status_result


class MetadataLedgerSerializer(DynamicFieldsModelSerializer):
    """Serializes an entry into the Metadata Ledger"""

    class Meta:
        model = MetadataLedger
        fields = ['metadata', 'metadata_hash', 'metadata_key',
                  'metadata_key_hash', 'provider_name',
                  'unique_record_identifier', 'updated_by', 'record_status']

    def validate(self, data):
        """function to validate metadata field"""

        # Call function to get required & recommended values
        required_column_list, recommended_column_list = \
            get_required_recommended_fields_for_validation()
        expected_data_types = get_data_types_for_validation()
        json_metadata = data.get('metadata')
        id_num = data.get('unique_record_identifier')

        flattened_source_data = dict_flatten(json_metadata,
                                             required_column_list)
        # validate for required values in data
        validation_result, record_status_result = validate_required(
            data, required_column_list, flattened_source_data)

        # validate for recommended values in data
        validate_recommended(
            data, recommended_column_list, flattened_source_data)
        # Type checking for values in metadata
        for item in flattened_source_data:
            # check if datatype has been assigned to field
            if item in expected_data_types:
                # type checking for datetime datatype fields
                if expected_data_types[item] == "datetime":
                    if not is_date(flattened_source_data[item]):
                        required_recommended_logs(data.get
                                                  ('unique_record_identifier'),
                                                  "datatype",
                                                  item)
                # type checking for datatype fields(except datetime)
                elif (not isinstance(flattened_source_data[item],
                                     expected_data_types[item])):
                    required_recommended_logs(data.get
                                              ('unique_record_identifier'),
                                              "datatype",
                                              item)

        data['metadata_validation_status'] = validation_result
        data['record_status'] = record_status_result
        data['date_validated'] = timezone.now()

        # confusable homoglyphs check

        safe_data = confusable_homoglyphs_check(id_num, json_metadata)

        if not safe_data:
            raise serializers.ValidationError("Data contains homoglyphs and"
                                              " can be dangerous. Check logs"
                                              " for more details")

        if record_status_result == "Inactive":
            raise serializers.ValidationError("Metadata has missing fields. "
                                              "Data did not pass validation."
                                              "Check logs for more details")

        return data

    def update(self, instance, validated_data):
        """Updates the older record in table based on validation result"""
        # Check if older record is the same to skip updating
        if validated_data['metadata_hash'] != self.instance.metadata_hash and \
                validated_data.get('record_status') == 'Active':
            # Updating old instance of record INACTIVE if present record is
            # ACTIVE
            logger.info("Active instance found for update to inactive")
            instance.record_status = 'Inactive'
            instance.date_deleted = timezone.now()
            instance.composite_ledger_transmission_status = "Cancelled"
        instance.save()
        return instance

    def create(self, validated_data):
        """creates new record in table"""
        # assigning a new UUID primary key for data created

        # Updating date inserted value for newly saved values
        validated_data['date_inserted'] = timezone.now()
        # Updating deleted_date for newly saved inactive values
        if validated_data.get('record_status') == "Inactive":
            validated_data['date_deleted'] = timezone.now()
            validated_data['composite_ledger_transmission_status'] = \
                "Cancelled"
        # Creating new value in metadata ledger
        try:
            # Here is the important part! Creating new object!
            instance = MetadataLedger.objects.create(**validated_data)

            # assigning the updated by update to corresponding
            # supplemental ledger
            SupplementalLedger.objects. \
                filter(metadata_key_hash=validated_data['metadata_key_hash'],
                       record_status='Active'). \
                update(composite_ledger_transmission_status='Ready',
                       updated_by=validated_data['updated_by'])
        except TypeError:
            raise TypeError('Cannot create record')

        return instance

    def save(self):
        """Save function to create and update record in metadata ledger """

        logger.info('Entering save function')

        # Assigning validated data as dictionary for updates in records
        validated_data = dict(
            list(self.validated_data.items())
        )

        # If value to update is present in metadata ledger
        if self.instance is not None:

            logger.info('Instance for update found')
            self.instance = self.update(self.instance, validated_data)
            # Creating new value in metadata ledger after checking duplication
            if validated_data['metadata_hash'] != self.instance.metadata_hash:
                self.instance = self.create(validated_data)

        # Update table with new record
        else:
            self.instance = self.create(validated_data)

        logger.info(self.instance)
        return self.instance


class SupplementalLedgerSerializer(serializers.ModelSerializer):
    """Serializes an entry into the Supplemental Ledger"""

    class Meta:
        model = SupplementalLedger

        fields = ['metadata', 'metadata_hash', 'metadata_key',
                  'metadata_key_hash', 'provider_name',
                  'unique_record_identifier', 'updated_by', 'record_status']

    def validate(self, data):
        """Assign active status to supplemental data """

        json_metadata = data.get('metadata')
        id_num = data.get('unique_record_identifier')

        # confusable homoglyphs check
        safe_data = confusable_homoglyphs_check(id_num, json_metadata)

        if not safe_data:
            raise serializers.ValidationError("Data contains homoglyphs and"
                                              " can be dangerous. Check logs"
                                              " for more details")

        data['record_status'] = 'Active'
        return data

    def update(self, instance, validated_data):
        """Updates the older record in table based on validation result"""

        # Check if older record is the same to skip updating
        if validated_data['metadata_hash'] != self.instance.metadata_hash and \
                validated_data.get('record_status') == 'Active':
            # Updating old instance of record INACTIVE if present record is
            # ACTIVE
            logger.info("Active instance found for update to inactive")
            instance.record_status = 'Inactive'
            instance.date_deleted = timezone.now()
            instance.composite_ledger_transmission_status = "Cancelled"
        instance.save()
        return instance

    def create(self, validated_data):
        """creates new record in table"""
        if ('metadata' not in validated_data) or \
                (not validated_data['metadata']):
            logger.info('Supplementary data is null')
            return None

        # Updating date inserted value for newly saved values
        validated_data['date_inserted'] = timezone.now()
        logger.info(validated_data)
        # Updating deleted_date for newly saved inactive values
        if validated_data.get('record_status') == "Inactive":
            validated_data['date_deleted'] = timezone.now()
            validated_data['composite_ledger_transmission_status'] = \
                "Cancelled"
        # Creating new value in metadata ledger
        try:
            # Here is the important part! Creating new object!
            instance = SupplementalLedger.objects.create(**validated_data)

            # assigning the updated by update to corresponding
            # metadata ledger
            MetadataLedger.objects. \
                filter(metadata_key_hash=validated_data['metadata_key_hash'],
                       record_status='Active'). \
                update(composite_ledger_transmission_status='Ready',
                       updated_by=validated_data['updated_by'])

        except TypeError:
            raise TypeError('Cannot create record')

        return instance

    def save(self):
        """Save function to create and update record in supplemental ledger """

        logger.info('Entering save function')

        # Assigning validated data as dictionary for updates in records
        validated_data = dict(
            list(self.validated_data.items())
        )

        # If value to update is present in metadata ledger
        if self.instance is not None:

            logger.info('Instance for update found')
            self.instance = self.update(self.instance, validated_data)
            # Creating new value in metadata ledger after checking duplication
            if validated_data['metadata_hash'] != self.instance.metadata_hash:
                self.instance = self.create(validated_data)

        # Update table with new record
        else:

            self.instance = self.create(validated_data)

        logger.info(self.instance)
        return self.instance


class CompositeLedgerSerializer(serializers.ModelSerializer):
    """Serializes an entry into the Composite Ledger"""

    class Meta:
        model = CompositeLedger

        fields = '__all__'

    def validate(self, data):
        """function to validate metadata field"""

        # Call function to get required & recommended values
        required_column_list, recommended_column_list = \
            get_required_recommended_fields_for_validation()
        json_metadata = data.get('metadata')
        # access Metadata ledger values for validation
        metadata = json_metadata['Metadata_Ledger']
        validation_result = 'Y'
        record_status_result = 'Active'
        flattened_source_data = dict_flatten(metadata,
                                             required_column_list)
        #  looping through elements in the data
        for item in flattened_source_data:
            # validate for required values in data
            if item in required_column_list:
                # update validation and record status for invalid data
                # Log out error for missing required values
                if not flattened_source_data[item]:
                    validation_result = 'N'
                    record_status_result = 'Inactive'
                    required_recommended_logs(data.get
                                              ('unique_record_identifier'),
                                              "Required", item)
            # validate for recommended values in data
            # Log out warning for missing recommended values
            elif item in recommended_column_list and \
                    not flattened_source_data[item]:
                required_recommended_logs(data.
                                          get('unique_record_identifier'),
                                          "Recommended", item)

        data['metadata_validation_status'] = validation_result
        data['record_status'] = record_status_result
        data['date_validated'] = timezone.now()

        if record_status_result == 'Inactive':
            raise serializers.ValidationError('The data received is not '
                                              'valid, no update')

        return data

    def update(self, instance, validated_data):
        instance.metadata = validated_data.get('metadata', instance.metadata)
        instance.updated_by = 'Owner'
        instance.save()
        return instance
