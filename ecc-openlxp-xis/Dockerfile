# Dockerfile
FROM registry1.dso.mil/ironbank/opensource/python:v3.13
USER root

# Ensure "python" points to python3 (optional)
RUN if [ ! -e /usr/bin/python ]; then ln -s /usr/bin/python3 /usr/bin/python; fi

# install psql client
RUN dnf -y --nogpg install https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm && \
    dnf -qy module disable postgresql && \
    dnf install -y postgresql14-14.15 && \
    dnf clean all

USER python

WORKDIR /home/python
COPY --chown=python:python . .

RUN if [ ! -f /tmp/debug.log ]; then touch /tmp/debug.log ; fi
RUN chmod a=rwx /tmp/debug.log && \
# copy source and install dependencies
    mkdir -p /tmp/app && \
    mkdir -p /tmp/app/openlxp-xis

COPY --chown=python:python --chmod=755 requirements.txt start-server.sh start-app.sh /tmp/app/
COPY --chown=python:python .cache/python-packages /tmp/app/.cache/python-packages/
ENV PYTHONPATH /tmp/app/.cache/python-packages
ENV PATH $PATH:/tmp/app/.cache/python-packages/bin

# apply permissions to start-server.sh/start-app.sh
# USER root
# RUN chmod +x /tmp/app/start-server.sh
# RUN chmod +x /tmp/app/start-app.sh
# USER python

COPY ./app /tmp/app/openlxp-xis/
WORKDIR /tmp/app/openlxp-xis/

# Remove unecessary python test files for twistlock scan
RUN rm -rf /home/python/.cache/python-packages/future/backports/test/badcert.pem \
/home/python/.cache/python-packages/future/backports/test/badkey.pem \
/home/python/.cache/python-packages/future/backports/test/keycert.passwd.pem \
/home/python/.cache/python-packages/future/backports/test/keycert.pem \
/home/python/.cache/python-packages/future/backports/test/keycert2.pem \
/home/python/.cache/python-packages/future/backports/test/ssl_key.passwd.pem \
/home/python/.cache/python-packages/future/backports/test/ssl_key.pem \
/home/python/.cache/python-packages/tornado/test/test.key \
/home/python/.cache/python-packages/social_core/tests/testkey.pem \
/tmp/app/.cache/python-packages/future/backports/test/badcert.pem \
/tmp/app/.cache/python-packages/future/backports/test/badkey.pem \
/tmp/app/.cache/python-packages/future/backports/test/keycert.passwd.pem \
/tmp/app/.cache/python-packages/future/backports/test/keycert.pem \
/tmp/app/.cache/python-packages/future/backports/test/keycert2.pem \
/tmp/app/.cache/python-packages/future/backports/test/ssl_key.passwd.pem \
/tmp/app/.cache/python-packages/future/backports/test/ssl_key.pem \
/tmp/app/.cache/python-packages/social_core/tests/testkey.pem

# RUN python -m pip uninstall -y pip && \
#     dnf remove -y pip

# start server
EXPOSE 8020
STOPSIGNAL SIGTERM
