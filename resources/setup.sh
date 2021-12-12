#!/usr/bin/env bash

SOURCE_DIR=$(cd $(dirname ${BASH_SOURCE:-$0}) && pwd)
DOCKER_IMAGE="solr_example:latest"
DOCKER_CONTAINER_NAME="solr"

SOLR_USER="8983:8983"
SOLR_CONF_DIR="${SOURCE_DIR}/solrdata"
SOLR_CORE="films"
SOLR_CORE_CONF="films"

# "solr-precreate" command implemented in "/opt/docker-solr/scripts", and another script also
# "solr-precreate" copys "/opt/solr/server/solr/configsets/_defaults" to "/var/solr/data/<core_name>/conf"
# and create its core

docker image build -t ${DOCKER_IMAGE} .
docker container run -d -p 8983:8983 --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE}
docker container exec -it --user=solr ${DOCKER_CONTAINER_NAME} \
	solr create_core -c ${SOLR_CORE} -d ${SOLR_CORE_CONF}
