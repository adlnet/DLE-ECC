from rest_framework.test import APITestCase

from users.models import UserProfile

from django.test import override_settings


class TestSetUp(APITestCase):
    """Class with setup and teardown for tests in XIS"""

    def setUp(self):
        """Function to set up necessary data for testing"""

        settings_manager = override_settings(SECURE_SSL_REDIRECT=False)
        settings_manager.enable()
        self.addCleanup(settings_manager.disable)

        self.username = "base@test.com"
        self.password = "1234"

        self.base_user = UserProfile.objects.create_user(
            self.username,
            self.password,
            first_name="base",
            last_name="user")

        self.new_username = "another@test.com"
        self.new_password = "Laskdj30427."
        self.new_fname = "new"
        self.new_lname = "user"

        return super().setUp()

    def tearDown(self):
        return super().tearDown()
