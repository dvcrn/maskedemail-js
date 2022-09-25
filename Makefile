.PHONY: build
build:
	GOOS=js GOARCH=wasm go build -ldflags="-s -w" -o static/main.wasm .
	rm -rf lib/
	rollup -c rollup.config.js
