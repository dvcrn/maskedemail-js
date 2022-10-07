import { load, Mod } from './core';
import './shim';
import wasmMain from "./static/main.wasm";


let initPromise: Promise<Mod>;

/**
 * Initializes MaskedEmail with WASM mode
 *
 * You don't need to care about the return value, subsequent function calls of this module
 * will bind to it
 *
 * @return     {Promise}   Module with initialized functions
 */
export const init = async (): Promise<Mod> => {
  if (!initPromise) {
    initPromise = new Promise<Mod>(async (resolve, reject) => {
      require("./wasm_exec.js");

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
  }

  return initPromise;
}

const { session, list, create, enable, disable, enableById, disableById } = load(init);
export { session, list, create, enable, disable, enableById, disableById };

