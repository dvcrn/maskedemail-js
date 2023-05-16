import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import wasm from "@rollup/plugin-wasm";
import copy from "rollup-plugin-copy";


const config = ['main', 'wasm', 'gopherjs'].map((name) => ({
  input: `${name}.ts`,
  output: [
    {
      file: `lib/${name}.cjs.js`,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: `lib/${name}.esm.js`,
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    commonjs(),
    wasm({
      sync: ["main.wasm"],
      targetEnv: "auto",
      maxFileSize: 0,
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
      targets: [
        { src: "static/wasm_exec.js", dest: "lib/" },
        { src: "static/main.gopherjs.js", dest: "lib/" },
        { src: "static/main.gopherjs.js.map", dest: "lib/" },
      ],
    }),
  ],
}));

export default config;
