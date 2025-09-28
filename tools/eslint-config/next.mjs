import { FlatCompat } from "@eslint/eslintrc";
import reactConfig from "./react.mjs";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

// react.mjsをベースに、Next.jsのルールをFlatCompatを使って追加
export default [
  ...reactConfig,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Next.jsプロジェクト固有のignoreファイルなどをここに追加
    ignores: ["next-env.d.ts"],
  },
];
