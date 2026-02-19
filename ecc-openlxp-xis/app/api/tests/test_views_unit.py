import json
from unittest.mock import patch

from ddt import data, ddt
from django.test import tag
from django.urls import reverse
from requests.exceptions import HTTPError
from rest_framework import status

from core.models import CompositeLedger

from .test_setup import TestSetUp


@tag('unit')
@ddt
class ViewTests(TestSetUp):

    #  catalog composite fail and success
    def test_get_catalog_list(self):
        """Test that the /api/catalog/ endpoint returns a list of
        catalogs from composite ledger"""

        url = reverse('api:catalog')
        self.composite_ledger_valid_data.save()
        self.composite_ledger_valid_data_2.save()
        response = self.client.get(url)
        responseDict = json.loads(response.content)
        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)
        self.assertTrue(self.provider_name_valid in responseDict)
        self.assertTrue(self.provider_name_valid_2 in responseDict)

    def test_get_catalog_list_no_catalogs(self):
        """Test that the /api/catalog/ endpoint returns a list of
        catalogs from composite ledger"""

        url = reverse('api:catalog')
        response = self.client.get(url)
        responseDict = json.loads(response.content)

        self.assertEqual(response.status_code,
                         status.HTTP_404_NOT_FOUND)
        self.assertTrue(responseDict)

    # managed-data fail and success

    def test_get_metadata_catalog_list(self):
        """Test that the /api/managed-data/ endpoint returns a list of
        catalogs from composite ledger"""

        url = reverse('api:managed-catalog')
        self.metadata_ledger_valid_data.save()
        self.metadata_ledger_valid_data_2.save()

        response = self.client.get(url)
        responseDict = json.loads(response.content)

        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)
        self.assertTrue(self.provider_name_valid in responseDict)
        self.assertTrue(self.provider_name_valid_2 in responseDict)

    def test_get_metadata_catalog_list_no_catalogs(self):
        """Test that the /api/managed-data/ endpoint returns a list of
        catalogs from composite ledger HTTP error"""

        url = reverse('api:managed-catalog')
        response = self.client.get(url)
        responseDict = json.loads(response.content)

        self.assertEqual(response.status_code,
                         status.HTTP_404_NOT_FOUND)
        self.assertTrue(responseDict)

    # api/metadata/

    def test_get_records_no_param(self):
        """Test that the /api/metadata/ endpoint returns a list of records
           if no parameter is sent"""
        url = reverse('api:metadata')
        result_obj = {
            "test": "test"
        }

        with patch('api.views.CompositeLedger.objects') as compositeObj, \
                patch('api.views.MetaDataView.get_serializer') as serializer:
            compositeObj.return_value = compositeObj
            compositeObj.filter.return_value = [result_obj, ]
            compositeObj.all.return_value = compositeObj
            compositeObj.order_by.return_value = compositeObj
            serializer.return_value = serializer
            serializer.data = result_obj

            response = self.client.get(url)
            responseDict = json.loads(response.content)

            self.assertEqual(response.status_code,
                             status.HTTP_200_OK)
            self.assertEqual(responseDict['results'], result_obj)
            self.assertEqual(responseDict['count'], 1)

    def test_get_records_no_param_empty(self):
        """Test that the /api/metadata/ endpoint returns an empty list of records
           if no parameter is sent"""
        url = reverse('api:metadata')

        with patch('api.views.CompositeLedger.objects.all') as compositeObj, \
                patch('api.views.CompositeLedgerSerializer') as serializer:
            compositeObj.return_value = CompositeLedger.objects.none()
            serializer.return_value = serializer

            response = self.client.get(url)
            responseDict = json.loads(response.content)

            self.assertEqual(response.status_code,
                             status.HTTP_200_OK)
            self.assertIn('count', responseDict)
            self.assertIn('next', responseDict)
            self.assertIn('previous', responseDict)
            self.assertIn('results', responseDict)

    # api/metadata/?provider=

    def test_get_records_provider_found(self):
        """Test that the /api/metadata/ endpoint returns an object
           if provider name is found"""
        url = "%s?provider=test" % (reverse('api:metadata'))
        result_obj = {
            "test": "test"
        }

        with patch('api.views.CompositeLedger.objects') as compositeObj, \
                patch('api.views.MetaDataView.get_serializer') as serializer:
            compositeObj.return_value = compositeObj
            compositeObj.filter.side_effect = [
                compositeObj, compositeObj, result_obj]
            compositeObj.all.return_value = compositeObj
            compositeObj.order_by.return_value = compositeObj
            serializer.return_value = serializer
            serializer.data = result_obj

            response = self.client.get(url)
            responseDict = json.loads(response.content)

            self.assertEqual(response.status_code,
                             status.HTTP_200_OK)
            self.assertEqual(responseDict['results'], result_obj)

    def test_get_records_provider_not_found(self):
        """Test that the /api/metadata/ endpoint returns the correct error
            if no provider name is found"""
        url = "%s?provider=test" % (reverse('api:metadata'))

        with patch('api.views.CompositeLedger.objects') as compositeObj:
            compositeObj.return_value = compositeObj
            compositeObj.filter.side_effect = [
                compositeObj, CompositeLedger.objects.none()]
            compositeObj.all.return_value = compositeObj
            compositeObj.order_by.return_value = compositeObj

            response = self.client.get(url)
            responseDict = json.loads(response.content)

            self.assertEqual(response.status_code,
                             status.HTTP_200_OK)
            self.assertEqual(responseDict['count'], 0)

    # api/metadata/?metadata_key_hash=

    def test_get_record_by_key_hashes(self):
        """Test that the /api/metadata/?metadata_key_hash= returns a
            list of records for each found hash"""
        key_list = self.metadata_key_hash_valid
        self.composite_ledger_valid_data.save()
        url = "%s?metadata_key_hash_list=%s" \
              % (reverse('api:metadata'), key_list)

        response = self.client.get(url)
        responseDict = json.loads(response.content)

        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)
        self.assertEqual(responseDict['count'], 1)
        self.assertEqual(responseDict['results'][0]["metadata_key_hash"],
                         self.metadata_key_hash_valid)

    def test_get_record_by_key_hashes_not_found(self):
        """Test that the /api/metadata/?metadata_key_hasht= returns an
            error if no record is found"""
        key_list = "1234,456,789"
        url = "%s?metadata_key_hash=%s" \
              % (reverse('api:metadata'), key_list)

        response = self.client.get(url)
        responseDict = json.loads(response.content)

        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)
        self.assertEqual(responseDict['results'], [])
        self.assertEqual(responseDict['count'], 0)

    # api/metadata/?id=

    def test_get_records_id_not_found(self):
        """Test that the /api/metadata/ endpoint returns the correct error
            if no id is found"""
        url = "%s?id=test" % (reverse('api:metadata'))

        with patch('api.views.CompositeLedger.objects') as compositeObj:
            compositeObj.return_value = compositeObj
            compositeObj.filter.side_effect = [
                compositeObj, compositeObj, None]
            compositeObj.all.return_value = compositeObj
            compositeObj.order_by.return_value = compositeObj

            response = self.client.get(url)
            responseDict = json.loads(response.content)

            self.assertEqual(response.status_code,
                             status.HTTP_200_OK)
            self.assertEqual(responseDict['results'], [])
            self.assertEqual(responseDict['count'], 0)

    @data("1", "1,12", "12345,4232,1313,")
    def test_get_records_id_found(self, param):
        """Test that the /api/metadata/ endpoint returns an object
           if the id(s) are found"""
        url = "%s?id=%s" % (reverse('api:metadata'), param)
        result_obj = {
            "test": "test"
        }

        with patch('api.views.CompositeLedger.objects') as compositeObj, \
                patch('api.views.MetaDataView.get_serializer') as serializer:
            compositeObj.return_value = compositeObj
            compositeObj.filter.side_effect = [
                compositeObj, compositeObj, result_obj]
            compositeObj.all.return_value = compositeObj
            compositeObj.order_by.return_value = compositeObj
            serializer.return_value = serializer
            serializer.data = result_obj

            response = self.client.get(url)
            responseDict = json.loads(response.content)

            self.assertEqual(response.status_code,
                             status.HTTP_200_OK)
            self.assertEqual(responseDict['results'], result_obj)

    # api/metadata/<course_id>

    def test_record_for_requested_course_id(self):
        """Test that the /api/metadata/ID endpoint returns a single record with
            the matching id"""
        doc_id = '123456'
        url = reverse('api:record_for_requested_course_id', args=(doc_id,))

        with patch('api.views.CompositeLedger.objects') as compositeObj:
            compositeObj.return_value = compositeObj
            compositeObj.order_by.return_value = compositeObj
            compositeObj.get.return_value = self.composite_ledger_valid_data

            response = self.client.get(url)
            responseDict = json.loads(response.content)

            self.assertEqual(response.status_code,
                             status.HTTP_200_OK)
            self.assertEqual(responseDict['unique_record_identifier'],
                             str(self.unique_record_identifier))

    def test_record_for_requested_course_id_inactive(self):
        """Test that the /api/metadata/ID endpoint returns a single record with
            the matching id"""
        doc_id = '123456'
        url = reverse('api:record_for_requested_course_id', args=(doc_id,))

        with patch('api.views.CompositeLedger.objects.get') as compositeObj:
            compositeObj.return_value = CompositeLedger.objects.none()

            response = self.client.get(url)
            responseDict = json.loads(response.content)

            self.assertEqual(response.status_code,
                             status.HTTP_500_INTERNAL_SERVER_ERROR)
            self.assertTrue(responseDict)

    def test_record_for_requested_course_id_fail(self):
        """Test that the /api/metadata/ID endpoint returns a 500 error if an
            exception is thrown"""
        doc_id = '123456'
        url = reverse('api:record_for_requested_course_id', args=(doc_id,))

        with patch('api.views.CompositeLedger.objects') as compositeObj:
            compositeObj.return_value = compositeObj
            compositeObj.order_by.return_value = compositeObj
            compositeObj.get.side_effect = HTTPError

            response = self.client.get(url)

            self.assertEqual(response.status_code,
                             status.HTTP_500_INTERNAL_SERVER_ERROR)

    # api/managed-metadata
    def test_get_managed_metadata(self):
        """Test that the /api/managed-data/?metadata_key_hash= returns a
            list of records for each found hash"""
        key_list = self.metadata_key_hash_valid
        self.metadata_ledger_valid_data.save()
        self.supplemental_ledger_valid_data.save()
        url = reverse('api:managed-data', args=(self.provider_name_valid,
                                                key_list,))

        response = self.client.get(url)
        responseDict = json.loads(response.content)

        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)
        self.assertEqual(len(responseDict), 1)
        self.assertEqual(responseDict[0]["metadata_key_hash"],
                         self.metadata_key_hash_valid)

    def test_get_managed_metadata_key_hashes_not_found(self):
        """Test that the /api/managed-data/?metadata_key_hash returns an
            error if no record is found"""
        key_list = "1234,456,789"
        url = reverse('api:managed-data', args=(self.provider_name_valid,
                                                key_list,))

        response = self.client.get(url)

        self.assertEqual(response.status_code,
                         status.HTTP_404_NOT_FOUND)

    # post /api/metadata/
    def test_post_record_valid(self):
        """Test that sending a POST request to the /api/metadata endpoint
            succeeds and returns unique record identifier for the new record"""
        url = reverse('api:metadata')

        with patch('api.serializers'
                   '.get_required_recommended_fields_for_validation') \
                as get_lists:
            with patch('api.serializers'
                       '.get_data_types_for_validation') \
                    as get_data_types:
                get_data_types.return_value = {}
                rec_fields = []
                req_fields = []
                get_lists.return_value = rec_fields, req_fields
                dataSTR = json.dumps(self.metadataLedger_data_valid)
                dataJSON = json.loads(dataSTR)
                self.client.force_login(self.super_user)
                response = self.client.post(
                    url, dataJSON, format="json")
                responseDict = json.loads(response.content)
                uid = \
                    self.metadataLedger_data_valid['unique_record_identifier']

                self.assertEqual(response.status_code,
                                 status.HTTP_201_CREATED)
                self.assertEqual(responseDict, uid)

    def test_post_record_invalid(self):
        """Test that sending a POST request to the /api/metadata endpoint
            succeeds and returns unique record identifier for the new record"""
        url = reverse('api:metadata')

        with patch('api.views.MetadataLedgerSerializer') as serializer:
            serializer.return_value = serializer
            serializer.is_valid.return_value = True
            serializer.save.return_value = serializer
            serializer.data = self.metadataLedger_data_invalid
            dataSTR = json.dumps(self.metadataLedger_data_invalid)
            dataJSON = json.loads(dataSTR)
            self.client.force_login(self.super_user)
            response = self.client.post(
                url, dataJSON, format="json")
            responseDict = json.loads(response.content)

            self.assertEqual(response.status_code,
                             status.HTTP_201_CREATED)
            self.assertTrue(responseDict)

    # api/managed-metadata

    def test_post_managed_metadata(self):
        """Test that sending a POST request to the /api/metadata endpoint
            succeeds and returns unique record identifier for the new record"""
        self.metadata_ledger_valid_data_updated.save()

        url = reverse('api:managed-data', args=(self.provider_name_valid,
                                                self.metadata_key_hash_valid,))

        with patch('api.serializers'
                   '.get_required_recommended_fields_for_validation') \
                as get_lists:
            with patch('api.serializers'
                       '.get_data_types_for_validation') \
                    as get_data_types:
                get_data_types.return_value = {}
                rec_fields = []
                req_fields = []
                get_lists.return_value = rec_fields, req_fields
                dataSTR = json.dumps(self.composite_data_valid)
                dataJSON = json.loads(dataSTR)
                self.client.force_login(self.super_user)
                response = self.client.post(
                    url, dataJSON, format="json")
                responseDict = json.loads(response.content)

                key = self.composite_data_valid['metadata_key_hash']

                self.assertEqual(response.status_code,
                                 status.HTTP_200_OK)
                self.assertEqual(responseDict, key)

    def test_post_managed_metadata_invalid(self):
        """Test that sending a POST request to the /api/metadata endpoint
            fails and returns a 400"""

        url = reverse('api:managed-data', args=(
            self.provider_name_invalid, self.metadata_key_hash_invalid,))

        with patch('api.views.MetadataLedgerSerializer') as serializer:
            serializer.return_value = serializer
            serializer.is_valid.return_value = False
            serializer.errors = self.composite_data_invalid
            dataSTR = json.dumps(self.composite_data_invalid)
            dataJSON = json.loads(dataSTR)
            self.client.force_login(self.super_user)
            response = self.client.post(
                url, dataJSON, format="json")

            self.assertEqual(response.status_code,
                             status.HTTP_400_BAD_REQUEST)
            # self.assertTrue(responseDict)

    # post /api/supplemental-data/

    def test_post_supplemental_record_valid(self):
        """Test that sending a POST request to the /api/supplemental-data
        endpoint succeeds and returns unique record identifier for the new
        record"""
        self.supplemental_ledger_valid_data_updated.save()
        url = reverse('api:supplemental-data')

        with patch('api.serializers'
                   '.get_required_recommended_fields_for_validation') \
                as get_lists:
            rec_fields = []
            req_fields = []
            get_lists.return_value = rec_fields, req_fields
            dataSTR = json.dumps(self.supplemental_data_valid)
            dataJSON = json.loads(dataSTR)
            self.client.force_login(self.super_user)
            response = self.client.post(
                url, dataJSON, format="json")
            print(response.request)
            responseDict = json.loads(response.content)
            uid = self.supplemental_data_valid['unique_record_identifier']
            print("RESPONSE DICT")
            print(responseDict)
            self.assertEqual(response.status_code,
                             status.HTTP_201_CREATED)
            self.assertEqual(responseDict, uid)
