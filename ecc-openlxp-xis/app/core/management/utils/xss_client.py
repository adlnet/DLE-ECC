import logging

import requests
from django.core.cache import cache

from core.management.utils.xis_internal import dict_flatten
from core.models import XISConfiguration

logger = logging.getLogger('dict_config_logger')


def xss_get():
    """Function to get xss configuration value"""
    conf = XISConfiguration.objects.first()
    return conf.xss_host


def read_json_data(schema_ref):
    """get schema from xss and ingest as dictionary values"""
    # check cache for schema
    cached_schema = cache.get(schema_ref)
    if cached_schema:
        return cached_schema

    # if not in cache, connect to api
    xss_host = xss_get()
    request_path = xss_host
    if schema_ref.startswith('xss:'):
        request_path += 'schemas/?iri=' + schema_ref
    else:
        request_path += 'schemas/?name=' + schema_ref
    schema = requests.get(request_path, verify=True, timeout=3.0)
    json_content = schema.json()['schema']

    # save schema to cache
    cache.add(schema_ref, json_content, timeout=10)
    return json_content


def get_target_validation_schema():
    """Retrieve target validation schema from XIS configuration """
    logger.error("Configuration of schemas and files")
    data = XISConfiguration.objects.first()
    target_validation_schema = data.target_schema
    logger.error("Reading schema for validation")
    # Read source validation schema as dictionary
    schema_data_dict = read_json_data(target_validation_schema)
    return schema_data_dict


def get_required_recommended_fields_for_validation():
    """Creating list of fields which are Required & Recommended"""

    schema_data_dict = get_target_validation_schema()
    # Call function to flatten schema used for validation
    flattened_schema_dict = dict_flatten(schema_data_dict, [])

    # Declare list for required and recommended column names
    required_column_list = list()
    recommended_column_list = list()

    #  Adding values to required and recommended list based on schema
    for column, value in flattened_schema_dict.items():
        if value == "Required":
            if column.endswith(".use"):
                column = column[:-len(".use")]
            required_column_list.append(column)
        elif value == "Recommended":
            if column.endswith(".use"):
                column = column[:-len(".use")]
            recommended_column_list.append(column)

    # Returning required and recommended list for validation
    return required_column_list, recommended_column_list


def get_optional_and_recommended_fields_for_validation():
    """Creating list of fields which are Optional or Recommended"""

    schema_data_dict = get_target_validation_schema()
    # Call function to flatten schema used for validation
    flattened_schema_dict = dict_flatten(schema_data_dict, [])

    # Declare list for saving column names
    column_list = list()

    #  Adding values to optional list based on schema
    for column, value in flattened_schema_dict.items():
        if value == "Optional" or value == "Recommended":
            if column.endswith(".use"):
                column = column[:-len(".use")]
            column_list.append(column)

    # Returning optional list for validation
    return column_list


def get_data_types_for_validation():
    """Creating list of fields with the expected datatype objects"""

    schema_data_dict = get_target_validation_schema()
    # Call function to flatten schema used for validation
    flattened_schema_dict = dict_flatten(schema_data_dict, [])

    # mapping from string to datatype objects
    datatype_to_object = {
        "int": int,
        "str": str,
        "bool": bool,
        "URI": str
    }
    expected_data_types = dict()

    #  updating dictionary with expected datatype values for fields in metadata
    for column, value in flattened_schema_dict.items():
        if column.endswith(".data_type"):
            key = column[:-len(".data_type")]
            if value in datatype_to_object:
                value = datatype_to_object[value]
            expected_data_types.update({key: value})

    # Returning required and recommended list for validation
    return expected_data_types
