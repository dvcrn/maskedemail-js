import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import wasm from "@rollup/plugin-wasm";
import copy from "rollup-plugin-copy";

const config = {
  input: "main.ts",
  output: [
    {
      file: "lib/main.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "lib/main.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    commonjs(),
    wasm({
      targetEnv: "auto",
    }),
    nodeResolve(),
    typescript({
      tsconfigOverride: {
        exclude: ["*.test.ts"],
        compilerOptions: {
          module: "esnext",
        },
      },
    }),
    json(),
    copy({
      targets: [{ src: "static/wasm_exec.js", dest: "lib/" }],
    }),
  ],
};

export default config;
