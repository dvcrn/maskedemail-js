declare module "*.wasm";

declare module "inline!*" {
  const inlineCode: string;
  export default inlineCode;
}
