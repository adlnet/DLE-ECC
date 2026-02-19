import hashlib
import json
import uuid
from unittest.mock import patch
from uuid import UUID

from django.contrib.auth.models import User
from django.urls import reverse
from knox.models import AuthToken
from rest_framework.test import APITestCase

from core.models import (CompositeLedger, MetadataLedger, SupplementalLedger,
                         XISConfiguration)


class TestSetUp(APITestCase):
    """Class with setup and teardown for tests in XIS"""

    def setUp(self):
        """Function to set up necessary data for testing"""

        self.su_username = "super@test.com"
        self.su_password = "1234"

        self.super_user = User.objects.create_superuser(
            self.su_username,
            self.su_password,
            first_name="super",
            last_name="user",
        )

        self.token, self.key = AuthToken.objects.create(user=self.super_user)

        self.metadata_url = reverse('api:metadata')
        self.composite_provider_url = reverse('api:metadata')
        self.required_dict = {'Course.CourseProviderName', 'Course.CourseCode',
                              'Course.CourseTitle', 'Course.CourseDescription',
                              'General_Information.StartDate',
                              'General_Information.EndDate'}
        self.recommended_dict = {'Course_Instance.Thumbnail',
                                 'Technical_Information.Thumbnail'}

        self.target_data_dict = {
            'Course': {
                'CourseProviderName': 'Required',
                'DepartmentName': 'Optional',
                'CourseCode': 'Required',
                'CourseTitle': 'Required',
                'CourseDescription': 'Required',
                'CourseShortDescription': 'Optional',
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

        XISConfiguration.objects.create(target_schema='p2881_schema.json',
                                        xse_host='host', xse_index='index')

        self.unique_record_identifier = UUID(
            '09edea0e-6c83-40a6-951e-2acee3e99502')

        def unique_record_identifier_generator():
            unique_record_identifier = uuid.uuid4()
            return unique_record_identifier

        # composite value 1

        # metadata values 1

        self.metadata_valid = {
            "Course": {
                "CourseCode": "course_code_1",
                "CourseType": "",
                "CourseTitle": "Appium Concepts with Mac OS X",
                "CourseAudience": "Users who need to enter GF ",
                "DepartmentName": "DSS/CDSE",
                "CourseDescription": "course description",
                "CourseShortDescription": "course description",
                "CourseProviderName": "AGENT_1",
                "CoursePrerequisites": "CoursePrerequisites",
                "EducationalContext": "",
                "CourseURL": "https://example@data",
                "CourseSubjectMatter": "CourseSubjectMatter",
                "AccreditedBy": "AccreditedBy",
                "CourseSectionDeliveryMode": "AGENT_1"
            },
            "CourseInstance": {
                "CourseCode": "course_code_1",
                "CourseTitle": "Appium Concepts with Mac OS X",
                "CourseURL": "https://example@data",
                "Thumbnail": "https://example@data",
                "EndDate": "end_date",
                "StartDate": "start_date",
                "Instructor": "Instructor",
                'DeliveryMode': 'DeliveryMode',
            },
            "General_Information": {
                "EndDate": "end_date",
                "StartDate": "start_date"
            },
            "Technical_Information": {
                "Location": "Location",
                'Thumbnail': 'Thumbnail'
            },
            "Lifecycle_Information": {
                "Provider": "Provider",
                "Maintainer": "Maintainer"
            }
        }

        r = json.dumps(self.metadata_valid)
        self.metadata_valid_json = json.loads(r)

        self.provider_name_valid = 'AGENT_1'
        self.metadata_hash_valid = str(hashlib.sha512(str(self.metadata_valid).
                                                      encode('utf-8')).
                                       hexdigest())
        field_values = [self.metadata_valid["Course"]["CourseCode"],
                        self.provider_name_valid]
        self.metadata_key_valid = '_'.join(field_values)
        self.metadata_key_hash_valid = \
            str(hashlib.sha512(str(self.metadata_key_valid).
                               encode('utf-8')).hexdigest())

        self.metadataLedger_data_valid = {
            "provider_name": self.provider_name_valid,
            "unique_record_identifier": "fe16decc-a982-40b2-bd2b-e8ab98b80a6e",
            "metadata_hash": self.metadata_hash_valid,
            "metadata_key": self.metadata_key_valid,
            "metadata_key_hash": self.metadata_key_hash_valid,
            "metadata": self.metadata_valid_json,
            "updated_by": "System",
            "record_status": "Active"
        }

        self.supplemental_metadata_valid = {
            "supplemental_data1": "sample1",
            "supplemental_data2": "sample2"
        }
        self.supplemental_metadata_hash_valid = \
            hashlib.sha512(str(self.supplemental_metadata_valid).
                           encode('utf-8')).hexdigest()

        self.supplemental_data_valid = {
            "provider_name": self.provider_name_valid,
            "unique_record_identifier": "fe16decc-a982-40b2-bd2b-e8ab98b80a6f",
            "metadata": self.supplemental_metadata_valid,
            "metadata_hash": self.supplemental_metadata_hash_valid,
            "metadata_key": self.metadata_key_valid,
            "metadata_key_hash": self.metadata_key_hash_valid,
            "updated_by": "System"
        }

        self.composite_ledger_metadata_valid = \
            {"Metadata_Ledger": self.metadataLedger_data_valid['metadata'],
             "Supplemental_Ledger": self.supplemental_data_valid['metadata']}
        self.composite_ledger_metadata_hash_valid = \
            hashlib.sha512(str(self.composite_ledger_metadata_valid).
                           encode('utf-8')).hexdigest()

        self.composite_data_valid = {
            "provider_name": self.provider_name_valid,
            "unique_record_identifier": str(
                unique_record_identifier_generator()),
            "metadata": self.composite_ledger_metadata_valid,
            "metadata_hash": self.composite_ledger_metadata_hash_valid,
            "metadata_key": self.metadata_key_valid,
            "record_status": "Active",
            "metadata_key_hash": self.metadata_key_hash_valid,
            "updated_by": "System"
        }

        self.supplemental_ledger_valid_data = SupplementalLedger(
            unique_record_identifier=unique_record_identifier_generator(),
            metadata=self.supplemental_data_valid,
            metadata_hash=self.supplemental_metadata_hash_valid,
            metadata_key=self.metadata_key_valid,
            record_status="Active",
            metadata_key_hash=self.metadata_key_hash_valid,
            provider_name=self.provider_name_valid)

        self.metadata_ledger_valid_data = MetadataLedger(
            unique_record_identifier=unique_record_identifier_generator(),
            metadata=self.metadata_valid,
            metadata_hash=self.metadata_hash_valid,
            metadata_key=self.metadata_key_valid,
            record_status="Active",
            metadata_validation_status='Y',
            metadata_key_hash=self.metadata_key_hash_valid,
            provider_name=self.provider_name_valid)

        self.composite_ledger_valid_data = CompositeLedger(
            unique_record_identifier="09edea0e-6c83-40a6-951e-2acee3e99502",
            metadata=self.composite_ledger_metadata_valid,
            metadata_hash=self.composite_ledger_metadata_hash_valid,
            metadata_key=self.metadata_key_valid,
            metadata_key_hash=self.metadata_key_hash_valid,
            record_status='Active',
            provider_name=self.provider_name_valid)

        # composite value 1 update

        # metadata values 1 update

        self.metadata_valid_updated = {
            "Course": {
                "CourseCode": "course_code_1",
                "CourseType": "",
                "CourseTitle": "Appium Concepts with Mac OS X",
                "CourseAudience": "Users who need to enter GF ",
                "DepartmentName": "DSS/CDSE",
                "CourseDescription": "course description updated",
                "CourseProviderName": "AGENT_1",
                "EducationalContext": "",
                "CourseSectionDeliveryMode": "AGENT_1"
            },
            "CourseInstance": {
                "CourseURL": "https://example@data"
            },
            "General_Information": {
                "EndDate": "end_date",
                "StartDate": "start_date"
            }
        }

        r = json.dumps(self.metadata_valid)
        self.metadata_valid_json_updated = json.loads(r)

        self.provider_name_valid_updated = 'AGENT_1'
        self.metadata_hash_valid_updated = str(hashlib.sha512(str(
            self.metadata_valid_updated).encode('utf-8')).hexdigest())
        field_values = [self.metadata_valid_updated["Course"]["CourseCode"],
                        self.provider_name_valid_updated]
        self.metadata_key_valid_updated = '_'.join(field_values)
        self.metadata_key_hash_valid_updated = \
            str(hashlib.sha512(str(self.metadata_key_valid_updated).
                               encode('utf-8')).hexdigest())

        self.metadataLedger_data_valid_updated = {
            "provider_name": self.provider_name_valid_updated,
            "unique_record_identifier": "fe16decc-a982-40b2-bd2b-f8ab98b80a6f",
            "metadata_hash": self.metadata_hash_valid_updated,
            "metadata_key": self.metadata_key_valid_updated,
            "metadata_key_hash": self.metadata_key_hash_valid_updated,
            "metadata": self.metadata_valid_json_updated,
            "updated_by": "System"
        }

        self.supplemental_metadata_valid_updated = {
            "supplemental_data1": "sample1 updated",
            "supplemental_data2": "sample2"
        }
        self.supplemental_metadata_hash_valid_updated = \
            hashlib.sha512(str(self.supplemental_metadata_valid_updated).
                           encode('utf-8')).hexdigest()

        self.supplemental_data_valid_updated = {
            "provider_name": self.provider_name_valid_updated,
            "unique_record_identifier": "fe16decc-a982-40b2-bd2b-g8ab98b80a6l",
            "metadata": self.supplemental_metadata_valid_updated,
            "metadata_hash": self.supplemental_metadata_hash_valid_updated,
            "metadata_key": self.metadata_key_valid_updated,
            "metadata_key_hash": self.metadata_key_hash_valid_updated,
            "updated_by": "System"
        }

        self.composite_ledger_metadata_valid_updated = \
            {"Metadata_Ledger": self.
                metadataLedger_data_valid_updated['metadata'],
             "Supplemental_Ledger":
                 self.supplemental_data_valid_updated['metadata']}
        self.composite_ledger_metadata_hash_valid_updated = \
            hashlib.sha512(str(self.composite_ledger_metadata_valid_updated).
                           encode('utf-8')).hexdigest()

        self.composite_data_valid_updated = {
            "provider_name": self.provider_name_valid_updated,
            "unique_record_identifier": str(
                unique_record_identifier_generator()),
            "metadata": self.composite_ledger_metadata_valid_updated,
            "metadata_hash": self.composite_ledger_metadata_hash_valid_updated,
            "metadata_key": self.metadata_key_valid_updated,
            "record_status": "Active",
            "metadata_key_hash": self.metadata_key_hash_valid_updated,
            "updated_by": "System"
        }

        self.supplemental_ledger_valid_data_updated = SupplementalLedger(
            unique_record_identifier=unique_record_identifier_generator(),
            metadata=self.supplemental_data_valid_updated,
            metadata_hash=self.supplemental_metadata_hash_valid_updated,
            metadata_key=self.metadata_key_valid_updated,
            record_status="Active",
            metadata_key_hash=self.metadata_key_hash_valid_updated,
            provider_name=self.provider_name_valid_updated)

        self.metadata_ledger_valid_data_updated = MetadataLedger(
            unique_record_identifier=unique_record_identifier_generator(),
            metadata=self.metadata_valid_updated,
            metadata_hash=self.metadata_hash_valid_updated,
            metadata_key=self.metadata_key_valid_updated,
            record_status="Active",
            metadata_validation_status='Y',
            metadata_key_hash=self.metadata_key_hash_valid_updated,
            provider_name=self.provider_name_valid_updated)

        self.composite_ledger_valid_data_updated = CompositeLedger(
            unique_record_identifier="09edea0f-6c83-40a6-951e-2acee3e99502",
            metadata=self.composite_ledger_metadata_valid_updated,
            metadata_hash=self.composite_ledger_metadata_hash_valid_updated,
            metadata_key=self.metadata_key_valid_updated,
            metadata_key_hash=self.metadata_key_hash_valid_updated,
            record_status='Active',
            provider_name=self.provider_name_valid_updated)

        # composite value 2

        # metadata values 2

        self.metadata_valid_2 = {
            "Course": {
                "CourseCode": "course_code_2",
                "CourseType": "",
                "CourseTitle": "Title 2 for course",
                "CourseAudience": "Users who need to enter GF ",
                "DepartmentName": "DSS/CDSE",
                "CourseDescription": "course description 2",
                "CourseProviderName": "AGENT_2",
                "EducationalContext": "",
                "CourseSectionDeliveryMode": "AGENT_2"
            },
            "CourseInstance": {
                "CourseURL": "https://example@data"
            },
            "General_Information": {
                "EndDate": "end_date",
                "StartDate": "start_date"
            }
        }
        self.provider_name_valid_2 = 'AGENT_2'
        self.metadata_hash_valid_2 = \
            hashlib.sha512(
                str(self.metadata_valid_2).encode('utf-8')).hexdigest()
        field_values = [self.metadata_valid_2["Course"]["CourseCode"],
                        self.provider_name_valid_2]
        self.metadata_key_valid_2 = '_'.join(field_values)
        self.metadata_key_hash_valid_2 = \
            hashlib.sha512(str(self.metadata_key_valid_2).
                           encode('utf-8')).hexdigest()

        self.metadataLedger_data_valid_2 = {
            "provider_name": self.provider_name_valid_2,
            "unique_record_identifier": "fe16decc-a982-40b2-bd2b-e8ab98b80a71",
            "metadata": self.metadata_valid_2,
            "metadata_hash": self.metadata_hash_valid_2,
            "metadata_key": self.metadata_key_valid_2,
            "metadata_key_hash": self.metadata_key_hash_valid_2
        }

        self.supplemental_metadata_valid_2 = {
            "supplemental_data1": "sample1_2",
            "supplemental_data2": "sample2_2"
        }
        self.supplemental_metadata_hash_valid_2 = \
            hashlib.sha512(str(self.supplemental_metadata_valid_2).
                           encode('utf-8')).hexdigest()

        self.supplemental_data_valid_2 = {
            "provider_name": self.provider_name_valid_2,
            "unique_record_identifier": "fe16decc-a982-40b2-bd2b-e8ab98b80a72",
            "metadata": self.supplemental_metadata_valid_2,
            "metadata_hash": self.supplemental_metadata_hash_valid_2,
            "metadata_key": self.metadata_key_valid_2,
            "metadata_key_hash": self.metadata_key_hash_valid_2
        }

        self.composite_ledger_metadata_valid_2 = \
            {"Metadata_Ledger": self.metadataLedger_data_valid_2['metadata'],
             "Supplemental_Ledger": self.supplemental_data_valid_2['metadata']}
        self.composite_ledger_metadata_hash_valid_2 = \
            hashlib.sha512(str(self.composite_ledger_metadata_valid_2).
                           encode('utf-8')).hexdigest()

        self.composite_data_valid_2 = {
            "provider_name": self.provider_name_valid_2,
            "unique_record_identifier": "fe16decc-a982-40b2-bd2b-e8ab98b80a6h",
            "metadata": self.composite_ledger_metadata_valid_2,
            "metadata_hash": self.composite_ledger_metadata_hash_valid_2,
            "metadata_key": self.metadata_key_valid_2,
            "record_status": "Active",
            "metadata_key_hash": self.metadata_key_hash_valid_2,
            "updated_by": "System"
        }

        self.metadata_ledger_valid_data_2 = MetadataLedger(
            unique_record_identifier=unique_record_identifier_generator(),
            metadata=self.metadata_valid_2,
            metadata_hash=self.metadata_hash_valid_2,
            metadata_key=self.metadata_key_valid_2,
            metadata_key_hash=self.metadata_key_hash_valid_2,
            provider_name=self.provider_name_valid_2)

        self.composite_ledger_valid_data_2 = CompositeLedger(
            unique_record_identifier=unique_record_identifier_generator(),
            metadata=self.composite_ledger_metadata_valid_2,
            metadata_hash=self.composite_ledger_metadata_hash_valid_2,
            metadata_key=self.metadata_key_valid_2,
            metadata_key_hash=self.metadata_key_hash_valid_2,
            record_status='Active',
            provider_name=self.provider_name_valid_2)

        # invalid composite value

        # metadata invalid values

        self.metadata_invalid = {
            "Course": {
                "CourseCode": "course_code_3",
                "CourseType": "",
                "CourseTitle": "",
                "CourseAudience": "Users who need to enter GF ",
                "DepartmentName": "DSS/CDSE",
                "CourseDescription": "course description",
                "CourseProviderName": "AGENT_3",
                "EducationalContext": "",
                "CourseSectionDeliveryMode": "AGENT_3"
            },
            "CourseInstance": {
                "CourseURL": "https://example@data"
            },
            "General_Information": {
                "EndDate": "end_date",
                "StartDate": "start_date"
            }
        }

        self.provider_name_invalid = 'AGENT_3'
        self.metadata_hash_invalid = \
            hashlib.sha512(
                str(self.metadata_invalid).encode('utf-8')).hexdigest()
        field_values = [self.metadata_invalid["Course"]["CourseCode"],
                        self.provider_name_invalid]
        self.metadata_key_invalid = '_'.join(field_values)
        self.metadata_key_hash_invalid = \
            hashlib.sha512(str(self.metadata_key_invalid).
                           encode('utf-8')).hexdigest()

        self.metadataLedger_data_invalid = {
            "provider_name": self.provider_name_invalid,
            "unique_record_identifier": "fe16decc-a982-40b2-bd2b-e8ab98b80a8a",
            "metadata": self.metadata_invalid,
            "metadata_hash": self.metadata_hash_invalid,
            "metadata_key": self.metadata_key_invalid,
            "metadata_key_hash": self.metadata_key_hash_invalid,
            "updated_by": "System"
        }

        self.supplemental_metadata_invalid = {
            "supplemental_data1": "sample1_invalid",
            "supplemental_data2": "sample2_invalid"
        }
        self.supplemental_metadata_hash_invalid = \
            hashlib.sha512(str(self.supplemental_metadata_invalid).
                           encode('utf-8')).hexdigest()

        self.supplemental_data_invalid = {
            "provider_name": self.provider_name_invalid,
            "unique_record_identifier": "fe16decc-a982-40b2-bd2b-e8ab98b80a8b",
            "metadata": self.supplemental_metadata_invalid,
            "metadata_hash": self.supplemental_metadata_hash_invalid,
            "metadata_key": self.metadata_key_invalid,
            "metadata_key_hash": self.metadata_key_hash_invalid,
            "updated_by": "System"
        }

        self.composite_ledger_metadata_invalid = \
            {"Metadata_Ledger": self.metadataLedger_data_invalid['metadata'],
             "Supplemental_Ledger": self.supplemental_data_invalid['metadata']}

        self.composite_ledger_metadata_hash_invalid = \
            hashlib.sha512(str(self.composite_ledger_metadata_invalid).
                           encode('utf-8')).hexdigest()

        self.composite_data_invalid = {
            "provider_name": self.provider_name_invalid,
            "unique_record_identifier": "fe16decc-a982-40b2-bd2b-e8ab98b80a6h",
            "metadata": self.composite_ledger_metadata_invalid,
            "metadata_hash": self.composite_ledger_metadata_hash_invalid,
            "metadata_key": self.metadata_key_invalid,
            "record_status": "Active",
            "metadata_key_hash": self.metadata_key_hash_invalid,
            "updated_by": "System"
        }

        self.composite_ledger_invalid_data = CompositeLedger(
            unique_record_identifier=str(unique_record_identifier_generator()),
            metadata=self.composite_ledger_metadata_invalid,
            metadata_hash=self.composite_ledger_metadata_hash_invalid,
            metadata_key=self.metadata_key_invalid,
            metadata_key_hash=self.metadata_key_hash_invalid,
            record_status='Active',
            provider_name=self.provider_name_invalid)

        self.composite_ledger_valid_data_dict = {
            "unique_record_identifier": "09edea0e-6c83-40a6-951e-2acee3e99502",
            "metadata": self.composite_ledger_metadata_valid,
            "metadata_key": self.metadata_key_valid,
            "metadata_key_hash": self.metadata_key_hash_valid,
            "record_status": 'Active',
            "provider_name": 'AGENT',
            "metadata_hash": "4f2a7da4f872e9807079ac7cb42aefb4"
        }

        self.mocked_target_validation_schema = patch(
            "core.management.utils.xss_client.get_target_validation_schema"
        ).start()

        self.mocked_target_validation_schema.return_value = \
            self.target_data_dict

        return super().setUp()

    def tearDown(self):
        return super().tearDown()
