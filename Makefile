.PHONY: generate-gopherjs
generate-gopherjs:
	rm -rf cmd/gopherjs
	mkdir -p cmd/gopherjs
	cp main.go cmd/gopherjs/
	sed -i '' 's/syscall\/js/github\.com\/gopherjs\/gopherjs\/js/g' cmd/gopherjs/main.go
	sed -i '' 's/FuncOf/MakeFunc/g' cmd/gopherjs/main.go
	sed -i '' 's/js\.Value/\*js\.Object/g' cmd/gopherjs/main.go
	sed -i '' 's/js\.Global()/js\.Global/g' cmd/gopherjs/main.go

.PHONY: build-wasm
build-wasm:
	GOOS=js GOARCH=wasm go build -ldflags="-s -w" -o static/main.wasm .

.PHONY: build-gopherjs
build-gopherjs:
	cd cmd/gopherjs
	gopherjs build -o static/main.gopherjs.js

.PHONY: rollup
rollup:
	rm -rf lib/
	rollup -c rollup.config.mjs

build: generate-gopherjs build-wasm build-gopherjs rollup

