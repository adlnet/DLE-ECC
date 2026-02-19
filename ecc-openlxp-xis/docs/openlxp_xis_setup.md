
# Setup
</br>

### Prerequisites
| System Requirement  | Description |
| ------------- | ------------- |
| `Python >= 3.7`| Download and install python from here [Python](https://www.python.org/downloads/).  |
| `Docker`      |  Download and install Docker from here [Docker](https://www.docker.com/products/docker-desktop).|

</br>

### Environment Variables
To run this project, you will need to add the following environment variables to your .env file

<pre><code>/.sample.env

DB_NAME= MySql database name
DB_USER= MySql database user
DB_PASSWORD= MySql database password
DB_ROOT_PASSWORD= MySql database root password
DB_HOST= MySql database host

DJANGO_SUPERUSER_USERNAME= Django admin user name
DJANGO_SUPERUSER_PASSWORD= Django admin user password
DJANGO_SUPERUSER_EMAIL= Django admin user email

BUCKET_NAME= S3 Bucket name where schema files are stored
AWS_ACCESS_KEY_ID= AWS access keys
AWS_SECRET_ACCESS_KEY= AWS access password
AWS_DEFAULT_REGION= AWS region

SECRET_KEY_VAL= Django Secret key to put in Settings.py
CERT_VOLUME= Path for the where all the security certificates are stored
LOG_PATH= Log path were all the app logs will get stored

CELERY_BROKER_URL= Add CELERY_BROKER_URL tell Celery to use Redis as the broker
CELERY_RESULT_BACKEND= Add CELERY_RESULT_BACKEND tell Celery to use Redis as the backend
</code></pre>