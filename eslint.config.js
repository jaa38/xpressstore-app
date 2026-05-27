const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    languageOptions: {
      parser: tsParser,

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },

        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-native": reactNativePlugin,
    },

    rules: {
      semi: ["error", "always"],

      quotes: ["error", "double"],

      "react/react-in-jsx-scope": "off",

      "react-native/no-inline-styles": "off",
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },
];