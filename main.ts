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

export enum InitMode {
  Wasm = 'wasm',
  Gopherjs = 'gopherjs'
}

let initPromise: Promise<Mod>;

/**
 * Initializes MaskedEmail with the given mode
 * If mode is not specified, will attempt to use WASM
 * If WebAssembly is not defined, will automatically fallback ot the gopherjs version
 *
 * You don't need to care about the return value, subsequent function calls of this module
 * will bind to it
 *
 * @param      {InitMode}  [initMode=InitMode.Wasm]  The initialize mode, gopherjs or wasm
 * @return     {Promise}   Module with initialized functions
 */
export const init = async (initMode: InitMode = InitMode.Wasm) => {
  if (!initPromise) {
    initPromise = new Promise<Mod>(async (resolve, reject) => {
      if (initMode === InitMode.Wasm && globalThis.WebAssembly) {
        console.debug("wasm mode");
        require("./wasm_exec.js");

        const go = new (globalThis as any).Go();
        const wasmObj = await wasmMain(go.importObject);
        go.run(wasmObj.instance);
      } else {
        console.debug("gopherjs mode");
        require("./main.gopherjs.js");
        console.log("loaded gopherjs");
      }

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
  }

  return initPromise;
}

/**
 * Retrieves the session for the given token (if available)
 *
 * @param      {string}  token   FastMail API token
 * @return     {Promise<Session>}  Promise that resolves with users Session
 */
export const session = async (token: string): Promise<Session> => {
  const mod = await init();
  return mod.session(token);
};

/**
 * Retrieves a list of all MaskedEmails in the given account
 *
 * @param      {string}  token      FastMail API token
 * @param      {string}  accountId  FastMail Account ID
 * @return     {Promise<MaskedEmail[]>}  Promise that resolves with an array of masked emails
 */
export const list = async (token: string, accountId: string): Promise<MaskedEmail[]> => {
  const mod = await init();
  return mod.list(token, accountId);
};

/**
 * Creates a new MaskedEmail for the given domain
 * The return of this function is not a full MaskedEmail object, not all keys will be set.
 * If you need all keys, consider fetching again
 *
 * @param      {string}  token      FastMail API token
 * @param      {string}  accountId  FastMail Account ID
 * @param      {string}  forDomain  For which domain the email should get created
 * @return     {Promise<MaskedEmail>}  Promise that resolves with the created MaskedEmail
 */
export const create = async (
  token: string,
  accountId: string,
  forDomain: string
): Promise<MaskedEmail> => {
  const mod = await init();
  return mod.create(token, accountId, forDomain);
};

/**
 * Sets the given MaskedEmail to 'enabled'
 * Return value is not returning anything yet
 *
 * @param      {string}  token      FastMail API Token
 * @param      {string}  accountId  FastMail Account ID
 * @param      {string}  email      Full qualified email to update
 * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
 */
export const enable = async (token: string, accountId: string, email: string): Promise<MaskedEmail> => {
  const mod = await init();
  return mod.enable(token, accountId, email);
};

/**
 * Sets the given MaskedEmail to 'disabled'
 * Return value is not returning anything yet
 *
 * @param      {string}  token      FastMail API Token
 * @param      {string}  accountId  FastMail Account ID
 * @param      {string}  email      Full qualified email to update
 * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
 */
export const disable = async (token: string, accountId: string, email: string): Promise<MaskedEmail> => {
  const mod = await init();
  return mod.disable(token, accountId, email);
};

/**
 * Sets the given MaskedEmail by ID to 'enabled'
 * Return value is not returning anything yet
 *
 * @param      {string}  token      FastMail API Token
 * @param      {string}  accountId  FastMail Account ID
 * @param      {string}  emailId      Id of the masked email to update
 * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
 */
export const enableById = async (token: string, accountId: string, emailId: string): Promise<MaskedEmail> => {
  const mod = await init();
  return mod.enableById(token, accountId, emailId);
};

/**
 * Sets the given MaskedEmail to 'enabled'
 * Return value is not returning anything yet
 *
 * @param      {string}  token      FastMail API Token
 * @param      {string}  accountId  FastMail Account ID
 * @param      {string}  email      Id of the masked email to update
 * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
 */
export const disableById = async (token: string, accountId: string, emailId: string) => {
  const mod = await init();
  return mod.disableById(token, accountId, emailId);
};

