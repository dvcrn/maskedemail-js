if (!globalThis.crypto) {
  const crypto = require("crypto");
  globalThis.crypto = crypto as any;
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

interface Mod {
  list: (token: string, accountId: string) => Promise<MaskedEmail[]>;
  create: (
    token: string,
    accountId: string,
    forDomain: string
  ) => Promise<MaskedEmail>;
}

const instantiatedPromise = new Promise<Mod>(async (resolve, reject) => {
  const go = new (globalThis as any).Go();
  const wasmObj = await wasmMain(go.importObject);
  go.run(wasmObj.instance);

  resolve({
    list: (globalThis as any)["maskedemailList"],
    create: (globalThis as any)["maskedemailCreate"],
  });
});

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
