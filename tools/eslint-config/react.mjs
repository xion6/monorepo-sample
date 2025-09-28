import baseConfig from "./base.mjs";
import pluginReact from "eslint-plugin-react";
import globals from "globals";

// baseConfigを継承し、Reactとブラウザ固有の設定を追加
export default [
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];