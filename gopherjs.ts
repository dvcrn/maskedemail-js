import { load, Mod } from "./core";
import './shim';

let initPromise: Promise<Mod>;

/**
 * Initializes MaskedEmail with goherjs mode
 *
 * You don't need to care about the return value, subsequent function calls of this module
 * will bind to it
 *
 * @return     {Promise}   Module with initialized functions
 */
export const init = async (): Promise<Mod> => {
  if (!initPromise) {
    initPromise = new Promise<Mod>(async (resolve, reject) => {
      require("./main.gopherjs.js");

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

export * from './types';
const { session, list, create, enable, disable, enableById, disableById } = load(init);
export { session, list, create, enable, disable, enableById, disableById };

