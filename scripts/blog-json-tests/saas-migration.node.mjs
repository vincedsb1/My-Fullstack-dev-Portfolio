import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateJsonArticle } from "../../src/lib/blog/json-source.mjs";

const read = (p) =>
  readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const baseline = JSON.parse(
  read("docs/blog/contracts/internationaliser-saas-v1.json"),
);
const slug = "internationaliser-saas-lancement";
const article = JSON.parse(read(`src/content/blog-json/fr/${slug}.json`));

// Référence issue du DOM MDX avant conversion, avec l’ordre et les formats de texte.
function editorial(block) {
  switch (block.type) {
    case "lead":
      return { kind: "paragraph", spans: block.content };
    case "paragraph":
    case "highlight":
      return { kind: block.type, spans: block.content };
    case "list":
      return { kind: "list", items: block.items };
    case "custom":
      return { kind: "module", name: block.component };
    default:
      throw new Error(`Bloc inattendu dans la migration : ${block.type}`);
  }
}
test("migration SaaS : intégralité du contenu, emphases, code, liens et ordre des cinq modules", () => {
  const expected = baseline.content.map(({ text, ...item }) =>
    item.kind === "module"
      ? item
      : { ...item, ...(text !== undefined ? { text } : {}) },
  );
  const actual = [
    ...article.introBlocks.map(editorial),
    ...article.sections.flatMap((s) => [
      { kind: "anchor", id: s.id },
      { kind: "heading", text: s.title },
      ...s.blocks.map(editorial),
    ]),
  ];
  assert.deepEqual(actual, expected);
  // Le fichier des widgets est désormais localisé. La parité FR et les huit
  // branches métier sont contrôlées sur leur rendu réel, pas par un hash source.
});

test("migration SaaS : métadonnées inchangées et navigation historique conservée", () => {
  const { renderer, ...meta } = baseline.metadata;
  assert.equal(renderer, "editorial");
  const { translationKey, ...currentMeta } = article.meta;
  assert.equal(translationKey, "saas-internationalization-launch");
  assert.deepEqual(currentMeta, meta);
  assert.deepEqual(article.related.slugs, ["guide-premier-emploi-developpeur"]);
  assert.deepEqual(article.legacyAnchors, {
    top: "article-top",
    content: "article-body",
  });
  assert.equal(article.hero.visual.component, "saas-hero");
  assert.equal(article.hero.primaryCta.label, "Explorer la réflexion");
  assert.equal(article.afterBlocks[0].content[0].text, "La suite se mesure.");
  assert.doesNotThrow(() => validateJsonArticle(article));
});

test("options éditoriales : illustration serveur bornée, extrait de titre et collisions d’ancres", () => {
  const fresh = () => structuredClone(article);
  const invalidTitle = fresh();
  invalidTitle.hero.titleHighlight = "texte absent";
  assert.throws(
    () => validateJsonArticle(invalidTitle),
    /extrait exact du titre/,
  );
  const duplicate = fresh();
  duplicate.legacyAnchors.content = "accessible";
  assert.throws(() => validateJsonArticle(duplicate), /dupliqué/);
  const unsafe = fresh();
  unsafe.readingNote = {
    title: "Note",
    content: [{ text: "Lien", link: { href: "javascript:alert(1)" } }],
  };
  assert.throws(() => validateJsonArticle(unsafe), /URL interdite/);
  const blockHero = fresh();
  blockHero.sections[0].blocks.push({ type: "custom", component: "saas-hero" });
  assert.throws(() => validateJsonArticle(blockHero), /réservée au hero/);
  const extraProps = fresh();
  extraProps.hero.visual.props = { html: "<script>" };
  assert.throws(() => validateJsonArticle(extraProps), /champ inconnu/);
});
