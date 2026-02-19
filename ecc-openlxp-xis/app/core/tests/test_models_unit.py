from unittest.mock import Mock, patch

from django.core.exceptions import ValidationError
from django.test import TestCase, tag
from django.utils import timezone

from core.models import (CompositeLedger, FilterMetadata, FilterRecord,
                         MetadataLedger, Neo4jConfiguration,
                         SupplementalLedger, XISConfiguration, XISDownstream,
                         XISUpstream)


@tag('unit')
class ModelTests(TestCase):

    def test_create_xis_configuration(self):
        """Test that creating a new XIS Configuration entry is successful
        with defaults """
        target_schema = 'test_file.json'
        xse_host = 'test:8080'
        xse_index = 'test-index'

        xisConfig = XISConfiguration(target_schema=target_schema,
                                     xse_host=xse_host,
                                     xse_index=xse_index)

        self.assertEqual(xisConfig.target_schema,
                         target_schema)
        self.assertEqual(xisConfig.xse_host, xse_host)
        self.assertEqual(xisConfig.xse_index, xse_index)

    def test_metadata_ledger(self):
        """Test for a new Metadata_Ledger entry is successful with defaults"""

        unique_record_identifier = 'fe16decc-a982-40b2-bd2b-e8ab98b80a6e'
        provider_name = 'AGENT'
        date_inserted = timezone.now()
        metadata = ''
        metadata_hash = '4f2a7da4f872e9807079ac7cb42aefb4'
        metadata_key = 'Agent_test'
        metadata_key_hash = '4f2a7da4f872e9807079ac7cb42aefb5'
        record_status = ''
        date_deleted = timezone.now()
        date_validated = timezone.now()
        metadata_validation_status = ''

        metadataLedger = MetadataLedger(
            unique_record_identifier=unique_record_identifier,
            provider_name=provider_name,
            date_inserted=date_inserted,
            metadata=metadata,
            metadata_hash=metadata_hash,
            metadata_key=metadata_key,
            metadata_key_hash=metadata_key_hash,
            record_status=record_status,
            date_deleted=date_deleted,
            date_validated=date_validated,
            metadata_validation_status=metadata_validation_status)

        self.assertEqual(metadataLedger.unique_record_identifier,
                         unique_record_identifier)
        self.assertEqual(metadataLedger.provider_name,
                         provider_name)
        self.assertEqual(metadataLedger.date_inserted,
                         date_inserted)
        self.assertEqual(metadataLedger.metadata,
                         metadata)
        self.assertEqual(metadataLedger.metadata_hash,
                         metadata_hash)
        self.assertEqual(metadataLedger.metadata_key,
                         metadata_key)
        self.assertEqual(metadataLedger.metadata_key_hash,
                         metadata_key_hash)
        self.assertEqual(metadataLedger.record_status,
                         record_status)
        self.assertEqual(metadataLedger.date_deleted,
                         date_deleted)
        self.assertEqual(metadataLedger.date_validated,
                         date_validated)
        self.assertEqual(metadataLedger.metadata_validation_status,
                         metadata_validation_status)

    def test_supplemental_ledger(self):
        """Test for a new Supplemental_Ledger entry is successful with
        defaults """

        unique_record_identifier = 'fe16decc-a982-40b2-bd2b-e8ab98b80a6e'
        provider_name = 'AGENT'
        date_inserted = ''
        metadata = ''
        metadata_hash = '4f2a7da4f872e9807079ac7cb42aefb4'
        metadata_key = 'AGENT_Test_key'
        metadata_key_hash = '4f2a7da4f872e9807079ac7cb42aefb5'
        record_status = ''
        date_deleted = timezone.now()

        supplemental_ledger = SupplementalLedger(
            unique_record_identifier=unique_record_identifier,
            provider_name=provider_name,
            date_inserted=date_inserted,
            metadata=metadata,
            metadata_hash=metadata_hash,
            metadata_key=metadata_key,
            metadata_key_hash=metadata_key_hash,
            record_status=record_status,
            date_deleted=date_deleted)

        self.assertEqual(supplemental_ledger.unique_record_identifier,
                         unique_record_identifier)
        self.assertEqual(supplemental_ledger.provider_name,
                         provider_name)
        self.assertEqual(supplemental_ledger.date_inserted,
                         date_inserted)
        self.assertEqual(supplemental_ledger.metadata,
                         metadata)
        self.assertEqual(supplemental_ledger.metadata_hash,
                         metadata_hash)
        self.assertEqual(supplemental_ledger.metadata_key,
                         metadata_key)
        self.assertEqual(supplemental_ledger.metadata_key_hash,
                         metadata_key_hash)
        self.assertEqual(supplemental_ledger.record_status,
                         record_status)
        self.assertEqual(supplemental_ledger.date_deleted,
                         date_deleted)

    def test_composite_ledger(self):
        """Test for a new Composite_Ledger entry is successful with defaults"""

        unique_record_identifier = 'fe16decc-a982-40b2-bd2b-e8ab98b80a6e'
        provider_name = 'AGENT'
        date_inserted = timezone.now()
        metadata = ''
        metadata_hash = '4f2a7da4f872e9807079ac7cb42aefb4'
        metadata_key = 'AGENT_Test_key'
        metadata_key_hash = '4f2a7da4f872e9807079ac7cb42aefb5'
        record_status = ''
        date_deleted = timezone.now()

        composite_ledger = CompositeLedger(
            unique_record_identifier=unique_record_identifier,
            provider_name=provider_name,
            date_inserted=date_inserted,
            metadata=metadata,
            metadata_hash=metadata_hash,
            metadata_key=metadata_key,
            metadata_key_hash=metadata_key_hash,
            record_status=record_status,
            date_deleted=date_deleted)

        self.assertEqual(composite_ledger.unique_record_identifier,
                         unique_record_identifier)
        self.assertEqual(composite_ledger.provider_name,
                         provider_name)
        self.assertEqual(composite_ledger.date_inserted,
                         date_inserted)
        self.assertEqual(composite_ledger.metadata,
                         metadata)
        self.assertEqual(composite_ledger.metadata_hash,
                         metadata_hash)
        self.assertEqual(composite_ledger.metadata_key,
                         metadata_key)
        self.assertEqual(composite_ledger.metadata_key_hash,
                         metadata_key_hash)
        self.assertEqual(composite_ledger.record_status,
                         record_status)
        self.assertEqual(composite_ledger.date_deleted,
                         date_deleted)

    def test_create_two_xis_configuration(self):
        """Test that trying to create more than one XIS Configuration throws
        ValidationError """
        with self.assertRaises(ValidationError):
            xisConfig = XISConfiguration(target_schema="example1.json")
            xisConfig2 = XISConfiguration(target_schema="example2.json")
            xisConfig.save()
            xisConfig2.save()

    def test_xis_up_syndication(self):
        """Test for a new XISUpstream entry is successful with defaults"""

        xis_api_endpoint = 'https://newapi123'
        xis_api_endpoint_status = 'ACTIVE'

        xis_syndication = XISUpstream(
            xis_api_endpoint=xis_api_endpoint,
            xis_api_endpoint_status=xis_api_endpoint_status)

        self.assertEqual(xis_syndication.xis_api_endpoint,
                         xis_api_endpoint)
        self.assertEqual(xis_syndication.xis_api_endpoint_status,
                         xis_api_endpoint_status)
        self.assertEqual(str(xis_syndication),
                         xis_api_endpoint)

    def test_xis_down_syndication(self):
        """Test for a new XISDownstream entry is successful with defaults"""

        xis_api_endpoint = 'https://newapi123'
        xis_api_endpoint_status = 'ACTIVE'

        xis_syndication = XISDownstream(
            xis_api_endpoint=xis_api_endpoint,
            xis_api_endpoint_status=xis_api_endpoint_status)

        xis_syndication.save()

        self.assertEqual(xis_syndication.xis_api_endpoint,
                         xis_api_endpoint)
        self.assertEqual(xis_syndication.xis_api_endpoint_status,
                         xis_api_endpoint_status)
        self.assertEqual(str(xis_syndication),
                         xis_api_endpoint)

    def test_xis_down_syndication_no_metadata(self):
        """Test for a new XISDownstream entry is successful with no metadata"""

        xis_api_endpoint = 'https://newapi123'
        xis_api_endpoint_status = 'ACTIVE'

        xis_syndication = XISDownstream(
            xis_api_endpoint=xis_api_endpoint,
            xis_api_endpoint_status=xis_api_endpoint_status)

        xis_syndication.save()
        self.assertEqual(xis_syndication.determine_fields(), ([], []))

    def test_xis_down_syndication_with_metadata(self):
        """Test for a new XISDownstream entry is successful with metadata"""

        xis_api_endpoint = 'https://newapi123'
        xis_api_endpoint_status = 'ACTIVE'

        xis_syndication = XISDownstream(
            xis_api_endpoint=xis_api_endpoint,
            xis_api_endpoint_status=xis_api_endpoint_status)

        inc_field_name = 'inc_test_field_1'
        inc_operation = 'INCLUDE'

        inc_filter_metadata = FilterMetadata(
            field_name=inc_field_name,
            operation=inc_operation)

        ex_field_name = 'ex_test_field_1'
        ex_operation = 'EXCLUDE'

        ex_filter_metadata = FilterMetadata(
            field_name=ex_field_name,
            operation=ex_operation)

        xis_syndication.save()
        inc_filter_metadata.save()
        ex_filter_metadata.save()

        xis_syndication.filter_metadata.add(inc_filter_metadata)
        xis_syndication.filter_metadata.add(ex_filter_metadata)

        inc, ex = xis_syndication.determine_fields()

        self.assertEqual(len(inc), 1)
        self.assertEqual(len(ex), 1)

    def test_xis_down_syndication_with_records(self):
        """Test for a new XISDownstream entry is successful with records"""

        xis_api_endpoint = 'https://newapi123'
        xis_api_endpoint_status = 'ACTIVE'

        xis_syndication = XISDownstream(
            xis_api_endpoint=xis_api_endpoint,
            xis_api_endpoint_status=xis_api_endpoint_status)

        field_name = 'test_field_1'
        field_value = 'value_test_1'
        comparator = 'EQUAL'

        filter_record = FilterRecord(
            field_name=field_name,
            comparator=comparator, field_value=field_value)

        xis_syndication.save()
        filter_record.save()

        xis_syndication.filter_records.add(filter_record)

        with patch('core.models.FilterRecord.apply_filter'):
            mock = Mock()
            mock.filter.return_value = mock
            mock.exclude.return_value = []

            xis_syndication.apply_filter(mock)

            self.assertEqual(mock.filter.call_count, 1)
            self.assertEqual(mock.filter.call_args[1],
                             {"record_status": 'Active'})
            self.assertEqual(mock.exclude.call_count, 1)
            self.assertEqual(mock.exclude.call_args[1],
                             {"xis_destination__pk": xis_syndication.pk})

    def test_filter_metadata(self):
        """Test for a new FilterMetadata entry is successful with defaults"""

        field_name = 'test_field_1'
        operation = 'INCLUDE'

        filter_metadata = FilterMetadata(
            field_name=field_name,
            operation=operation)

        self.assertEqual(filter_metadata.field_name,
                         field_name)
        self.assertEqual(filter_metadata.operation,
                         operation)
        self.assertEqual(str(filter_metadata),
                         f"{operation} {field_name}")

    def test_filter_record(self):
        """Test for a new FilterRecord entry is successful with defaults"""

        field_name = 'test_field_1'
        field_value = 'value_test_1'
        comparator = 'EQUAL'

        filter_record = FilterRecord(
            field_name=field_name,
            comparator=comparator, field_value=field_value)

        self.assertEqual(filter_record.field_name,
                         field_name)
        self.assertEqual(filter_record.field_value,
                         field_value)
        self.assertEqual(filter_record.comparator,
                         comparator)
        self.assertEqual(str(filter_record),
                         f"{field_name} {comparator} {field_value}")

    def test_filter_record_root_equal(self):
        """Test for an equal root filter on a FilterRecord is successful"""

        field_name = 'test_field_1'
        field_value = 'value_test_1'
        comparator = FilterRecord.EQUAL

        mock = Mock()

        filter_record = FilterRecord(
            field_name=field_name,
            comparator=comparator, field_value=field_value)

        filter_record.apply_filter(mock)

        self.assertEqual(mock.filter.call_args[1],
                         {f"{field_name}__iexact": field_value})
        mock.filter.assert_called_once()

    def test_filter_record_root_unequal(self):
        """Test for an unequal root filter on a FilterRecord is successful"""

        field_name = 'test_field_1'
        field_value = 'value_test_1'
        comparator = FilterRecord.UNEQUAL

        mock = Mock()
        filter_record = FilterRecord(
            field_name=field_name,
            comparator=comparator, field_value=field_value)

        filter_record.apply_filter(mock)

        self.assertEqual(mock.exclude.call_args[1],
                         {f"{field_name}__iexact": field_value})
        mock.exclude.assert_called_once()

    def test_filter_record_root_contains(self):
        """Test for an contains root filter on a FilterRecord is successful"""

        field_name = 'test_field_1'
        field_value = 'value_test_1'
        comparator = FilterRecord.CONTAINS

        mock = Mock()
        filter_record = FilterRecord(
            field_name=field_name,
            comparator=comparator, field_value=field_value)

        filter_record.apply_filter(mock)

        self.assertEqual(mock.filter.call_args[1],
                         {f"{field_name}__icontains": field_value})
        mock.filter.assert_called_once()

    def test_filter_record_metadata_equal(self):
        """Test for an equal metadata filter on a FilterRecord is successful"""

        field_name = 'metadata.test_field_1.sub_field'
        field_value = 'value_test_1'
        comparator = FilterRecord.EQUAL
        data = {field_name.split(
            '.')[1]: {field_name.split('.')[2]: field_value}}

        mock = Mock()
        mock.filter.return_value = [mock, ]
        mock.metadata = data
        filter_record = FilterRecord(
            field_name=field_name,
            comparator=comparator, field_value=field_value)

        filter_record.apply_filter(mock)

        self.assertEqual(mock.filter.call_count, 1)
        self.assertEqual(mock.filter.call_args[1],
                         {"metadata__icontains": field_value})

    def test_filter_record_metadata_unequal(self):
        """Test for an unequal metadata filter on a FilterRecord is
        successful"""

        field_name = 'metadata.test_field_1.sub_field'
        field_value = 'value_test_1'
        comparator = FilterRecord.UNEQUAL
        data = {field_name.split(
            '.')[1]: {field_name.split('.')[2]: 'wrong_val'}}

        mock = Mock()
        mock.metadata = data
        filter_record = FilterRecord(
            field_name=field_name,
            comparator=comparator, field_value=field_value)

        filter_record.apply_filter([mock, ])

        self.assertEqual(mock.filter.call_count, 0)

    def test_filter_record_metadata_contains(self):
        """Test for an contains metadata filter on a FilterRecord is
        successful"""

        field_name = 'metadata.test_field_1.sub_field'
        field_value = 'value_test_1'
        comparator = FilterRecord.CONTAINS
        data = {field_name.split(
            '.')[1]: {field_name.split('.')[2]: field_value}}

        mock = Mock()
        mock.filter.return_value = [mock, ]
        mock.metadata = data
        filter_record = FilterRecord(
            field_name=field_name,
            comparator=comparator, field_value=field_value)

        filter_record.apply_filter(mock)

        self.assertEqual(mock.filter.call_count, 1)
        self.assertEqual(mock.filter.call_args[1],
                         {"metadata__icontains": field_value})

    def test_create_neo4j_configuration(self):
        """Test that creating a new Neo4j Configuration entry is successful
        with defaults """
        neo4j_uri = 'test_file.json'
        neo4j_user = 'test:8080'
        neo4j_pwd = 'test-index'

        neo4jConfig = Neo4jConfiguration(neo4j_uri=neo4j_uri,
                                         neo4j_user=neo4j_user,
                                         neo4j_pwd=neo4j_pwd)

        self.assertEqual(neo4jConfig.neo4j_uri,
                         neo4j_uri)
        self.assertEqual(neo4jConfig.neo4j_user, neo4j_user)
        self.assertEqual(neo4jConfig.neo4j_pwd, neo4j_pwd)

    def test_create_two_neo4j_configuration(self):
        """Test that trying to create more than one Neo4j Configuration throws
        ValidationError """
        with self.assertRaises(ValidationError):
            neo4jConfig = Neo4jConfiguration(neo4j_uri="example1.json")
            ne04jConfig2 = Neo4jConfiguration(neo4j_uri="example2.json")
            neo4jConfig.save()
            ne04jConfig2.save()
