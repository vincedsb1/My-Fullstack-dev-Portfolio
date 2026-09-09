import js from "@eslint/js";
import next from "eslint-config-next";
import prettierRecommended from "eslint-plugin-prettier/recommended";

// Flat config (ESLint 9). Replaces the former .eslintrc.json: `next lint` was
// removed in Next.js 16 and ESLint 9 no longer loads the eslintrc format.
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "vincent.desbrosses.net-audit/**",
    ],
  },
  js.configs.recommended,
  ...next,
  prettierRecommended,
  {
    // TypeScript already resolves identifiers and types; the base rule reports
    // false positives on JSX/React globals and type-only names.
    files: ["**/*.ts", "**/*.tsx"],
    rules: { "no-undef": "off" },
  },
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
      "react/jsx-filename-extension": [
        1,
        { extensions: [".js", ".jsx", ".tsx"] },
      ],
      "react/require-default-props": "off",
    },
  },
];

export default config;
