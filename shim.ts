//@ts-ignore
import atob from "atob";
//@ts-ignore
import getRandomValues from "polyfill-crypto.getrandomvalues";
//@ts-ignore
import te from "text-encoding-polyfill";

if (!globalThis.atob) {
  globalThis.atob = atob;
}

if (!globalThis.crypto) {
  //@ts-ignore
  globalThis.crypto = {
    getRandomValues,
  };
}

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = te.TextEncoder;
  globalThis.TextDecoder = te.TextDecoder;
}
