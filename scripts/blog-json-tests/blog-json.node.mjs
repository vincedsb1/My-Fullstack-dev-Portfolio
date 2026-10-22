import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  validateJsonArticle,
  readAllJsonBlogArticles,
  validateMergedBlogArticles,
  getJsonReadingText,
} from "../../src/lib/blog/json-source.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const fixture = JSON.parse(
  readFileSync(
    path.join(root, "src/content/blog-json/fr/json-demo-blog.json"),
    "utf8",
  ),
);
const fresh = () => structuredClone(fixture);
const run = (x) =>
  validateJsonArticle(x, {
    file: "test.json",
    locale: "fr",
    filenameSlug: "json-demo-blog",
  });
function bad(x, pattern) {
  assert.throws(() => run(x), pattern);
}

test("fixture complète et temps de lecture dérivé du texte visible", () => {
  const result = run(fixture);
  assert.equal(result.article.schemaVersion, 1);
  assert.ok(result.links.includes("/fr"));
  assert.ok(result.links.includes("#structure"));
  const text = getJsonReadingText(fixture);
  assert.ok(text.includes("Liste") === false);
  assert.ok(text.includes("Un texte lisible"));
  assert.ok(text.includes("Comprendre les types de blocs"));
  assert.ok(!text.includes("storageKey"));
});
test("lecture des dossiers locaux et exclusion du fixture par statut", () => {
  const records = readAllJsonBlogArticles({
    root: path.join(root, "src/content/blog-json"),
  });
  assert.equal(records.length, 1);
  assert.equal(records[0].metadata.status, "draft");
});
test("version, champs inconnus, statut et dates sont contrôlés", () => {
  const a = fresh();
  a.schemaVersion = 2;
  bad(a, /version 1/);
  const b = fresh();
  b.inlineCss = "color:red";
  bad(b, /champ inconnu/);
  const c = fresh();
  c.meta.status = "released";
  bad(c, /valeur inconnue/);
  const d = fresh();
  d.meta.publishedAt = "2026-02-30";
  bad(d, /date inexistante/);
});
test("H1 interdit dans les blocs, H4 exige H3 et type inconnu interdit", () => {
  const a = fresh();
  a.sections[0].blocks.push({ type: "heading", level: 1, text: "Titre" });
  bad(a, /valeur inconnue/);
  const b = fresh();
  b.sections[0].blocks.unshift({ type: "heading", level: 4, text: "Sans H3" });
  bad(b, /H4 sans H3/);
  const c = fresh();
  c.sections[0].blocks.push({ type: "raw-html", content: "<h1>bad</h1>" });
  bad(c, /type de bloc inconnu/);
});
test("ancres, IDs de section et tableau sont validés", () => {
  const a = fresh();
  a.sections[1].id = "structure";
  bad(a, /dupliqué/);
  const b = fresh();
  b.sections[0].blocks[0].content = [
    { text: "Lien", link: { href: "#manquant" } },
  ];
  bad(b, /ancre cible/);
  const c = fresh();
  const t = c.sections[1].blocks.find((b) => b.type === "table");
  t.rows[0].pop();
  bad(c, /nombre de cellules/);
});
test("navigations interdites et injection de props custom invalides", () => {
  const a = fresh();
  a.sections[0].blocks[0].content = [
    { text: "Bad", link: { href: "javascript:alert(1)" } },
  ];
  bad(a, /URL interdite/);
  const b = fresh();
  a.meta.slug = "json-demo-blog";
  b.sections[2].blocks[1].component = "eval";
  bad(b, /module inconnu/);
  const c = fresh();
  c.sections[2].blocks[1].props.style = "position:fixed";
  bad(c, /champ inconnu/);
});
test("checklist stable, profondeur maximale et liens liés", () => {
  const a = fresh();
  const list = a.sections[2].blocks[0].items;
  list.push({ ...list[0] });
  bad(a, /dupliqué/);
  const b = fresh();
  b.related = { slugs: ["json-demo-blog"] };
  bad(b, /identique/);
  const c = fresh();
  c.sections[0].blocks = [{ type: "callout", blocks: [] }];
  let node = c.sections[0].blocks[0];
  for (let i = 0; i < 7; i++) {
    node.blocks = [{ type: "callout", blocks: [] }];
    node = node.blocks[0];
  }
  bad(c, /profondeur maximale/);
});
test("fichiers média locaux : existence et chemin de l’article", () => {
  const publicRoot = mkdtempSync(path.join(os.tmpdir(), "blog-json-public-"));
  try {
    mkdirSync(path.join(publicRoot, "blog/json-demo-blog"), {
      recursive: true,
    });
    writeFileSync(
      path.join(publicRoot, "blog/json-demo-blog/demo.svg"),
      "<svg/>",
    );
    const a = fresh();
    a.sections[0].blocks.push({
      type: "figure",
      src: "/blog/json-demo-blog/demo.svg",
      alt: "Diagramme",
      width: 100,
      height: 80,
    });
    assert.doesNotThrow(() =>
      validateJsonArticle(a, {
        file: "test",
        locale: "fr",
        filenameSlug: "json-demo-blog",
        publicRoot,
      }),
    );
    a.sections[0].blocks.at(-1).src = "/blog/autre/demo.svg";
    assert.throws(
      () =>
        validateJsonArticle(a, {
          file: "test",
          locale: "fr",
          filenameSlug: "json-demo-blog",
          publicRoot,
        }),
      /image locale/,
    );
  } finally {
    rmSync(publicRoot, { recursive: true, force: true });
  }
});
test("collisions MDX/JSON, traductions et références vers brouillons", () => {
  const draft = {
    metadata: fixture.meta,
    filePath: "draft.json",
    format: "json",
    data: fixture,
  };
  const mdx = {
    metadata: { ...fixture.meta, status: "published" },
    filePath: "legacy.mdx",
    body: "x",
  };
  assert.throws(
    () => validateMergedBlogArticles([draft, mdx]),
    /collision de route/,
  );
  const english = {
    metadata: {
      ...fixture.meta,
      locale: "en",
      slug: "test-en",
      title: "Translated",
      description: "Translated description",
      status: "published",
      translationKey: "translation",
    },
    filePath: "en.json",
    body: "",
    format: "json",
  };
  assert.throws(
    () => validateMergedBlogArticles([draft, english]),
    /version française publiée/,
  );
  const published = {
    ...draft,
    metadata: { ...draft.metadata, status: "published" },
    data: { ...fixture, related: { slugs: ["unpublished"] } },
  };
  assert.throws(
    () => validateMergedBlogArticles([published]),
    /article lié absent/,
  );
});
