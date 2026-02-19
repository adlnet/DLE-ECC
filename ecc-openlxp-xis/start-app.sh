#!/usr/bin/env bash
# start-server.sh

cd /tmp/app/openlxp-xis/
sed -i 's/hashlib.md5()/hashlib.md5(usedforsecurity=False)/g' /tmp/app/.cache/python-packages/django/db/backends/utils.py
python3 manage.py waitdb 
python3 manage.py migrate --skip-checks
python3 manage.py createcachetable
python3 manage.py collectstatic --no-input 
cp -ur ./static/ /tmp/shared/
cp -ur ./media/ /tmp/shared/
cd /tmp/app/
pwd 
./start-server.sh
