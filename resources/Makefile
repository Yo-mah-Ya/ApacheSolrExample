.PHONY: rmc
.PHONY: rmi

exec:
	$(call blue, "exec solr bash")
	@docker container exec -it solr bash
setup:
	$(call blue, "setup Solr core")
	@./setup.sh
rmc:
	$(call blue , "Remove All Docker Containers")
	@docker container ps -aq | xargs docker container rm -f
rmi:
	$(call blue , "Remove All Docker Images")
	@docker image ls -aq | xargs docker image rm -f
showi:
	$(call blue , "Show All Docker Images")
	@docker image ls -aq
showc:
	$(call blue , "Show All Docker Containers")
	@docker container ps -aq

define blue
	@tput setaf 6 && echo $1 && tput sgr0
endef
