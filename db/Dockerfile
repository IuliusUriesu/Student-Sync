FROM mysql:8.0.36

COPY ./user-setup.sql /docker-entrypoint-initdb.d/

COPY ./student-manager-app-dump.sql /docker-entrypoint-initdb.d/