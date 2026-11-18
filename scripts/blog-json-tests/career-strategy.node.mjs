import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateJsonArticle } from "../../src/lib/blog/json-source.mjs";
const read = (locale, slug) =>
  JSON.parse(
    readFileSync(
      new URL(
        `../../src/content/blog-json/${locale}/${slug}.json`,
        import.meta.url,
      ),
      "utf8",
    ),
  );
for (const [locale, slug] of [
  ["fr", "ia-emplois-intellectuels-preparer-avenir"],
  ["en", "ai-knowledge-work-jobs-prepare-future"],
]) {
  test(`career strategy ${locale}: native JSON module accepts zero props, rejects duplicate and arbitrary props`, () => {
    const article = read(locale, slug);
    assert.doesNotThrow(() => validateJsonArticle(article));
    const section = article.sections.find((s) => s.id === "outil-strategie");
    assert.equal(
      section.blocks.filter(
        (b) =>
          b.type === "custom" && b.component === "career-strategy-assistant",
      ).length,
      1,
    );
    section.blocks.push({
      type: "custom",
      component: "career-strategy-assistant",
    });
    assert.throws(() => validateJsonArticle(article), /dupliqué/);
    section.blocks.pop();
    section.blocks.at(-1).props = { script: "arbitrary" };
    assert.throws(() => validateJsonArticle(article), /champ inconnu/);
  });
}
