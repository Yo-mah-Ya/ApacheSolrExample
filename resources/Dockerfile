FROM solr:8.9.0

COPY films /opt/solr/server/solr/configsets/films
USER root
RUN chown -R solr:solr /opt/solr/server/solr/configsets/films
USER solr
CMD ["solr", "-f"]
