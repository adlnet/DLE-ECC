# Dockerfile
FROM registry1.dso.mil/ironbank/opensource/python:v3.13
USER root
# Ensure "python" points to python3 (optional)
RUN if [ ! -e /usr/bin/python ]; then ln -s /usr/bin/python3 /usr/bin/python; fi

# install psql client
RUN dnf -y --nogpg install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
RUN dnf install -y postgresql14

# Install required system packages
RUN dnf install -y libxml2-devel pango && \
    dnf clean all

USER python

RUN if [ ! -f /tmp/debug.log ]; then touch /tmp/debug.log ; fi && \
    chmod a=rwx /tmp/debug.log && \
# copy source and install dependencies
    mkdir -p /tmp/app/openlxp-xds

COPY --chown=python:python --chmod=755 requirements.txt start-server.sh start-app.sh /tmp/app/
COPY --chown=python:python .cache/python-packages /tmp/app/.cache/python-packages/
#COPY --chown=python:python .cache/python-packages python-env/
ENV PYTHONPATH /tmp/app/.cache/python-packages
ENV PATH $PATH:/tmp/app/.cache/python-packages/bin

COPY ./app /tmp/app/openlxp-xds/

WORKDIR /tmp/app/openlxp-xds/

# Remove unecessary python test files for twistlock scan
RUN rm -rf /tmp/app/.cache/python-packages/future/backports/test/badcert.pem \
/tmp/app/.cache/python-packages/future/backports/test/badkey.pem \
/tmp/app/.cache/python-packages/future/backports/test/keycert.passwd.pem \
/tmp/app/.cache/python-packages/future/backports/test/keycert.pem \
/tmp/app/.cache/python-packages/future/backports/test/keycert2.pem \
/tmp/app/.cache/python-packages/future/backports/test/ssl_key.passwd.pem \
/tmp/app/.cache/python-packages/future/backports/test/ssl_key.pem \
/tmp/app/.cache/python-packages/tornado/test/test.key \
/tmp/app/.cache/python-packages/social_core/tests/testkey.pem

CMD ["/tmp/app/start-app.sh"]

ENTRYPOINT ["/home/python/entrypoint.sh"]
# start server
EXPOSE 8020
STOPSIGNAL SIGTERM
