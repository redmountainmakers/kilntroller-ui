ESLINT      ?= node node_modules/.bin/eslint
ESLINT_ARGS ?= .eslintrc.js *.js app/ test/ --ext js,jsx

build:
	@echo TODO

lint:
	@$(ESLINT) $(ESLINT_ARGS)

lint-fix:
	@$(ESLINT) $(ESLINT_ARGS) --fix

run:
	@node server.js
