-include .env
include .env.default

BIN_DIR ?= node_modules/.bin

help:
	@echo
	@echo "  \033[34mserver\033[0m – start dev server"
	@echo "  \033[34mfrontend\033[0m – start webpack dev server"
	@echo "  \033[34mstart\033[0m – start server and frontend"
	@echo "  \033[34mbuild\033[0m – build the app"


server:
	@supervisor runner.js | /usr/local/bin/bunyan


frontend:
	@$(BIN_DIR)/webpack-dev-server --config ./webpack.config.js --port ${WEBPACK_PORT} --host ${WEBPACK_HOST} --hot


start:
	@$(MAKE) server & $(MAKE) frontend


build: export NODE_ENV = production
build:
	@webpack --config ./webpack.config.js --progress


.PHONY: help server frontend start build
