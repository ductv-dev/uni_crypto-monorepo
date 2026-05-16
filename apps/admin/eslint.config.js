import { nextJsConfig } from "@workspace/eslint-config/next-js"
import tseslint from "typescript-eslint"

/** @type {import("eslint").Linter.Config} */
export default tseslint.config(
  {
    ignores: ["eslint.config.js"],
  },
  ...nextJsConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
)
