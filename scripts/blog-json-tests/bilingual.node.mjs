import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  readAllJsonBlogArticles,
  validateJsonArticle,
  validateMergedBlogArticles,
} from "../../src/lib/blog/json-source.mjs";
const records = readAllJsonBlogArticles();
const pairs = [
  [
    "guide-premier-emploi-developpeur",
    "first-developer-job-guide",
    "first-developer-job-guide",
  ],
  [
    "internationaliser-saas-lancement",
    "internationalize-saas-at-launch",
    "saas-internationalization-launch",
  ],
];
function allBlocks(article) {
  const result = [];
  function visit(blocks) {
    for (const b of blocks) {
      result.push(b);
      if (b.blocks) visit(b.blocks);
      for (const item of b.items ?? []) if (item.blocks) visit(item.blocks);
    }
  }
  visit([
    ...(article.introBlocks ?? []),
    ...article.sections.flatMap((s) => s.blocks),
    ...(article.afterBlocks ?? []),
  ]);
  return result;
}
test("deux traductions complètes : paires, structure, liens locaux et cinq widgets partagés", () => {
  assert.doesNotThrow(() => validateMergedBlogArticles(records));
  for (const [frSlug, enSlug, key] of pairs) {
    const fr = records.find(
      (r) => r.metadata.locale === "fr" && r.metadata.slug === frSlug,
    ).data;
    const en = records.find(
      (r) => r.metadata.locale === "en" && r.metadata.slug === enSlug,
    ).data;
    assert.equal(en.meta.status, "published");
    assert.equal(en.meta.translationKey, key);
    assert.equal(fr.meta.translationKey, key);
    assert.notEqual(en.meta.title, fr.meta.title);
    assert.notEqual(en.meta.description, fr.meta.description);
    assert.deepEqual(
      en.sections.map((s) => s.id),
      fr.sections.map((s) => s.id),
    );
    assert.deepEqual(
      allBlocks(en).map((b) => b.type),
      allBlocks(fr).map((b) => b.type),
    );
    const result = validateJsonArticle(en);
    assert.ok(result.links.every((href) => !href.startsWith("/fr")));
    assert.ok(en.sections.every((s, i) => s.title !== fr.sections[i].title));
    assert.deepEqual(
      allBlocks(en)
        .filter((b) => b.type === "custom")
        .map((b) => b.component),
      allBlocks(fr)
        .filter((b) => b.type === "custom")
        .map((b) => b.component),
    );
  }
  const messages = ["fr", "en"].map(
    (locale) =>
      JSON.parse(readFileSync(`src/i18n/messages/${locale}.json`, "utf8"))
        .blogSaas,
  );
  assert.deepEqual(
    Object.keys(messages[0]).sort(),
    Object.keys(messages[1]).sort(),
  );
  for (const key of [
    "demoTitle",
    "matrixCaption",
    "questionCapacity",
    "adviceInternationalTitle",
    "decisionPending",
  ])
    assert.notEqual(messages[0][key], messages[1][key]);
});
test("seule la paire canonique du guide partage les 14 cases et la clé historique", () => {
  const guide = records.filter(
    (r) => r.metadata.translationKey === "first-developer-job-guide",
  );
  assert.equal(guide.length, 2);
  const lists = guide.map((r) =>
    allBlocks(r.data).find((b) => b.type === "checklist"),
  );
  assert.equal(lists[0].storageKey, "vd_guide_checklist_v1");
  assert.equal(lists[1].storageKey, lists[0].storageKey);
  assert.deepEqual(
    lists[0].items.map((i) => i.id),
    lists[1].items.map((i) => i.id),
  );
  assert.equal(lists[0].items.length, 14);
  assert.doesNotThrow(() => validateMergedBlogArticles(records));
  const english = structuredClone(
    guide.find((r) => r.metadata.locale === "en").data,
  );
  english.meta.translationKey = "unrelated-article";
  assert.throws(() => validateJsonArticle(english), /clé historique/);
  english.meta.translationKey = "first-developer-job-guide";
  allBlocks(english).find((b) => b.type === "checklist").items[0].id =
    "another-action";
  assert.throws(() => validateJsonArticle(english), /14 IDs/);
  const unrelatedShared = guide.map((r) => ({
    ...r,
    storageKeys: ["vd_unrelated_shared_key"],
  }));
  assert.throws(
    () => validateMergedBlogArticles(unrelatedShared),
    /clé de stockage déjà publiée/,
  );
});
