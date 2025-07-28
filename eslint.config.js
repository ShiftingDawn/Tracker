import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import { fileURLToPath } from "node:url";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";
import stylistic from "@stylistic/eslint-plugin";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {globals: { ...globals.browser, ...globals.node, },},
    rules: { // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
      // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      "no-undef": "off",
    },
  },
  {
    files: [
      "**/*.svelte",
      "**/*.svelte.ts",
      "**/*.svelte.js",
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte",],
        parser: ts.parser,
        svelteConfig,
      },
    },
  },
  {
    plugins: {"@stylistic": stylistic,},
    rules: {
      "@stylistic/max-len": ["error", {"code": 160, "ignoreComments": true, "ignoreUrls": true, "ignoreStrings": true,},],
      "@stylistic/indent": ["error", 2,],
      "@stylistic/indent-binary-ops": ["error", 2,],
      "@stylistic/quotes": ["error", "double",],
      "@stylistic/comma-dangle": ["error", { "arrays": "always", "objects": "always", "imports": "never", "exports": "never", "functions": "never", "importAttributes": "never", "dynamicImports": "never", "enums": "always", "generics": "never", "tuples": "always",},],
      "@stylistic/object-curly-newline": ["error", { "multiline": true, },],
      "@stylistic/newline-per-chained-call": ["error", { "ignoreChainWithDepth": 5,},],
      "@stylistic/eol-last": ["error", "always",],
      "@stylistic/space-before-blocks": ["error", { "functions": "always", "keywords": "always", "classes": "always", "modules": "always", },],
      "@stylistic/semi-spacing": ["error", {"before": false, "after": true,},],
      "@stylistic/no-whitespace-before-property": ["error",],
      "@stylistic/no-multi-spaces": ["error",],
      "@stylistic/no-trailing-spaces": ["error",],
      "@stylistic/no-multiple-empty-lines": ["error", {"max": 1,},],
      "@stylistic/nonblock-statement-body-position": ["error", "beside",],
      "@stylistic/object-property-newline": ["error", { "allowAllPropertiesOnSameLine": true, },],
      "@stylistic/semi": ["error", "always",],
    },
  }
);
