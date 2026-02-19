# OPENLXP-XIS

## Experience Index Service

XIS Component is the primary funnel for learning experience metadata collected by the XIA components. In addition, the XIS can receive supplemental learning experience metadata – field name/value overrides and augmentations – from the XMS.  

Learning experience metadata received from XIAs is stored in the Metadata Loading Area and processed asynchronously to enhance overall system performance and scalability. Processed metadata combined with supplemental metadata provided by an Experience Owner or Experience Manager and the "composite record" stored in the Metadata Repository. Metadata Repository records addition/modification events logged to a job queue, and the metadata is then sent to the Experience Search Engine (XSE) for indexing and high-performance location/retrieval. 

A XIS can syndicate its composite records to another XIS. One or more facets/dimensions can filter the record-set to transmit a subset of the overall composite record repository. In addition, the transmitted fieldset can be configured to contain redacted values for specified fields when information is considered too sensitive for syndication. 


### XIS Workflows
| Workflow | Description |
| ------------- | ------------- |
| ETL           | ETL pipeline from XIA loads processed metadata ledger and supplemental ledger in a metadata ledger and supplemental ledger of XIS component after a validation. Metadata combined with supplemental metadata provided by an Experience Owner or Experience Manager from XMS also gets stored in XIS. All of them from XIA and XMS finally get merged into XIS's composite ledger after a validation. </br> </br> Composite metadata is then sent to an XSE for further discovery.| 
| Upstream Syndication | Upstream Syndication allows for connecting the current XIS to another XIS in order to retrieve experiences.  Running the Upstream Syndication workflow, triggers a task to iterate over all XIS Upstream configurations that have an active status.  The task retrieves all Composite Ledger experiences from the remote XIS and attempts to load them into the local Metadata and Supplemental Ledgers.  If the incoming data doesn't match the locally set schema, or would otherwise fail being uploaded, it isn't saved. |
| Downstream Syndication | Downstream Syndication allows for connecting the current XIS to another XIS in order to send experiences.  Running the Downstream Syndication workflow, triggers a task to iterate over all XIS Downstream configurations that have an active status.  The task retrieves all Composite Ledger experiences from the local XIS and performs any filters on the records and metadata.  It then attempts to load them into the remote's Metadata and Supplemental Ledgers using the managed-data API.  If the outgoing data doesn't match the remote schema, or would otherwise fail being uploaded, it will not be saved.  |

</br>


### XIS API Endpoints


<details open><summary><b>XIS Workflow Endpoints</b></summary>

</br>

|API Endpoint | Description |
|----------------|----------------------------------|
| `http://localhost:8080/api/xis-workflow` | Triggers the ETL xis-workflow |
| `http://localhost:8080/api/upstream-workflow` | Triggers the upstream-workflow |
| `http://localhost:8080/api/downstream-workflow` | Triggers the downstream-workflow |

</br>

</details>



<details open><summary><b>XIS Query Endpoints</b></summary>

</br>

| API Endpoint | Description |
| ------------- | ------------- |
| `http://localhost:8080/api/catalogs/`| Fetches the names of all course providers |
| `http://localhost:8080/api/metadata/<str:course_id>/` | Fetches or modifies the record of the corresponding course id|


</br>

</details>

## Next Steps
- [Openlxp XIS Installation](docs/openlxp_xis_install.md)
- [Openlxp XIS Setup](docs/openlxp_xis_setup.md)
- [Openlxp XIS Configuration](docs/openlxp_xis_config.md)
- [Openlxp XIS Workflows](docs/openlxp_xis_workflows.md)
- [Openlxp XIS Security](docs/openlxp_security.md)




