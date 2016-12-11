BUILD_DIST ?= build
BUILD_TARGET ?= src/
BUILD_FLAGS ?= --out-dir $(BUILD_DIST)

TEST_TARGET ?= tests/
TEST_FLAGS ?= --require babel-register

include node_modules/@mathieudutour/js-fatigue/Makefile
