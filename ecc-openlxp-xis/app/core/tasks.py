import logging

from celery import shared_task

from openlxp_P1_notification.management.commands.trigger_status_update import \
    Command as conformance_alerts_Command

from core.management.commands.consolidate_ledgers import \
    Command as consolidate_ledgers
from core.management.commands.load_metadata_from_xis import \
    Command as upstream_xis
from core.management.commands.load_metadata_into_xis import \
    Command as downstream_xis
from core.management.commands.load_metadata_into_xse import \
    Command as load_metadata

logger = logging.getLogger('dict_config_logger')


@shared_task(name="workflow_for_xis")
def xis_workflow():
    """XIS automated workflow"""

    conformance_alerts_class = conformance_alerts_Command()
    consolidate_ledgers_class = consolidate_ledgers()
    load_metadata_class = load_metadata()

    consolidate_ledgers_class.handle()
    load_metadata_class.handle()
    conformance_alerts_class.handle(email_references="Status_update")

    logger.info('COMPLETED DATA LOADING INTO XSE')

    # Disable neo4j loading
    # load_metadata_into_neo4j_class = load_metadata_into_neo4j()
    # load_metadata_into_neo4j_class.handle()
    # logger.info('COMPLETED DATA LOADING INTO Neo4J')


@shared_task(name="workflow_for_downstream")
def xis_downstream_workflow():
    """XIS Downstream automated workflow"""

    downstream_xis_class = downstream_xis()

    downstream_xis_class.handle()

    logger.info('COMPLETED DATA LOADING INTO EXTERNAL XIS')


@shared_task(name="workflow_for_upstream")
def xis_upstream_workflow():
    """XIS Downstream automated workflow"""

    upstream_xis_class = upstream_xis()

    upstream_xis_class.handle()

    logger.info('COMPLETED DATA LOADING FROM EXTERNAL XIS')
    