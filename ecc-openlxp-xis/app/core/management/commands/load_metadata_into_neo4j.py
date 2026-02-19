import logging

from django.core.management.base import BaseCommand
from neo4j import GraphDatabase

from core.management.utils.neo4j_client import (get_neo4j_auth,
                                                get_neo4j_endpoint)
from core.models import CompositeLedger

logger = logging.getLogger('dict_config_logger')


def check_records_to_load_into_neo4j():
    """Retrieve number of Composite_Ledger records in XIS to load into Neo4j
    and call the post_data_to_neo4j accordingly"""
    # Getting records from Composite Ledger to post into Neo4j
    data = CompositeLedger.objects.filter(
        record_status='Active',
        metadata_transmission_status_neo4j='Ready').values('metadata',
                                                           'metadata_key',
                                                           'metadata_key_hash')
    # Checking available no. of records in XIS to load into XIS is Zero or not
    if len(data) == 0:
        logger.info("Data Loading in Neo4j is complete, Zero records are "
                    "available in XIS to load in Neo4j")
    else:
        post_data_to_neo4j(data)


def post_data_to_neo4j(data):
    """POSTing XIS composite_ledger to Neo4j in JSON format"""
    # Traversing through each row one by one from data
    driver_connection = connect_to_neo4j_driver()
    for row in data:
        # Creating Node for Metadata_Ledger
        post_metadata_ledger_to_neo4j(row, driver_connection)
        # Creating Node for Supplemental_Ledger
        post_supplemental_ledger_to_neo4j(row, driver_connection)
        # Updating Record status in Composite Ledger
        CompositeLedger.objects.filter(
            metadata_key_hash=row['metadata_key_hash']).update(
            metadata_transmission_status_neo4j="Successful")
    check_records_to_load_into_neo4j()


def connect_to_neo4j_driver():
    """Connection with Neo4j Driver"""
    # Getting user id and password to connect to Neo4j
    user_id, pwd = get_neo4j_auth()
    try:
        # Making connection with Neo4j Driver
        driver_connection = GraphDatabase.driver(uri=get_neo4j_endpoint(),
                                                 auth=(user_id, pwd))
        return driver_connection
    except Exception as e:
        logger.info(
            'ERROR: Could not connect to the Neo4j Database. See console for '
            'details.')
        raise SystemExit(e)


def post_metadata_ledger_to_neo4j(row, driver_connection):
    """POSTing XIS composite_ledger to Neo4j in JSON format"""
    if row['metadata']['Metadata_Ledger']:
        metadata_data = {k: v for k, v in row['metadata'][
            'Metadata_Ledger'].items() if
                         v != "NaT" and v and v != "null"}
        keys_list = metadata_data.keys()
        for item in keys_list:
            item_metadata = metadata_data[item]
            item_metadata['name'] = item
            # Adding metadata_key and metadata_key_hash to identify the node
            item_metadata['metadata_key'] = row['metadata_key']
            item_metadata['metadata_key_hash'] = row['metadata_key_hash']
            # Creating graph node for each key in Metadata Ledger
            try:
                session = driver_connection.session()
                session.run(
                    query="UNWIND $dict_param AS map "
                          "CREATE (n: name) "
                          "SET n = map",
                    parameters={'dict_param': [item_metadata]}
                )
                session.close()
            except Exception as e:
                logger.info(e)


def post_supplemental_ledger_to_neo4j(row, driver_connection):
    """POSTing XIS composite_ledger to Neo4j in JSON format"""
    # Removing empty/Null data fields in supplemental data
    if row['metadata']['Supplemental_Ledger']:
        supplemental_data = {k: v for k, v in row['metadata'][
            'Supplemental_Ledger'].items() if
                             v != "NaT" and v and v != "null"}
        supplemental_data['name'] = 'Supplemental_Ledger'
        # Adding metadata_key and metadata_key_hash to identify the node
        supplemental_data['metadata_key'] = row['metadata_key']
        supplemental_data['metadata_key_hash'] = row['metadata_key_hash']
        # Creating graph node for Supplemental Ledger
        try:
            session = driver_connection.session()
            session.run(
                query="UNWIND $dict_param AS map "
                      "CREATE (n:Supplemental_Ledger) "
                      "SET n = map "
                      "RETURN n.metadata_key_hash",
                parameters={'dict_param': [supplemental_data]}
            )
            session.close()
        except Exception as e:
            logger.info(e)


class Command(BaseCommand):
    """Django command to load Composite_Ledger in the Neo4j graph database"""

    def handle(self, *args, **options):
        """Metadata load from XIS Composite_Ledger to Neo4j"""

        check_records_to_load_into_neo4j()
