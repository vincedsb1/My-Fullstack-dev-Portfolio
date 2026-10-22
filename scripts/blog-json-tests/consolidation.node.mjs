import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  validateJsonArticle,
  readJsonBlogArticleFile,
  validateMergedBlogArticles,
} from "../../src/lib/blog/json-source.mjs";
import { validateBlogLinks } from "../validate-blog-links.mjs";

const file = "src/content/blog-json/fr/json-demo-blog.json";
const fresh = () => JSON.parse(readFileSync(file, "utf8"));
const validate = (article) => validateJsonArticle(article);

test("les IDs générés, le chrome et les widgets partagent le même espace d’ancres", () => {
  for (const id of [
    "main",
    "site-navigation",
    "contact",
    "footer-title",
    "structure-heading",
    "blog-language-demo-title",
    "interface-language",
  ]) {
    const a = fresh();
    a.sections[1].blocks.push({
      type: "heading",
      level: 3,
      text: "Collision",
      id,
    });
    assert.throws(() => validate(a), /dupliqué/, id);
  }
  const a = fresh();
  a.sections[0].blocks.push({
    type: "paragraph",
    content: [{ text: "Titre", link: { href: "#structure-heading" } }],
  });
  assert.doesNotThrow(() => validate(a));
});

test("les titres implicites des cartes/modules participent à la hiérarchie", () => {
  for (const block of [
    { type: "heading", level: 3, text: "Trop tôt" },
    {
      type: "cards",
      items: [{ title: "Carte", description: [{ text: "Texte" }] }],
    },
    { type: "custom", component: "saas-language-demo" },
  ]) {
    const a = fresh();
    a.introBlocks = [block];
    assert.throws(() => validate(a), /H3 sans section H2/);
  }
  const a = fresh();
  a.sections[0].blocks = [
    {
      type: "cards",
      items: [
        {
          title: "Carte",
          description: [{ text: "Texte" }],
          blocks: [{ type: "heading", level: 4, text: "Détail" }],
        },
      ],
    },
  ];
  assert.doesNotThrow(() => validate(a));
});

test("espaces du texte riche et URL comportant des parenthèses restent intacts", () => {
  const a = fresh();
  a.sections[0].blocks[0].content = [
    { text: "A", bold: true },
    { text: " " },
    { text: "B", italic: true },
  ];
  assert.doesNotThrow(() => validate(a));
  const record = readJsonBlogArticleFile(file);
  const href = "/blog/absent/fichier(1).pdf";
  assert.throws(
    () => validateBlogLinks([{ ...record, links: [href] }]),
    /fichier\(1\)\.pdf/,
  );
  const published = {
    ...record,
    metadata: { ...record.metadata, status: "published" },
  };
  assert.throws(
    () =>
      validateBlogLinks([
        { ...published, links: ["/fr/blog/json-demo-blog#absent"] },
      ]),
    /l'ancre/,
  );
  assert.doesNotThrow(() =>
    validateBlogLinks([
      { ...published, links: ["/fr/blog/json-demo-blog#structure-heading"] },
    ]),
  );
});

test("props null, noms hérités et champs arbitraires sont refusés proprement", () => {
  for (const component of ["toString", "constructor", "__proto__"]) {
    const a = fresh();
    a.hero.visual = { component };
    assert.throws(() => validate(a), /module inconnu/);
  }
  const a = fresh();
  a.hero.visual = { component: "saas-mosaic", props: null };
  assert.throws(
    () => validate(a),
    /ne peut pas être utilisé dans le hero|objet attendu/,
  );
  const b = fresh();
  b.sections.at(-1).blocks.at(-1).props = null;
  assert.throws(() => validate(b), /objet attendu/);
});

test("les métadonnées JSON vérifient les vrais projets et la longueur SEO", () => {
  const a = fresh();
  a.meta.relatedProjects = ["absent"];
  assert.throws(() => validate(a), /n'est pas publié dans cette langue/);
  a.meta.relatedProjects = ["iconise"];
  assert.doesNotThrow(() => validate(a));
  a.meta.seoTitle = "A".repeat(40);
  assert.throws(() => validate(a), /39 caractères/);
});

test("deux checklists ne peuvent pas s’écraser ; la clé historique exige les 14 IDs", () => {
  const a = fresh();
  const checklist = structuredClone(a.sections[2].blocks[0]);
  a.sections[2].blocks.push(checklist);
  assert.throws(() => validate(a), /clé de stockage checklist dupliquée/);
  const b = fresh();
  b.sections[2].blocks[0].storageKey = "vd_guide_checklist_v1";
  assert.throws(() => validate(b), /clé historique/);
  const contract = JSON.parse(
    readFileSync("docs/blog/contracts/guide-checklist-v1.json", "utf8"),
  );
  b.meta.slug = "guide-premier-emploi-developpeur";
  b.sections[2].blocks[0].items = contract.items;
  for (const section of b.sections)
    section.blocks = section.blocks.filter((block) => block.type !== "figure");
  assert.doesNotThrow(() => validate(b));
  b.sections[2].blocks[0].items.pop();
  assert.throws(() => validate(b), /14 IDs/);
  const c = fresh();
  c.sections[2].blocks[0].storageKey = "theme";
  assert.throws(() => validate(c), /namespace vd_/);
  const record = readJsonBlogArticleFile(file);
  const one = {
    ...record,
    metadata: { ...record.metadata, status: "published" },
  };
  const two = {
    ...record,
    metadata: {
      ...one.metadata,
      slug: "autre-article",
      title: "Autre titre",
      description: "Autre description",
    },
  };
  assert.throws(
    () => validateMergedBlogArticles([one, two]),
    /clé de stockage déjà publiée/,
  );
});

test("les cartes action exigent une destination, les cartes informatives restent libres", () => {
  const a = fresh();
  delete a.sections[1].blocks[0].items[0].href;
  delete a.sections[1].blocks[0].items[0].actionLabel;
  assert.throws(() => validate(a), /carte action nécessite href/);
  a.sections[1].blocks[0].variant = "info";
  assert.doesNotThrow(() => validate(a));
});
