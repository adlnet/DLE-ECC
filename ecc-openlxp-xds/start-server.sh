#!/usr/bin/env bash
# start-server.sh
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] ; then
    (cd openlxp-xds; python manage.py createsuperuser --no-input)
fi
(cd openlxp-xds; gunicorn openlxp_xds_project.wsgi --reload --user python --bind 0.0.0.0:8020 --workers 3)
