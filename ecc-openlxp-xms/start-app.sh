#!/usr/bin/env bash
# start-server.sh

cd /tmp/app/openlxp-xms/
sed -i 's/hashlib.md5()/hashlib.md5(usedforsecurity=False)/g' /tmp/app/.cache/python-packages/django/db/backends/utils.py
python3 manage.py waitdb 
python3 manage.py migrate --skip-checks
python3 manage.py loaddata admin_theme_data.json
python3 manage.py collectstatic --no-input 
ls -al
cp -rf ./static/ /tmp/shared/
cp -ur ./media/ /tmp/shared/
cd /tmp/app/
pwd 
./start-server.sh