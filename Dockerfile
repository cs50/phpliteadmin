FROM cs50/cli
EXPOSE 8080 8081

ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
        coreutils mktemp php5-sqlite pwgen sqlite3
