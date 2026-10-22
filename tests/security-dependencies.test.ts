import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const braces = require("braces");
const selectorParser = require("postcss-selector-parser");

const nestedPattern = (depth: number) =>
  `${"{".repeat(depth)}x${"}".repeat(depth)}`;

const nestedAst = (depth: number) => {
  let node: { type: string; value?: string; nodes?: unknown[] } = {
    type: "text",
    value: "x",
  };

  for (let level = 0; level < depth; level++) {
    node = { type: "brace", nodes: [node] };
  }

  return { type: "root", nodes: [node] };
};

describe("dependency security backports", () => {
  it("keeps normal brace expansion and caps recursive depth at 100", () => {
    expect(braces.expand("src/{app,features}/**/*.{ts,tsx}")).toEqual([
      "src/app/**/*.ts",
      "src/app/**/*.tsx",
      "src/features/**/*.ts",
      "src/features/**/*.tsx",
    ]);

    expect(() => braces.parse(nestedPattern(100))).not.toThrow();
    expect(() => braces.parse(nestedPattern(101))).toThrow(/max depth \(100\)/);
  });

  it("bounds recursion when callers provide a prebuilt AST", () => {
    const ast = nestedAst(101);

    expect(() => braces.compile(ast)).toThrow(/max depth/);
    expect(() => braces.expand(ast)).toThrow(/max depth/);
    expect(() => braces.stringify(ast)).toThrow(/max depth/);
  });

  it("uses the patched selector parser for large flat selectors", () => {
    expect(require("postcss-selector-parser/package.json").version).toBe(
      "7.1.7",
    );

    const selector = Array.from(
      { length: 2_000 },
      (_, index) => `.c${index}`,
    ).join("");
    expect(selectorParser().astSync(selector).nodes[0].nodes).toHaveLength(
      2_000,
    );
  });
});
