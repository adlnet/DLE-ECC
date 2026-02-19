#!/usr/bin/env bash
# start-server.sh
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] ; then
    (cd openlxp-xia-moodle; python manage.py createsuperuser --no-input)
fi
(cd openlxp-xia-moodle; gunicorn openlxp_xia_moodle_project.wsgi --reload --user python --bind 0.0.0.0:8020 --workers 3)
