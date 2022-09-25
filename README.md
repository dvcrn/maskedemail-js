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

This is functional but in no way performant. Instead of implementing the API in JavaScript, this package compiles [maskedemail-cli](https://github.com/dvcrn/maskedemail-cli) to WASM, then executes that. The WASM is pretty unoptimized and rocks a whopping 7MB+ in file size :D 

Why?? Because I wanted to play around with WASM, and didn't want to duplicate the code again.

If you don't care about the file size and potential dragons on the way, then have fun using!

## Usage 

Follow the "authentication" steps over at https://github.com/dvcrn/maskedemail-cli#authentication

```
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

## Building

Run `make build` to build the WASM file and run rollup to compile the TypeScript


## License

MIT