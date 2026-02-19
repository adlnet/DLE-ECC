# Enterprise Course Catalog: OpenLXP-XMS
The Experience Management Service (XMS) is a part of the OpenLXP Enterprise Course Catalog (ECC) platform. It is  the backend responsible for managing courses/catalogs.

XMS is the user interface facilitating modification and augmentation of records by learning experience owners and managers.

This Django web application enables experience owners/managers to modify/augment experience metadata via (i.e., the "admin portal") REST API. It utilizes the Django admin UI for system configuration and management.

## Environment variables
- The following environment variables are required:

| Environment Variable      | Description |
| ------------------------- | ----------- |
| CSRF_COOKIE_DOMAIN            | The domain to be used when setting the CSRF cookie. This can be useful for easily allowing cross-subdomain requests to be excluded from the normal cross site request forgery protection. |
| CSRF_TRUSTED_ORIGINS            | A list of trusted origins for unsafe requests |
| DB_HOST                   | The host name, IP, or docker container name of the database |
| DB_NAME                   | The name to give the database |
| DB_PASSWORD               | The password for the user to access the database |
| DB_ROOT_PASSWORD          | The password for the root user to access the database, should be the same as `DB_PASSWORD` if using the root user |
| DB_USER                   | The name of the user to use when connecting to the database. When testing use root to allow the creation of a test database |
| DJANGO_SUPERUSER_EMAIL    | The email of the superuser that will be created in the application |
| DJANGO_SUPERUSER_PASSWORD | The password of the superuser that will be created in the application |
| DJANGO_SUPERUSER_USERNAME | The username of the superuser that will be created in the application |
| ENTITY_ID                 | The Entity ID used to identify this application to Identity Providers when using Single Sign On | 
| LOG_PATH                  | The path to the log file to use |
| SECRET_KEY_VAL            | The Secret Key for Django |
| SP_PRIVATE_KEY            | The Private Key to use when this application communicates with Identity Providers to use Single Sign On |
| SP_PUBLIC_CERT            | The Public Key to use when this application communicates with Identity Providers to use Single Sign On |

## Configuration for XMS
1. Navigate over to `https://ecc.staging.dso.mil/ecc-openlxp-xms/admin/` in your browser and JWT should authenticate you with your P1 credentials. 

2. <u>CONFIGURATIONS</u>
    - Configure Experience Management Service (XMS)
        1. Click on `Xms connections` > `Add Xms connection`
            - Enter configurations below:

                - `Target xis metadata api`: Metadata API Endpoint to connect to on an XIS instance.

                - `XIS catalogs api`: Catalogs API Endpoint to connect to on an XIS instance.

3. <u>OPENLXP AUTHENTICATION</u>
    - Configure Security Assertion Markup Language (SAML)
        1. Click on `Saml configurations` > `Add saml configurations`
            - Enter configurations below:

                - `Name`: The name that will be used to identify the IdP in the URL.

                - `Entity id`: The unique name provided by the IdP.

                - `Url`: The connection URL to connect to the IdP at.

                - `Cert`: The public cert used to connect to the IdP.

                - `Attribute mapping`: The JSON formatted mapping to convert attributes provided by the IdP, to a User in this system.



## Authentication

The environment variables `SP_PUBLIC_CERT`, `SP_PRIVATE_KEY` , and `SP_ENTITY_ID` must be defined (if using docker-compose the variables can be passed through).

Information on the settings for the authentication module can be found on the [OpenLXP-Authentication repo](https://github.com/OpenLXP/openlxp-authentication).


## Authorization

The setting `OPEN_ENDPOINTS` can be defined in the django settings file.
It is a list of strings (regex notation may be used) for URLs that should not check for authentication or authorization.

## Testing

### End to end Testing
The ECC XMS uses cypress for system end to end testing.

## License

 This project uses the [MIT](http://www.apache.org/licenses/LICENSE-2.0) license.


