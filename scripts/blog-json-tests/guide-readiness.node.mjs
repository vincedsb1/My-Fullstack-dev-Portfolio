import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import ts from "typescript";
import { validateJsonArticle } from "../../src/lib/blog/json-source.mjs";
const read = (p) =>
  readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const article = JSON.parse(
  read("src/content/blog-json/fr/guide-premier-emploi-developpeur.json"),
);
const contract = JSON.parse(read("docs/blog/contracts/guide-content-v1.json"));
const checklist = JSON.parse(
  read("docs/blog/contracts/guide-checklist-v1.json"),
);
const plain = (nodes) => nodes.map((n) => n.text).join("");
const compact = (s) => s.replace(/\s+/g, "");
function text(b) {
  switch (b.type) {
    case "paragraph":
    case "lead":
    case "highlight":
    case "quote":
      return plain(b.content);
    case "heading":
      return b.text;
    case "list":
      return b.items.map(plain).join("");
    case "cards":
      return b.items
        .map(
          (c) =>
            c.title +
            plain(c.description) +
            (c.blocks ?? []).map(text).join(""),
        )
        .join("");
    case "callout":
      return (b.title ?? "") + b.blocks.map(text).join("");
    case "code":
      return (b.title ?? "") + b.code;
    case "table":
      return b.caption + b.columns.join("") + b.rows.flat().join("");
    case "checklist":
      return b.items.map((i) => i.label).join("") + (b.printNote ?? "");
    default:
      throw new Error(`Bloc non contrôlé : ${b.type}`);
  }
}
test("guide publié : texte complet, ordre et métadonnées conservés", () => {
  const { renderer, ...meta } = contract.meta;
  assert.equal(renderer, "guide");
  const { translationKey, ...currentMeta } = article.meta;
  assert.equal(translationKey, "first-developer-job-guide");
  assert.deepEqual(currentMeta, meta);
  assert.equal(article.meta.status, "published");
  assert.equal(
    existsSync(
      new URL(
        "../../src/content/blog/fr/guide-premier-emploi-developpeur.mdx",
        import.meta.url,
      ),
    ),
    false,
  );
  assert.equal(
    existsSync(
      new URL(
        "../../src/content/blog-json/fr/guide-premier-emploi-migration.json",
        import.meta.url,
      ),
    ),
    false,
  );
  assert.equal(
    compact(article.introBlocks.map(text).join("")),
    compact(contract.intro),
  );
  assert.equal(article.sections.length, 11);
  for (const [i, s] of article.sections.entries()) {
    assert.equal(s.title, contract.sections[i].title);
    if (contract.sections[i].id) assert.equal(s.id, contract.sections[i].id);
    assert.equal(
      compact(s.title + s.blocks.map(text).join("")),
      compact(contract.sections[i].text),
      s.id,
    );
  }
  assert.doesNotThrow(() => validateJsonArticle(article));
});
test("copie et sauvegarde : modèles exacts, 14 IDs et clé historique", () => {
  const blocks = article.sections.flatMap((s) => s.blocks);
  const list = blocks.find((b) => b.type === "checklist");
  assert.deepEqual(list.items, checklist.items);
  assert.equal(list.storageKey, checklist.storageKey);
  for (const [id, expected] of Object.entries(contract.copies))
    assert.equal(blocks.find((b) => b.id === id).code, expected);
  const invalid = structuredClone(article);
  invalid.sections[1].blocks.find((b) => b.type === "code").id =
    "les-trois-piliers";
  assert.throws(() => validateJsonArticle(invalid), /dupliqué/);
  invalid.sections[1].blocks.find((b) => b.type === "code").id = "msg-template";
  invalid.author.description = { html: "<script>" };
  assert.throws(() => validateJsonArticle(invalid), /texte non vide/);
});
test("tableau historique : aucun espace explicite entre les balises structurelles React", () => {
  const source = ts.createSourceFile(
    "GuideOrganiserRechercheSection.tsx",
    read("src/features/guide/sections/GuideOrganiserRechercheSection.tsx"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let checked = 0;
  function visit(n) {
    if (
      ts.isJsxElement(n) &&
      ["table", "thead", "tbody", "tr", "tfoot", "colgroup"].includes(
        n.openingElement.tagName.getText(source),
      )
    ) {
      checked++;
      for (const c of n.children)
        if (
          ts.isJsxExpression(c) &&
          c.expression &&
          ts.isStringLiteral(c.expression)
        )
          assert.ok(
            !/^\s+$/.test(c.expression.text),
            "Whitespace React invalide dans " +
              n.openingElement.tagName.getText(source),
          );
    }
    ts.forEachChild(n, visit);
  }
  visit(source);
  assert.equal(checked, 6);
});

test("le MDX garde une source technique non publiée après le départ du dernier article historique", async () => {
  const { readAllBlogArticles } = await import(
    "../../src/lib/blog/article-source.mjs"
  );
  const fixture = readAllBlogArticles().find(
    (r) => r.metadata.slug === "mdx-compatibility-fixture",
  );
  assert.equal(fixture?.metadata.status, "draft");
});
