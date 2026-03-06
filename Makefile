# Scion Makefile
# Run 'make help' to see available targets.

BINARY      := scion
BUILD_DIR   := ./build
INSTALL_DIR := $(HOME)/.local/bin
MAIN_PKG    := ./cmd/scion
LDFLAGS     := $(shell ./hack/version.sh)

.DEFAULT_GOAL := help

.PHONY: all build install test test-fast vet lint web clean help

## all: Build the Go binary and the web frontend
all: install web

## build: Compile the scion binary into ./build/
build:
	@echo "Building $(BINARY)..."
	@mkdir -p $(BUILD_DIR)
	@go build -buildvcs=false -ldflags "$(LDFLAGS)" -o $(BUILD_DIR)/$(BINARY) $(MAIN_PKG)
	@echo "Binary: $(BUILD_DIR)/$(BINARY)"

## install: Build and install the binary to ~/.local/bin
install: build
	@echo "Installing $(BINARY) to $(INSTALL_DIR)..."
	@mkdir -p $(INSTALL_DIR)
	@install $(BUILD_DIR)/$(BINARY) $(INSTALL_DIR)/$(BINARY)
	@echo "Installed: $(INSTALL_DIR)/$(BINARY)"

## test: Run all tests
test:
	@echo "Running tests..."
	@go test ./...

## test-fast: Run tests without SQLite (lower memory usage)
test-fast:
	@echo "Running tests (no SQLite)..."
	@go test -tags no_sqlite ./...

## vet: Run go vet
vet:
	@go vet ./...

## lint: Run go vet (no SQLite, memory-safe)
lint:
	@go vet -tags no_sqlite ./...

## web: Build the web frontend
web:
	@echo "Building web frontend..."
	@cd web && npm install && npm run build
	@echo "Web frontend built."

## build-sciontool: Cross-compile sciontool for Linux (for dev-mounting into containers)
build-sciontool:
	@echo "Building sciontool for Linux..."
	@mkdir -p $(BUILD_DIR)
	@GOOS=linux GOARCH=$$(if [ "$$(uname -m)" = "x86_64" ]; then echo amd64; else echo arm64; fi) \
		CGO_ENABLED=0 go build -buildvcs=false -ldflags "$(LDFLAGS)" \
		-o $(BUILD_DIR)/sciontool-linux ./cmd/sciontool
	@echo "Binary: $(BUILD_DIR)/sciontool-linux"
	@echo "Usage:  export SCION_DEV_SCIONTOOL=$(BUILD_DIR)/sciontool-linux"

## clean: Remove build artifacts
clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR)
	@rm -f $(BINARY)
	@echo "Done."

## help: Show this help message
help:
	@echo "Usage: make [target]"
	@echo ""
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/^## /  /' | column -t -s ':'
