import logging

import bleach
from confusable_homoglyphs import categories, confusables
from dateutil.parser import parse

logger = logging.getLogger('dict_config_logger')


def required_recommended_logs(id_num, category, field):
    """logs the missing required and recommended """

    RECORD = "Record"

    # Logs the missing required columns
    if category == 'Required':
        logger.error(
            "%s %s does not have all %s fields. %s field is empty",
            RECORD,
            id_num,
            category,
            field
        )
    # Logs the missing recommended columns
    if category == 'Recommended':
        logger.warning(
            "%s %s does not have all %s fields. %s field is empty",
            RECORD,
            id_num,
            category,
            field
        )
    # Logs the inaccurate datatype columns
    if category == 'datatype':
        logger.warning(
            "%s %s does not have the expected %s for the field %s",
            RECORD,
            id_num,
            category,
            field
        )
    # Logs the prefered alias during homoglyph check
    if category == 'homoglyphs':
        logger.error(
            "%s %s does not have the expected preferred aliases for the field %s",
            RECORD,
            id_num,
            field
        )


def dict_flatten(data_dict, required_column_list):
    """Function to flatten/normalize  data dictionary"""

    # assign flattened json object to variable
    flatten_dict = {}

    # Check every key elements value in data
    for element in data_dict:
        # If Json Field value is a Nested Json
        if isinstance(data_dict[element], dict):
            flatten_dict_object(data_dict[element],
                                element, flatten_dict, required_column_list)
        # If Json Field value is a list
        elif isinstance(data_dict[element], list):
            flatten_list_object(data_dict[element],
                                element, flatten_dict, required_column_list)
        # If Json Field value is a string
        else:
            update_flattened_object(data_dict[element],
                                    element, flatten_dict)

    # Return the flattened json object
    return flatten_dict


def is_date(string, fuzzy=False):
    """
    Return whether the string can be interpreted as a date.

    :param string: str, string to check for date
    :param fuzzy: bool, ignore unknown tokens in string if True
    """
    if isinstance(string, str):
        try:
            parse(string, fuzzy=fuzzy)
            return True

        except ValueError:
            return False
    else:
        return False


def flatten_list_object(list_obj, prefix, flatten_dict, required_column_list):
    """function to flatten list object"""
    required_prefix_list = []
    for i in range(len(list_obj)):
        #  storing initial flatten_dict for resetting values
        if not i:
            flatten_dict_temp = flatten_dict
        # resetting flatten_dict to initial value
        else:
            flatten_dict = flatten_dict_temp

        passed = flatten_list_object_helper(list_obj, prefix, flatten_dict,
                                            required_column_list,
                                            required_prefix_list, i)

        # if all required values are skip other object in list
        if passed:
            break


def flatten_list_object_helper(list_obj, prefix, flatten_dict,
                               required_column_list, required_prefix_list, i):
    if isinstance(list_obj[i], list):
        flatten_list_object(list_obj[i], prefix, flatten_dict,
                            required_column_list)

    elif isinstance(list_obj[i], dict):
        flatten_dict_object(list_obj[i], prefix, flatten_dict,
                            required_column_list)

    else:
        update_flattened_object(list_obj[i], prefix, flatten_dict)

        # looping through required column names
    for required_prefix in required_column_list:
        # finding matching value along with index
        if prefix in required_prefix and\
                required_prefix.index(prefix) == 0:
            required_prefix_list.append(required_prefix)
        #  setting up flag for checking validation
    passed = True

    # looping through items in required columns with matching prefix
    for item_to_check in required_prefix_list:
        #  flag if value not found
        if not flatten_dict[item_to_check]:
            passed = False
    return passed


def flatten_dict_object(dict_obj, prefix, flatten_dict, required_column_list):
    """function to flatten dictionary object"""
    for element in dict_obj:
        if isinstance(dict_obj[element], dict):
            flatten_dict_object(dict_obj[element], prefix + "." +
                                element, flatten_dict, required_column_list)

        elif isinstance(dict_obj[element], list):
            flatten_list_object(dict_obj[element], prefix + "." +
                                element, flatten_dict, required_column_list)

        else:
            update_flattened_object(dict_obj[element], prefix + "." +
                                    element, flatten_dict)


def update_flattened_object(str_obj, prefix, flatten_dict):
    """function to update flattened object to dict variable"""

    flatten_dict.update({prefix: str_obj})


def update_multilevel_dict(dictionary, path, value):
    """
    recursive function to traverse dict to path and set value
    :param dictionary: the dictionary to insert into
    :param path: a list of keys to navigate through to the final item
    :param value: the value to store
    :return: returns the updated dictionary
    """

    if path == []:
        return value

    if path[0] not in dictionary:
        dictionary[path[0]] = {}

    dictionary.update(
        {
            path[0]:
                update_multilevel_dict(dictionary[path[0]], path[1:], value)
        }
    )

    return dictionary


def multi_dict_sort(data, sort_type=0):
    """
    Sorts a dictionary with multiple sub-dictionaries.
    :param data: dictionary to sort
    :param sort_type: for key sort use 0 [default]; for value sort use 1
    :return: dict
    """
    if data:
        items_list = [key for (key, value) in data.items()
                      if type(value) is dict]
        for item_key in items_list:
            data[item_key] = multi_dict_sort(data[item_key], sort_type)
        return {key: value for (key, value) in sorted(data.items(),
                                                      key=lambda x:
                                                      x[sort_type])}
    return data


def bleach_data_to_json(rdata):
    """Recursive function to bleach/clean HTML tags from string
    data and return dictionary data.

    :param rdata: dictionary to clean.
    WARNING rdata will be edited
    :return: dict"""

    # iterate over dict
    for key in rdata:
        # if string, clean
        if isinstance(rdata[key], str):
            rdata[key] = bleach.clean(rdata[key], tags={}, strip=True)
        # if dict, enter dict
        if isinstance(rdata[key], dict):
            rdata[key] = bleach_data_to_json(rdata[key])

    return rdata


def confusable_homoglyphs_check(id_num, data):
    """Checks for dangerous homoglyphs."""

    data_is_safe = True
    for key in data:

        # if string, Check homoglyph
        if isinstance(data[key], str) and bool(confusables.
                                               is_dangerous(data[key])):
            data_is_safe = False
            required_recommended_logs(id_num, "homoglyphs", key)
            logger.error(categories.unique_aliases(data[key]))
        # if dict, enter dict
        if isinstance(data[key], dict):
            ret_val = confusable_homoglyphs_check(id_num, data[key])
            if not ret_val:
                data_is_safe = False
    return data_is_safe
