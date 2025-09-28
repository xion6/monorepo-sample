import baseConfig from "./base.mjs";
import globals from "globals";

// baseConfigを継承し、Node.js固有の設定を追加
export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
