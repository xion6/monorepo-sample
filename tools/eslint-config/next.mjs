import baseConfig from "./base.mjs";
import nextConfig from "eslint-config-next";

// base.mjsの末尾にはprettierのコンフィグが配置されている
// nextのコンフィグはprettierの前に追加する必要がある
const base = baseConfig.slice(0, -1);
const prettier = baseConfig.at(-1);

/**
 * Next.jsプロジェクト向けのESLint設定
 *
 * @type {import('eslint').Linter.FlatConfig[]}
 * @see https://nextjs.org/docs/app/building-your-application/configuring/eslint
 */
export default [
  ...base,
  // Next.jsの推奨ルールを適用
  // @see https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js
  nextConfig,
  prettier,
];
