PROJECT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
UID := $(shell id -u)
GID := $(shell id -g)
DOCKER_COMPOSE?=docker-compose
EXEC_NODE=docker container run --rm -it -u ${UID}:${GID} -v ${PROJECT_DIR}:/app -w /app node:12-alpine
EXEC_YARN=$(EXEC_NODE) yarn

.PHONY: help
help:
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

##
##Utilities
##---------------------------------------------------------------------------
.PHONY: node yarn yi yu watch composer ci cu console cc
node:									## execute a node command
	$(EXEC_NODE) $(c)
yarn: 									## launch an ephemeral node container for executing yarn with arbitrary args c="<args>"
	$(EXEC_YARN) $(c)
yi:										## yarn install
	$(EXEC_YARN) install
yu:										## yarn upgrade
	$(EXEC_YARN) upgrade
watch:									## yarn watch
	$(EXEC_YARN) watch

##
##Setups
##---------------------------------------------------------------------------
.PHONY: start stop up down assets
start:										## start stopped containers
	$(DOCKER_COMPOSE) start
stop:										## stop
	$(DOCKER_COMPOSE) stop
up: 										## launch all containers
	$(DOCKER_COMPOSE) up -d
down: 										## destroy all containers (without volumes)
	$(DOCKER_COMPOSE) down
assets: public/build						## shortcut for building assets public/build

node_modules: yarn.lock
	$(MAKE) yi
	@touch -c node_modules
yarn.lock: package.json
	$(MAKE) yu
public/build: node_modules
	$(EXEC_YARN) dev
