import hashlib
import uuid

from django.test import TestCase
from django.urls import reverse

from core.models import (CompositeLedger, MetadataLedger, SupplementalLedger,
                         XISConfiguration)


class TestSetUp(TestCase):
    """Class with setup and teardown for tests in XIS"""

    def setUp(self):
        """Function to set up necessary data for testing"""

        # globally accessible data sets
        self.metadata_url = reverse('api:metadata')
        XISConfiguration.objects.create(target_schema='p2881_schema.json',
                                        xse_host='http://es01:9200/',
                                        xse_index='testing_index')

        self.metadata = {
            "Course": {
                "CourseCode": "TestData 123",
                "CourseTitle": "Acquisition Law",
                "CourseAudience": "test_data",
                "DepartmentName": "",
                "CourseObjective": "test_data",
                "CourseDescription": "test_data",
                "CourseProviderName": "AGENT",
                "CourseSpecialNotes": "test_data",
                "CoursePrerequisites": "None",
                "EstimatedCompletionTime": "4.5 days",
                "CourseSectionDeliveryMode": "Resident",
                "CourseAdditionalInformation": "None"
            },
            "CourseInstance": {
                "CourseURL": "https://edX.tes.com/ui/lms-learning-details"
            },
            "General_Information": {
                "EndDate": "end_date",
                "StartDate": "start_date"
            }
        }

        def unique_record_identifier_generator():
            unique_record_identifier = uuid.uuid4()
            return unique_record_identifier

        self.provider_name = 'AGENT'
        self.updated_by = 'System'
        self.unique_record_identifier = str(
            unique_record_identifier_generator())
        self.metadata_hash = str(hashlib.sha512(str(self.metadata).
                                                encode('utf-8')).
                                 hexdigest()),
        field_values = [self.metadata["Course"]["CourseCode"],
                        self.provider_name]
        self.metadata_key = '_'.join(field_values)
        self.metadata_key_hash = str(hashlib.sha512(str(self.metadata_key).
                                                    encode('utf-8')).
                                     hexdigest()),

        self.metadata_1 = {
            "Course": {
                "CourseCode": "TestData 123",
                "CourseTitle": "Acquisition Law",
                "CourseAudience": "test_data",
                "DepartmentName": "",
                "CourseObjective": "test_data",
                "CourseDescription": "test_data",
                "CourseProviderName": "AGENT",
                "CourseSpecialNotes": "test_data",
                "CoursePrerequisites": "None",
                "EstimatedCompletionTime": "4.5 days",
                "CourseSectionDeliveryMode": "Resident",
                "CourseAdditionalInformation": "None"
            },
            "CourseInstance": {
                "CourseURL": "https://url.tes.com123/ui/lms-learning-details"
            },
            "General_Information": {
                "EndDate": "end_date",
                "StartDate": "start_date"
            }
        }
        self.supplement_metadata = {
            "Field1": "ABC",
            "Field2": "123",
            "Field3": "ABC-123"
        }

        self.metadata_ledger = MetadataLedger(
            unique_record_identifier=str(
                unique_record_identifier_generator()),
            metadata=self.metadata,
            metadata_hash=self.metadata_hash,
            metadata_key_hash=self.metadata_key_hash,
            metadata_key=self.metadata_key,
            metadata_validation_status='Y',
            record_status='Active',
            composite_ledger_transmission_status='Ready',
            provider_name='AGENT',
            updated_by='System'
        )

        self.supplemental_ledger = SupplementalLedger(
            unique_record_identifier=str(
                unique_record_identifier_generator()),
            metadata=self.supplement_metadata,
            metadata_hash=self.metadata_hash,
            metadata_key_hash=self.metadata_key_hash,
            metadata_key=self.metadata_key,
            record_status='Active',
            composite_ledger_transmission_status='Ready',
            provider_name='AGENT',
            updated_by='System')

        self.composite_ledger_dict = {"Metadata_Ledger": self.metadata,
                                      "Supplemental_Ledger":
                                          self.supplement_metadata}

        self.composite_ledger_dict_xse = {
            "Supplemental_Ledger": self.supplement_metadata}

        self.composite_ledger_dict_xse_updated = \
            self.composite_ledger_dict_xse.update(self.metadata)

        self.composite_ledger_metadata_hash_valid = \
            str(hashlib.sha512(str(self.composite_ledger_dict).
                               encode('utf-8')).hexdigest())

        self.composite_data_valid = {
            "provider_name": self.provider_name,
            "unique_record_identifier": str(
                unique_record_identifier_generator()),
            "metadata": self.composite_ledger_dict,
            "metadata_hash": self.composite_ledger_metadata_hash_valid,
            "metadata_key": self.metadata_key,
            "record_status": "Active",
            "metadata_key_hash": self.metadata_key_hash,
            "updated_by": "System"
        }

        self.composite_ledger = CompositeLedger(
            unique_record_identifier=str(
                unique_record_identifier_generator()),
            metadata=self.composite_ledger_dict,
            metadata_key=self.metadata_key,
            metadata_key_hash=self.metadata_key_hash,
            record_status='Active',
            provider_name='AGENT',
            updated_by='System')

        self.xis_data = {
            'metadata': {
                "Course": {
                    "CourseCode": "TestData 123",
                    "CourseTitle": "Acquisition Law",
                    "CourseAudience": "test_data",
                    "DepartmentName": "",
                    "CourseObjective": "test_data",
                    "CourseDescription": "test_data",
                    "CourseProviderName": "edX",
                    "CourseSpecialNotes": "test_data",
                    "CoursePrerequisites": "None",
                    "EstimatedCompletionTime": "4.5 days",
                    "CourseSectionDeliveryMode": "Resident",
                    "CourseAdditionalInformation": "None"
                },
                "CourseInstance": {
                    "CourseURL": "https://edX.tes.com/ui/lms-learning-details"
                },
                "General_Information": {
                    "EndDate": "end_date",
                    "StartDate": "start_date"
                }
            },
            'metadata_key_hash': '6acf7689ea81a1f792e7668a23b1acf5'

        }

        self.xse_expected_data = {
            'metadata': {
                "Course": {
                    "CourseCode": "TestData 123",
                    "CourseTitle": "Acquisition Law",
                    "CourseAudience": "test_data",
                    "DepartmentName": "",
                    "CourseObjective": "test_data",
                    "CourseDescription": "test_data",
                    "CourseProviderName": "edX",
                    "CourseSpecialNotes": "test_data",
                    "CoursePrerequisites": "None",
                    "EstimatedCompletionTime": "4.5 days",
                    "CourseSectionDeliveryMode": "Resident",
                    "CourseAdditionalInformation": "None"
                },
                "CourseInstance": {
                    "CourseURL": "https://edX.tes.com/ui/lms-learning-details"
                },
                "General_Information": {
                    "EndDate": "end_date",
                    "StartDate": "start_date"
                }
            },
            '_id': '6acf7689ea81a1f792e7668a23b1acf5'
        }

        self.test_required_column_names = []
        self.target_data_dict = {
            'Course': {
                'CourseProviderName': 'Required',
                'DepartmentName': 'Optional',
                'CourseCode': 'Required',
                'CourseTitle': 'Required',
                'CourseDescription': 'Required',
                'CourseShortDescription': 'Required',
                'CourseFullDescription': 'Optional',
                'CourseAudience': 'Optional',
                'CourseSectionDeliveryMode': 'Optional',
                'CourseObjective': 'Optional',
                'CoursePrerequisites': 'Optional',
                'EstimatedCompletionTime': 'Optional',
                'CourseSpecialNotes': 'Optional',
                'CourseAdditionalInformation': 'Optional',
                'CourseURL': 'Optional',
                'CourseLevel': 'Optional',
                'CourseSubjectMatter': 'Required'
            },
            'CourseInstance': {
                'CourseCode': 'Required',
                'CourseTitle': 'Required',
                'Thumbnail': 'Recommended',
                'CourseShortDescription': 'Optional',
                'CourseFullDescription': 'Optional',
                'CourseURL': 'Optional',
                'StartDate': 'Required',
                'EndDate': 'Required',
                'EnrollmentStartDate': 'Optional',
                'EnrollmentEndDate': 'Optional',
                'DeliveryMode': 'Required',
                'InLanguage': 'Optional',
                'Instructor': 'Required',
                'Duration': 'Optional',
                'CourseLearningOutcome': 'Optional',
                'CourseLevel': 'Optional',
                'InstructorBio': 'Optional'
            },
            'General_Information': {
                'StartDate': 'Required',
                'EndDate': 'Required'
            },
            'Technical_Information': {
                'Thumbnail': 'Recommended'
            }
        }

        return super().setUp()

    def tearDown(self):
        return super().tearDown()
