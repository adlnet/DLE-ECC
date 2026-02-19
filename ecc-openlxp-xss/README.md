
# Enterprise Course Catalog: OPENLXP-XSS 
The Experience Schema Service maintains referential representations of domain entities, as well as transformational mappings that describe how to convert an entity from one particular schema representation to another.

This component responsible for managing pertinent object/record metadata schemas, and the mappings for transforming records from a source metadata schema to a target metadata schema. This component will also be used to store and link vocabularies from stored schema.

## Environment variables
- The following environment variables are required:

| Environment Variable      | Description                                                           |
| ------------------------- | --------------------------------------------------------------------- |
| DB_HOST                   | The host name, IP, or docker container name of the database           |
| DB_NAME                   | The name to give the database                                         |
| DB_PASSWORD               | The password for the user to access the database                      |
| DB_ROOT_PASSWORD          | The password for the root user to access the database, should be the same as `DB_PASSWORD` if using the root user |
| DB_USER                   | The name of the user to use when connecting to the database. When testing use root to allow the creation of a test database |
| DJANGO_SUPERUSER_EMAIL    | The email of the superuser that will be created in the application    |
| DJANGO_SUPERUSER_PASSWORD | The password of the superuser that will be created in the application |
| DJANGO_SUPERUSER_USERNAME | The username of the superuser that will be created in the application |
| ENTITY_ID                 | The Entity ID used to identify this application to Identity Providers when using Single Sign On | 
| LOG_PATH                  | The path to the log file to use                                       |
| SECRET_KEY_VAL            | The Secret Key for Django                                             |
| SP_PRIVATE_KEY            | The Private Key to use when this application communicates with Identity Providers to use Single Sign On |
| SP_PUBLIC_CERT            | The Public Key to use when this application communicates with Identity Providers to use Single Sign On |

## Configuration for XSS
1. Navigate over to `https://ecc.staging.dso.mil/ecc-openlxp-xss/admin/` in your browser and JWT should authenticate you with your P1 credentials.

2. <u>CORE</u>
    - Schema Ledgers
        1. Click on `Schema Ledgers` > `Add schema ledgers`
            - Enter the configurations below:

                - `Schema Name`: Schema file title

                - `Schema File` Upload the Schema file in the required format(JSON)

                - `Status` Select if the Schema is Published or Retired

                - `Major version` Add the Major value of the schema version

                - `Minor Version` Add the Minor value of the schema version

                - `Patch Version` Add the Patch version number of the schema 

            **Note: On uploading the schema file in the required format to the schema ledger the creation of corresponding term set, linked child term set and terms process is triggered.**

    - Transformation Ledger
        1. Click on `Transformation Ledgers` > `Add transformation ledger`
            - Enter configurations below:

                - `Source Schema`: Select source term set file from drop-down

                - `Target Schema`: Select Target term set from drop-down to be mapped to

                - `Schema Mapping File`: Upload the Schema Mapping file to be referenced for mapping in the required format(JSON)

                - `Status`: Select if the Schema Mapping is Published or Retired

            **Note: On uploading the Schema Mapping File in the required format to the transformation ledger, this triggers the process of adding the mapping for the corresponding term values.**
    
    - Term sets: Term sets support the concept of a vocabulary in the context of semantic linking
        1. Click on `Term set` > `Add term set`
            - Enter configurations below: 

                - `IRI` Term set's corresponding IRI

                - `Name` Term set title

                - `Version` Add the version number

                - `Status` Select if the Term set is Published or Retired

    - Child Term sets: Is a term set that contains a references to other term-sets (schemas)
        1. Click on `Child term sets` > `Add child term set`
        - Enter configurations below:

            - `IRI` Term set's corresponding IRI

            - `Name` Term set title

            - `Status` Select if the Term set is Published or Retired

            - `Parent term set` Select the reference to the parent term set from the drop down
    
    - Terms: A term entity can be seen as a word in our dictionary. This entity captures a unique word/term in a term-set or schema.
        1. Click on `Terms` > `Add term`
            - Enter configurations below:

                - `IRI` Term corresponding IRI

                - `Name` Term title

                - `Desciption` Term entity's description

                - `Status` Select if the Term set is Published or Retired

                - `Data Type` Term entity's corresponding data type

                - `Use` Term entity's corresponding use case

                - `Source` Term entity's corresponding source

                - `term set` Select the reference to the parent term set from the drop down

                - `Mapping` Add mappings between terms entity's of different parent term set

                - `Updated by` User that creates/updates the term

   
## API's 
 **XSS contains API endpoints which can be called from other components**
 
Query string parameter: `name` `version` `iri`

      https://ecc.staging.dso.mil/ecc-openlxp-xss/api/schemas/?parameter=parameter_value
    

    
**This API fetches the required schema from the repository using the Name and Version or IRI parameters**

Query string parameter: `sourceName` `sourceVersion` `sourceIRI` `targetName` `targetVersion` `targetIRI`

      https://ecc.staging.dso.mil/ecc-openlxp-xss/api/mappings/
    
*This API fetches the required mapping schema from the repository using the Source Name, Source Version, Target Name and Target Version or source IRI and Target IRI parameters*
   
## Testing

### Component Testing & CI/CD

The ECC XDS uses Pylint and Coverage for code coverage testing. To run the automated tests on the application run the command below

### End to End Testing

The ECC XDS uses cypress for system end to end testing.

# Logs
Check P1 IL2 ArgoCD for logs.

# License

 This project uses the [MIT](http://www.apache.org/licenses/LICENSE-2.0) license.
  
