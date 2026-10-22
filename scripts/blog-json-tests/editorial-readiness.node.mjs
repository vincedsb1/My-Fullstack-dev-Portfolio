import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  validateJsonArticle,
  registeredJsonCustomModules,
} from "../../src/lib/blog/json-source.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const read = (p) => readFileSync(path.join(root, p), "utf8");
const fixture = JSON.parse(
  read("src/content/blog-json/fr/json-demo-blog.json"),
);
const fresh = () => structuredClone(fixture);
const validate = (a) =>
  validateJsonArticle(a, {
    file: "readiness.json",
    locale: a.meta.locale,
    filenameSlug: "json-demo-blog",
  });
const names = [
  "saas-mosaic",
  "saas-language-demo",
  "saas-language-matrix",
  "saas-acquisition-funnel",
  "saas-decision-tree",
];

test("registre JSON couvre les cinq interactions de l’article SaaS", () => {
  assert.deepEqual(
    names.filter((n) => !registeredJsonCustomModules.includes(n)),
    [],
  );
  const blocks = fixture.sections
    .flatMap((s) => s.blocks)
    .filter((b) => b.type === "custom");
  for (const name of names)
    assert.equal(blocks.filter((b) => b.component === name).length, 1);
  assert.doesNotThrow(() => validate(fixture));
});

test("les composants métier sont bornés, non dupliqués et non disponibles en EN sans traduction", () => {
  const unknown = fresh();
  unknown.sections[0].blocks.push({
    type: "custom",
    component: "javascript-eval",
  });
  assert.throws(() => validate(unknown), /module inconnu/);
  const duplicate = fresh();
  duplicate.sections
    .at(-1)
    .blocks.push({ type: "custom", component: "saas-mosaic" });
  assert.throws(() => validate(duplicate), /module interactif dupliqué/);
  const extra = fresh();
  extra.sections.at(-1).blocks.at(-1).props = { style: "position:fixed" };
  assert.throws(() => validate(extra), /champ inconnu/);
  const english = fresh();
  english.meta.locale = "en";
  assert.throws(() => validate(english), /réservé au contenu français/);
  const hero = fresh();
  hero.hero.visual = { component: "saas-language-matrix" };
  assert.throws(() => validate(hero), /ne peut pas être utilisé dans le hero/);
});

test("le JSON prépare SEO, projets liés et YouTube sans autoriser un ID arbitraire", () => {
  const valid = fresh();
  valid.meta.seoTitle = "Titre court";
  valid.meta.relatedProjects = ["iconise"];
  valid.sections[0].blocks.push({
    type: "video",
    provider: "youtube",
    id: "jNQXAC9IVRw",
    title: "Exemple vidéo",
  });
  assert.doesNotThrow(() => validate(valid));
  valid.sections[0].blocks.at(-1).id = "https://evil.example/watch?v=abcd";
  assert.throws(() => validate(valid), /identifiant YouTube invalide/);
  const invalid = fresh();
  invalid.meta.relatedProjects = ["iconise", "iconise"];
  assert.throws(() => validate(invalid), /dupliqués/);
});

test("le contrat de sauvegarde des 14 cases historiques reste figé", () => {
  const contract = JSON.parse(
    read("docs/blog/contracts/guide-checklist-v1.json"),
  );
  const legacy = read(
    "src/features/guide/sections/GuideChecklistFinaleSection.tsx",
  );
  const legacyController = read("src/features/guide/GuideInteractive.tsx");
  const current = read("src/features/blog/json/JsonChecklist.tsx");
  assert.equal(contract.storageKey, "vd_guide_checklist_v1");
  assert.equal(contract.items.length, 14);
  assert.deepEqual(
    contract.items.map((x) => x.id),
    Array.from({ length: 14 }, (_, i) => `chk-${i + 1}`),
  );
  const sourceIds = [...legacy.matchAll(/data-id=\{"(chk-\d+)"\}/g)].map(
    (x) => x[1],
  );
  assert.deepEqual(
    sourceIds,
    contract.items.map((x) => x.id),
  );
  assert.match(legacyController, /vd_guide_checklist_v1/);
  assert.match(current, /state\\[item\\.id\\]\\s*===\\s*true/);
  assert.match(
    current,
    /items\\.filter\\(\\(item\\)\\s*=>\\s*next\\[item\\.id\\]\\s*===\\s*true\\)/,
  );
});

test("le Showcase publie les modules via le vrai moteur JSON et garde une page SEO distincte", () => {
  const showcase = read("src/features/blog/design-system/BlogShowcase.tsx");
  const ui = read("src/features/blog/json/JsonCustomRegistry.tsx");
  const page = read("src/app/(localized)/[locale]/blog/showcase/page.tsx");
  assert.match(showcase, /<JsonBlockRenderer blocks=\{section\.blocks\}/);
  assert.match(ui, /InternationalisationArticleModule variant=/);
  assert.match(page, /index: false/);
});
