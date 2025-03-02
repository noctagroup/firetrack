import * as compat from "@eslint/compat"
import eslint from "@eslint/js"
import node from "eslint-plugin-n"
import path from "node:path"
import prettier from "eslint-plugin-prettier/recommended"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import sort from "eslint-plugin-simple-import-sort"
import pimport from "eslint-plugin-import"
import tseslint from "typescript-eslint"
import query from "@tanstack/eslint-plugin-query"
import pkg from "./package.json" with { type: "json" }

const rootdir = import.meta.dirname
const gitignore = path.join(rootdir, ".gitignore")

export default tseslint.config(
  compat.includeIgnoreFile(gitignore),

  eslint.configs.recommended,

  {
    ...pimport.flatConfigs.recommended,
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  tseslint.configs.strict.map((config) => {
    config.files = ["**/*.{ts,tsx}"]

    return config
  }),

  {
    ...react.configs.flat.recommended,
    files: ["**/*.{ts,tsx}"],
    settings: {
      react: {
        version: pkg.dependencies.react,
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
      },
    },
  },

  {
    ...react.configs.flat["jsx-runtime"],
    files: ["**/*.{ts,tsx}"],
  },

  {
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "simple-import-sort": sort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  {
    ...node.configs["flat/recommended"],
    files: ["*.{js,cjs}", "mock/**/*.{js,cjs}"],
    languageOptions: {
      ...node.configs["flat/recommended"].languageOptions,
      ecmaVersion: "latest",
    },
    rules: {
      ...node.configs["flat/recommended"].rules,
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  ...query.configs["flat/recommended"],

  prettier
)
