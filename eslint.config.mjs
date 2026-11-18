import { designTokensRule } from "./scripts/eslint/design-tokens.mjs";
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
      "vendor/**",
      "next-env.d.ts",
      // ESM TypeScript declaration; ESLint treats .d.mts as JavaScript here.
      "src/lib/blog/json-source.d.mts",
      "vincent.desbrosses.net-audit/**",
      // Archived blog deliveries retained as references, not app source.
      "docs/blog/blog_design_system_showcase_etape2/**",
      "docs/blog/blog_etape3_moteur_json/**",
    ],
  },
  js.configs.recommended,
  ...next,
  prettierRecommended,
  {
    files: ["src/**/*.tsx"],
    ignores: [
      "src/features/projects/illustrations/**",
      "src/features/projects/IconiseLandingProductFigure.tsx",
    ],
    plugins: { design: { rules: { tokens: designTokensRule } } },
    rules: { "design/tokens": "warn" },
  },
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
