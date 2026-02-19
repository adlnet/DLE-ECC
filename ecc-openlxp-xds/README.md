# Enterprise Course Catalog: OPENLXP-XDS
The Experience Discovery Service (XDS) is the administration and configuration backend to the human-facing XDS application, enabling an Experience Consumer or Experience Facilitator to quickly locate a pertinent learning experience metadata record that has been indexed by the Experience Index Service (XIS). Because the XDS is a separate application, it can be deployed in a separate environment from the XIS. It can even be configured to point to a different XIS and Experience Search engine (XSE) as needed. In addition, multiple XDS applications can be deployed and point to the same XIS, allowing for excellent installation and configuration flexibility. 


## Environment variables
- The following environment variables are required:
// link to AWS docs for descirptions if possible

| Environment Variable      | Description |
| ------------------------- | ----------- |
| AWS_ACCESS_KEY_ID         | The Access Key ID for AWS  |
| AWS_SECRET_ACCESS_KEY     | The Secret Access Key for AWS  |
| AWS_DEFAULT_REGION        | The region for AWS |
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

## Configuration for XDS

1. Navigate over to `https://ecc.staging.dso.mil/ecc-openlxp-xds/admin/` in your browser. JWT should authenticate your P1 user. 

2. <u>CONFIGURATIONS</u>
    - Configure Experience Discovery Service (XDS)
        1. Click on `Xds configurations` > `Add Xds configuration`
            - Enter the configurations below:
                - Under XDS settings, select the `Default user group` from the dropdown list: The Default user group is a group for new users to be assigned to automatically.
                
                - Under XIS settings, add the `Target XIS metadata api`: Metadata API Endpoint to connect to on an XIS instance.

                - Under XSE settings, add the `Target XSE host` & `Target XSE index`: Hostname and port of XSE instance to use. The host is the hostname/port of XSE and the index is the index of data to use on the XSE instance.

    - Configure Experience Discovery Service - User Interface (XDS-UI): 
        1. Click `Add Xdsui configurations` > `Add Xdsui configuration` 
            - Enter the configurations below:

                - `Search results per page`: Number of results that should be displayed on a search page on the UI.

                - `Xds configuration`: Select the XDS Configuration to use.

                - `Course img fallback`: Image to use if no image is supplied in the experience

    - Course information mappings
        1. Click `Course information mappings` > `Add course information mapping`: Default values will be set. Save the right mappings for XDS UI fields with backend data fields. 

3. <u>CORE</u>
    - Course spotlights: Configure Spotlight Courses in XDS-UI
        1. Click on `Course spotlights` > `Add course spotlight`
            - Enter the configurations below:

                - `Course id`: The ID of the course to add.

                - `Active`: Whether this course should be shown in the Spotlight Courses section.
    
    - Search filters: Configure Search Filters in XDS-UI:
        1. Click on `Search filter` > `Add search filter`
            - Enter the configurations below:

                - `Display name`: The name to use to label the filter in the UI.

                - `Field name`: The name of the field in ElasticSearch.

                - `Xds ui configuration`: Select the XDS UI Configuration to use.

                - `Filter type`: The type of filter to use.

                - `Active`: Whether this filter should be shown in the search results page.

    - Course detail hightlights: Add additional fields to be displayed on XDS-UI.
        1. Click on `Course detail highlights` > `Add course detail highlight`
            - Enter the configurations below:

                - `Display name`: The name to use to label the filter in the UI.

                - `Field name`: The name of the field in ElasticSearch.

                - `Xds ui configuration`: Select the XDS UI Configuration to use.

                - `Filter type`: The type of filter to use.

                - `Active`: Whether this filter should be shown in the search results page.

4. <u>OPENLXP AUTHENTICATION</u>
    - Saml configurations: Configure Security Assertion Markup Language (SAML)
        1. Click on `Saml configurations` > `Add Saml configuration`
            - Enter configurations below:
                - `Name`: The name that will be used to identify the IdP in the URL.
                - `Entity id`: The unique name provided by the IdP.
                - `Url`: The connection URL to connect to the IdP at.
                - `Cert`: The public cert used to connect to the IdP.
                - `Attribute mapping`: The JSON formatted mapping to convert attributes provided by the IdP, to a User in this system.

5. <u>OPENLXP_NOTIFICATIONS</u>
    - Templates: Create customized email template content. (default template - edlm-subscribed-list-update)
        1. Click on `Templates` > `Add template`
            - Enter the configurations below:
                - `Template Type`:  Add a reference name for the Template.
                - `message`: Add the email content here.
        
                    Note: Add content formatted as HTML here. You can add the following variables in the content.

                    {name:}
                    {date_time:}
                    {list_name:}
                    {author:}

    - Subjects:  Add the subject line for the email notification. (default subject line "ECC New Resource Alert!" will be set)
        1. Click on `Subjects` > `Add subject`

    - Emails: Set up the configurations for email notifications. (default email configuration for XDS - Subscribed_list_update)
        1. click on `Emails` > `Add email`
            - Enter the configurations below:
                - `Sender`:  Add the sender email address from where notification alerts originate.
                - `Reference`:  Add a reference name for the Email configuration.
                - `Subject`: Select a 'subject' from the drop down options set up previously.
                - `Template`: Select a 'template' from the drop down options set up previously.

<details><summary> Troubleshooting the ECC XDS</summary>

A good basic troubleshooting step is to use `docker-compose down` and then `docker-compose up --build` to rebuild the app image; however, this will delete everything in the database.

| Troubleshooting  | Description |
| ------------- | ------------- |
| XMLSEC | If the build fails when pip tries to install xmlsec, the issue is usually missing libraries. </br> </br> The xmlsec package includes instructions for installing the libraries on common platforms in the [documentation](https://github.com/mehcode/python-xmlsec/blob/master/README.rst#install)  |
| Line Endings      |  If the container builds but crashes or logs an error of unrecognized commands, the issue is usually incorrect line endings.</br> </br> Most IDEs/Text Editors allow changing the line endings, but the dos2unix utility can also be used to change the line endings of `start-app.sh` and `start-server.sh` to LF.|
</details>

<details><summary> Updating the ECC XDS</summary>

To update an existing installation: 

1. Pull the latest changes using git

2. Restart the application using `docker-compose restart`

</details>

<details><summary> ECC XDS Authentication </summary>

The environment variables `SP_PUBLIC_CERT`, `SP_PRIVATE_KEY` , and `SP_ENTITY_ID` must be defined (if using docker-compose the variables can be passed through).

Information on the settings for the authentication module can be found on the [OpenLXP-Authentication repo](https://github.com/OpenLXP/openlxp-authentication).

</details>

<details><summary> ECC XDS Authorization</summary>

The setting `OPEN_ENDPOINTS` can be defined in the django settings file.
It is a list of strings (regex notation may be used) for URLs that should not check for authentication or authorization.

</details>

# Deployment
ECC XDS is be deployed using Docker containers. Docker containers are portable, scalable, and reliable. ECC Docker images will be stored in the public IronBanks Repo1 registry to allow anyone to pull and deploy the image. Docker images are also cloud agnostic which allows for deployment on any cloud provider. Images can be deployed as a single Docker image, a cloud provided container service, and Kubernetes for orchestration. The ECC deploys component images on Kubernetes to orchestrate containers for scalability, reliability, and high availability.

## Testing

### Component Testing & CI/CD

The ECC XDS uses Pylint and Coverage for code coverage testing. To run the automated tests on the application run the command below

### End to End Testing

The ECC XDS uses cypress for system end to end testing.

# Authentication

The environment variables `SP_PUBLIC_CERT`, `SP_PRIVATE_KEY` , and `SP_ENTITY_ID` must be defined.

Information on the settings for the authentication module can be found on the [OpenLXP-Authentication repo](https://github.com/OpenLXP/openlxp-authentication).

# Authorization

The setting `OPEN_ENDPOINTS` can be defined in the django settings file.
It is a list of strings (regex notation may be used) for URLs that should not check for authentication or authorization.

