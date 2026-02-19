from django.test import TestCase, tag

from core.management.utils.xss_client import \
    get_required_recommended_fields_for_validation
from core.models import XISConfiguration


@tag('integration')
class Command(TestCase):
    """Test cases for utils.py function """

    def test_get_required_recommended_fields_for_validation(self):
        """Test for Creating list of fields which are Required and
        recommended """

        xisConfig = XISConfiguration(target_schema='p2881_schema.json')
        xisConfig.save()

        req_dict1, rcm_dict2 = \
            get_required_recommended_fields_for_validation()
        self.assertTrue(req_dict1)
        self.assertTrue(rcm_dict2)
