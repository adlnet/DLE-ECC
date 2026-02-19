import logging
from unittest.mock import patch

from django.test import tag

from core.tasks import xis_workflow

from .test_setup import TestSetUp

logger = logging.getLogger('dict_config_logger')


@tag('unit')
class TasksTests(TestSetUp):

    @patch("core.tasks.xis_workflow.run")
    def test_xis_workflow(self, mock_run):
        """Testing the working of xis workflow celery task queue"""
        self.assert_(xis_workflow.run())

        self.assert_(xis_workflow.run())
        self.assertEqual(mock_run.call_count, 2)

        self.assert_(xis_workflow.run())
        self.assertEqual(mock_run.call_count, 3)
