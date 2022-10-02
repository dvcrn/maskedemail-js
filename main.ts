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

// import wasm exec environment for Go
require("./wasm_exec.js");

import wasmMain from "./static/main.wasm";

export interface MaskedEmail {
  forDomain: string;
  createdAt: string;
  createdBy: string;
  email: string;
  id: string;
  lastMessageAt: string;
  state: "enabled" | "disabled";
}

export interface Session {
  capabilities: { [key: string]: object };
  accounts: {
    [key: string]: {
      name: string;
      accountCapabilities: any;
    };
  };
  primaryAccounts: Record<string, string>;
  apiUrl: string;
}

interface Mod {
  session: (token: string) => Promise<Session>;
  list: (token: string, accountId: string) => Promise<MaskedEmail[]>;
  create: (
    token: string,
    accountId: string,
    forDomain: string
  ) => Promise<MaskedEmail>;
  enable: (
    token: string,
    accountId: string,
    email: string
  ) => Promise<MaskedEmail>;
  disable: (
    token: string,
    accountId: string,
    emailId: string
  ) => Promise<MaskedEmail>;
  enableById: (
    token: string,
    accountId: string,
    email: string
  ) => Promise<MaskedEmail>;
  disableById: (
    token: string,
    accountId: string,
    emailId: string
  ) => Promise<MaskedEmail>;
}

const instantiatedPromise = new Promise<Mod>(async (resolve, reject) => {
  const go = new (globalThis as any).Go();
  const wasmObj = await wasmMain(go.importObject);
  go.run(wasmObj.instance);

  resolve({
    session: (globalThis as any)["maskedemailSession"],
    list: (globalThis as any)["maskedemailList"],
    create: (globalThis as any)["maskedemailCreate"],
    enable: (globalThis as any)["maskedemailEnable"],
    disable: (globalThis as any)["maskedemailDisable"],
    enableById: (globalThis as any)["maskedemailEnableById"],
    disableById: (globalThis as any)["maskedemailDisableById"],
  });
});

export const session = async (token: string) => {
  const mod = await instantiatedPromise;
  return mod.session(token);
};

export const list = async (token: string, accountId: string) => {
  const mod = await instantiatedPromise;
  return mod.list(token, accountId);
};

export const create = async (
  token: string,
  accountId: string,
  forDomain: string
) => {
  const mod = await instantiatedPromise;
  return mod.create(token, accountId, forDomain);
};

export const enable = async (token: string, accountId: string, email: string) => {
  const mod = await instantiatedPromise;
  return mod.enable(token, accountId, email);
};

export const disable = async (token: string, accountId: string, email: string) => {
  const mod = await instantiatedPromise;
  return mod.disable(token, accountId, email);
};

export const enableById = async (token: string, accountId: string, emailId: string) => {
  const mod = await instantiatedPromise;
  return mod.enableById(token, accountId, emailId);
};

export const disableById = async (token: string, accountId: string, emailId: string) => {
  const mod = await instantiatedPromise;
  return mod.disableById(token, accountId, emailId);
};

