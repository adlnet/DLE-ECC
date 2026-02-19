# FROM registry1.dso.mil/ironbank/opensource/clamav/clamav:1.2.1 AS clamav
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

# add clamav
# COPY --from=clamav /usr/local/bin/clamdscan /usr/local/bin/clamdscan

# COPY --from=clamav /usr/local/lib64/libclam* /usr/local/lib64/

# COPY --from=clamav /usr/local/lib/pkgconfig/libclamav.pc /usr/local/lib/pkgconfig/libclamav.pc
# COPY --from=clamav /usr/local/lib/libclamav.so.9.1.0 /usr/local/lib/libclamav.so.9.1.0
# COPY --from=clamav /usr/local/lib/libclamav.so /usr/local/lib/libclamav.so
# COPY --from=clamav /usr/local/lib/libclamav.so.9 /usr/local/lib/libclamav.so.9
# COPY --from=clamav /usr/local/lib/libclammspack.so.0 /usr/local/lib/libclammspack.so.0
# COPY --from=clamav /usr/local/lib/libclammspack.so /usr/local/lib/libclammspack.so
# COPY --from=clamav /usr/local/lib/libclammspack.so.0.8.0 /usr/local/lib/libclammspack.so.0.8.0

WORKDIR /home/python
COPY --chown=python:python . .

RUN if [ ! -f /tmp/debug.log ]; then touch /tmp/debug.log ; fi && \
    chmod a=rwx /tmp/debug.log && \
# copy source and install dependencies
    mkdir -p /tmp/app && \
    mkdir -p /tmp/app/openlxp-xss

COPY --chmod=755 requirements.txt start-server.sh start-app.sh /tmp/app/
COPY --chown=python:python .cache/python-packages /tmp/app/.cache/python-packages/
ENV PYTHONPATH /tmp/app/.cache/python-packages
ENV PATH $PATH:/tmp/app/.cache/python-packages/bin

# apply permissions to start-server.sh/start-app.sh
# USER root
# RUN chmod +x /tmp/app/start-server.sh
# RUN chmod +x /tmp/app/start-app.sh
# USER python

COPY ./app /tmp/app/openlxp-xss/
WORKDIR /tmp/app/openlxp-xss/

RUN rm -rf /home/python/.cache/python-packages/social_core/tests/testkey.pem \
            /tmp/app/.cache/python-packages/social_core/tests/testkey.pem

# start server
EXPOSE 8020
STOPSIGNAL SIGTERM
