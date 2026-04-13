import js from "@eslint/js";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";
import nodePlugin from "eslint-plugin-n";
import importPlugin from "eslint-plugin-import-x";

export default tseslint.defineConfig(
  // ── Base ────────────────────────────────────────────────
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // ── Global settings ─────────────────────────────────────
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ── Security rules ──────────────────────────────────────
  security.configs.recommended,
  {
    plugins: {
      security,
      n: nodePlugin,
      import: importPlugin,
    },

    rules: {
      // --- Auth & Timing (critical for social media auth flows) ---
      "security/detect-possible-timing-attacks": "error", // no === on tokens/passwords
      "security/detect-pseudorandomness": "error", // no Math.random() for tokens

      // --- Injection & Prototype Pollution ---
      "security/detect-object-injection": "error", // req.body[field] risks
      "security/detect-non-literal-regexp": "error", // ReDoS via user input
      "security/detect-non-literal-fs-filename": "error", // path traversal
      "security/detect-new-buffer": "error", // unsafe Buffer()

      // --- Code Execution ---
      "security/detect-eval-with-expression": "error",
      "security/detect-child-process": "warn",
      "security/detect-unsafe-regex": "error",

      // --- TypeScript strict rules ---
      "@typescript-eslint/no-explicit-any": "error", // any kills type safety
      "@typescript-eslint/explicit-function-return-type": "error", // forces typed returns
      "@typescript-eslint/no-floating-promises": "error", // unhandled async = silent failures
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/strict-null-checks": "error", // no silent nulls
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",

      // --- Social media specific: input handling ---
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error", // new Function() = eval in disguise
      "no-param-reassign": "error", // prevent mutation of req/res params
      "no-console": "warn", // no console.log leaking sensitive data
      "no-debugger": "error",

      // --- Node.js / Express best practices ---
      "n/no-process-env": "warn", // centralize env access, don't scatter process.env
      "n/no-sync": "error", // no sync fs calls blocking event loop
      "n/handle-callback-err": "error", // no swallowed errors in callbacks

      // --- Import hygiene ---
      "import/no-extraneous-dependencies": "error", // no undeclared deps (supply chain)
      "import/no-cycle": "error", // circular deps cause subtle auth bugs
      "import/no-mutable-exports": "error",
    },
  },

  // ── Relax some rules in test files ──────────────────────
  {
    files: ["**/*.test.ts", "**/*.spec.ts", "tests/**/*.ts"],
    rules: {
      "security/detect-object-injection": "warn", // test mocks use dynamic keys
      "@typescript-eslint/no-explicit-any": "warn", // mocks often need any
      "n/no-process-env": "off", // test env setup is fine
      "no-console": "off",
    },
  },

  // ── Ignore build output ──────────────────────────────────
  {
    ignores: ["dist/**", "node_modules/**"],
  },
);
