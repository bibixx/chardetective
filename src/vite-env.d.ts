/// <reference types="vite/client" />

declare module "iconv-lite/encodings" {
  const encodings: { [key: string]: string | { type: "string" } };
  export default encodings;
}
