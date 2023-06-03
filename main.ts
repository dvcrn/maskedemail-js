import { load, Mod } from "./core";
import "./shim";
import wasmMain from "./static/main.wasm";

export enum InitMode {
  Wasm = "wasm",
  Gopherjs = "gopherjs",
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
export const init = async (initMode: InitMode = InitMode.Wasm): Promise<Mod> => {
  if (!initPromise) {
    initPromise = new Promise<Mod>(async (resolve, reject) => {
      if (initMode === InitMode.Wasm && globalThis.WebAssembly) {
        require("./wasm_exec.js");

        const go = new (globalThis as any).Go();
        const wasmObj = await wasmMain(go.importObject);
        go.run(wasmObj.instance);
      } else {
        require("./main.gopherjs.js");
      }

      resolve({
        session: (globalThis as any)["maskedemailSession"],
        list: (globalThis as any)["maskedemailList"],
        create: (globalThis as any)["maskedemailCreate"],
        enable: (globalThis as any)["maskedemailEnable"],
        disable: (globalThis as any)["maskedemailDisable"],
      });
    });
  }

  return initPromise;
};

export * from "./types";
const { session, list, create, enable, disable } = load(init);
export { session, list, create, enable, disable };
