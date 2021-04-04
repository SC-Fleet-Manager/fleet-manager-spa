PROJECT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
USER_ID ?= $(shell id -u)
GROUP_ID ?= $(shell id -g)
DOCKER_COMPOSE?=docker-compose
EXEC_NODE=docker container run --rm -it -u ${USER_ID}:${GROUP_ID} -v ${PROJECT_DIR}:/app -w /app node:14-alpine
EXEC_YARN=$(EXEC_NODE) yarn

.PHONY: help
help:
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

##
##Utilities
##---------------------------------------------------------------------------
.PHONY: node yarn yi yu watch build
node:									## execute a node command
	$(EXEC_NODE) $(c)
yarn: 									## executes yarn with arbitrary args c="<args>"
	$(EXEC_YARN) $(c)
yi:									## yarn install
	$(EXEC_YARN) install
yu:									## yarn upgrade
	$(EXEC_YARN) upgrade
watch:									## yarn watch
	$(EXEC_YARN) watch
build:									## yarn build
	$(EXEC_YARN) build

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
