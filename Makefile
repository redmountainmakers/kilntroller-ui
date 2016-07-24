ESLINT      ?= node node_modules/.bin/eslint
ESLINT_ARGS ?= .eslintrc.js *.js app/ test/ --ext js,jsx
WEBPACK     ?= node node_modules/.bin/webpack

build:
	@NODE_ENV=production $(WEBPACK)

build-dev:
	@$(WEBPACK)

lint:
	@$(ESLINT) $(ESLINT_ARGS)

lint-fix:
	@$(ESLINT) $(ESLINT_ARGS) --fix

run:
	@node server.js

test:
	@node node_modules/.bin/mocha

.PHONY: build build-dev lint lint-fix run test
