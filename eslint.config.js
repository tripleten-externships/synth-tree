// Shared ESLint flat-config for the Synth Tree monorepo.
// Apps and packages can either consume this config directly or extend it
// with framework-specific rules (e.g. react-hooks for the frontends).
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // Files we never want to lint.
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/build",
      "**/cdk.out",
      "**/storybook-static",
      "**/__generated__",
      "**/coverage",
      "**/*.d.ts",
      "pnpm-lock.yaml",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Project-wide rules and language options.
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      // We rely on TypeScript for unused-variable checking; ESLint's version
      // is noisy in some monorepo edge cases. Allow leading-underscore opt-out.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // Allow `any` only with intent — warn, don't error.
      "@typescript-eslint/no-explicit-any": "warn",
      // React 17+ JSX transform — `React` import isn't required.
      "no-undef": "off",
    },
  },
);
