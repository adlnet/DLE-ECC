import logging

from core.models import Neo4jConfiguration

logger = logging.getLogger('dict_config_logger')


def get_neo4j_endpoint():
    """Getting Neo4j URI to connect to Neo4j """
    configuration = Neo4jConfiguration.objects.first()
    neo4j_uri = configuration.neo4j_uri
    return neo4j_uri


def get_neo4j_auth():
    """Getting user id and password to connect to Neo4j """
    configuration = Neo4jConfiguration.objects.first()
    neo4j_user = configuration.neo4j_user
    neo4j_pwd = configuration.neo4j_pwd
    return neo4j_user, neo4j_pwd
