# FastMail maskedemail JS SDK

JavaScript wrapper / SDK for interacting with FastMail's MaskedEmail service

This is based off my [maskedemail-cli](https://github.com/dvcrn/maskedemail-cli)

## Install

```
yarn add maskedemail

-- or -- 

node i maskedemail
```

## Notes before using

Instead of implementing the API in JavaScript, this package compiles [maskedemail-cli](https://github.com/dvcrn/maskedemail-cli) to WASM, then executes that. The WASM is pretty unoptimized and rocks a whopping 7MB+ in file size :D 

Why?? Because I wanted to play around with WASM, and didn't want to duplicate the code again.

There is a [gopherjs](https://github.com/gopherjs/gopherjs) fallback if WebAssembly is not available. Both gopherjs and wasm builds are pretty chunky in file size so probably not a good idea to use this on the browser.

## Usage

Follow the "authentication" steps over at https://github.com/dvcrn/maskedemail-cli#authentication

```ts
import { list, create } from "maskedemail";

const token = "fastmailToken";
const accID = "fastmailAccID";

(async () => {
  const pr = await list(token, accID);
  console.log(pr);

  console.log("creating new");

  const created = await create(token, accID, "test.com");
  console.log(created);
})().catch((err) => {
  console.error(err);
});
```

### Using gopherjs mode instead

```ts
import { init, list, create } from "maskedemail";

const token = "fastmailToken";
const accID = "fastmailAccID";

(async () => {
  await init('gopherjs');
  const sess = await session(token);
  console.log(sess);
})().catch((err) => {
  console.error(err);
});
```


## Building

Requirements:

- gopherjs (https://github.com/gopherjs/gopherjs)
- rollup (`npm install --global rollup`)

Make sure to run `yarn` to install all the dependencies

Run `make build` to build both wasm and gopherjs variants, and bundle with rollup

## License

MIT
