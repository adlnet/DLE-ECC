import logging

from core.models import XISConfiguration

logger = logging.getLogger('dict_config_logger')


def get_elasticsearch_endpoint():
    """Setting API endpoint for XIS and XSE  communication """
    configuration = XISConfiguration.objects.first()
    api_es_endpoint = configuration.xse_host
    return api_es_endpoint


def get_elasticsearch_index():
    """Setting elastic search index """
    configuration = XISConfiguration.objects.first()
    api_es_index = configuration.xse_index
    return api_es_index


def get_autocomplete_field():
    """Getting autocomplete field"""
    configuration = XISConfiguration.objects.first()
    autocomplete_field = configuration.autocomplete_field
    return autocomplete_field


def get_filter_field():
    """Getting filter field"""
    configuration = XISConfiguration.objects.first()
    filter_field = configuration.filter_field
    return filter_field
