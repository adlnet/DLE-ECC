#!/usr/bin/env bash
# start-server.sh

cd /tmp/app/openlxp-xss/
sed -i 's/hashlib.md5()/hashlib.md5(usedforsecurity=False)/g' /tmp/app/.cache/python-packages/django/db/backends/utils.py
python3 manage.py waitdb
python3 manage.py migrate --skip-checks
python3 manage.py createcachetable
python3 manage.py loaddata admin_theme_data.json
python3 manage.py loaddata openlxp_email.json
python3 manage.py collectstatic --no-input
 
cp -ur static/ /tmp/shared/ 
cp -ur media/ /tmp/shared/
cd /tmp/app/ 
if [ -n "$TMP_SCHEMA_DIR" ] ; then
    (cd openlxp-xss; install -d -o python -p $TMP_SCHEMA_DIR)
else
    (cd openlxp-xss; install -d -o python -p tmp/schemas)
fi
pwd 
service clamav-daemon restart
./start-server.sh