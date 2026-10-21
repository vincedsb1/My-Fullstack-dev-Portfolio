import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const {
  validateProjectCatalog,
  validateCaseStudyManifest,
  parseCaseStudyManifest,
} = await import("../src/content/projects/validation.ts");
const { getProjectFixture, projectFixtureCoverage, projectFixtures } =
  await import("../src/content/projects/fixtures.ts");
const { projectCatalog } = await import("../src/content/projects/catalog.ts");
const { caseStudyManifests } = await import(
  "../src/content/projects/manifests/index.ts"
);

const issues = validateProjectCatalog();
let jsonCount = 0;

// Vérifier les vrais JSON et leur raccordement au catalogue, pas seulement les fixtures.
for (const project of projectCatalog) {
  for (const [locale, publication] of Object.entries(
    project.caseStudyByLocale,
  )) {
    if (publication.status === "not-started") continue;
    const manifest = caseStudyManifests[`${locale}:${project.id}`];
    if (!manifest || !publication.manifestFile) {
      issues.push({
        code: "MISSING_MANIFEST",
        message: `${project.id}/${locale}: missing registered JSON.`,
      });
      continue;
    }
    const file = new URL(`../${publication.manifestFile}`, import.meta.url);
    const json = JSON.parse(await readFile(file, "utf8"));
    issues.push(...validateCaseStudyManifest(json));
    assert.deepEqual(
      manifest,
      json,
      `Registered content differs from ${publication.manifestFile}`,
    );
    if (
      manifest.projectId !== project.id ||
      manifest.locale !== locale ||
      manifest.slug !== project.slug
    ) {
      issues.push({
        code: "MANIFEST_IDENTITY_MISMATCH",
        message: `${publication.manifestFile}: project, locale or slug mismatch.`,
      });
    }
    const expectedStatus =
      publication.status === "published" ? "published" : "draft";
    if (manifest.status !== expectedStatus) {
      issues.push({
        code: "MANIFEST_STATUS_MISMATCH",
        message: `${publication.manifestFile}: catalog and content publication statuses differ.`,
      });
    }
    jsonCount++;
  }
}

for (const manifest of Object.values(caseStudyManifests)) {
  const publication = projectCatalog.find(
    (project) => project.id === manifest.projectId,
  )?.caseStudyByLocale[manifest.locale];
  if (!publication || publication.status === "not-started") {
    issues.push({
      code: "ORPHAN_MANIFEST",
      message: `${manifest.projectId}/${manifest.locale}: registered without a catalog entry.`,
    });
  }
}

// Le modèle à remplir reste hors du registre des pages publiques.
const template = JSON.parse(
  await readFile(
    new URL("../docs/projects/CASE_STUDY_TEMPLATE.json", import.meta.url),
    "utf8",
  ),
);
issues.push(...validateCaseStudyManifest(template));

for (const locale of ["fr", "en"]) {
  for (const variant of ["rich", "standard", "light"]) {
    issues.push(...validateCaseStudyManifest(projectFixtures[locale][variant]));
  }
}

for (const fixture of Object.values(projectFixtureCoverage)) {
  issues.push(...validateCaseStudyManifest(fixture));
}

for (const challengeCount of [1, 2, 3, 4, 5]) {
  const fixture = Object.values(projectFixtureCoverage).find(
    (candidate) => candidate.challenges?.length === challengeCount,
  );
  if (!fixture) {
    issues.push({
      code: "FIXTURE_CHALLENGE_COVERAGE",
      message: `No development fixture covers ${challengeCount} challenge(s).`,
    });
  }
}

for (const workflowCount of [2, 3, 4, 5]) {
  const fixture = Object.values(projectFixtureCoverage).find(
    (candidate) => candidate.workflow?.length === workflowCount,
  );
  if (!fixture) {
    issues.push({
      code: "FIXTURE_WORKFLOW_COVERAGE",
      message: `No development fixture covers ${workflowCount} workflow step(s).`,
    });
  }
}

if (getProjectFixture("de", "rich") !== undefined) {
  issues.push({
    code: "FIXTURE_UNSUPPORTED_LOCALE",
    message: "An unsupported fixture locale must resolve to undefined.",
  });
}

const invalidFixture = structuredClone(projectFixtures.fr.rich);
if (invalidFixture.architecture) {
  invalidFixture.architecture.edges[0].to = "missing-node";
}
const invalidIssues = validateCaseStudyManifest(invalidFixture);
if (
  !invalidIssues.some((issue) => issue.code === "INVALID_ARCHITECTURE_EDGE")
) {
  issues.push({
    code: "VALIDATOR_REGRESSION",
    message:
      "The validator did not reject an invalid architecture edge fixture.",
  });
}

// Les données JSON ne bénéficient pas des unions littérales de TypeScript.
// Vérifier que le contrat rejette réellement les erreurs d'édition courantes.
const malformedCases = [
  null,
  { ...template, locale: "de" },
  { ...template, schemaVersion: 2 },
  { ...template, hero: { ...template.hero, description: 42 } },
  {
    ...template,
    workflow: [
      {
        ...template.workflow[0],
        visual: {
          type: "flow",
          title: "Flow",
          description: "Flow",
          steps: "not-an-array",
        },
      },
    ],
  },
  { ...template, stack: ["unknown-technology"] },
  { ...template, video: { verified: "true" } },
  { ...template, architecture: { ...template.architecture, nodes: null } },
  { ...template, misspelledField: "not accepted" },
];
for (const malformed of malformedCases) {
  assert(
    validateCaseStudyManifest(malformed).some(
      (issue) => issue.code === "INVALID_MANIFEST_SHAPE",
    ),
  );
  assert.throws(
    () => parseCaseStudyManifest(malformed),
    /Invalid project case study/,
  );
}
const invalidFeaturedNode = structuredClone(template);
invalidFeaturedNode.architecture.featuredNodeIds = ["missing-node"];
assert(
  validateCaseStudyManifest(invalidFeaturedNode).some(
    (issue) => issue.code === "INVALID_FEATURED_NODE",
  ),
);

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`[${issue.code}] ${issue.message}`);
  }
  process.exitCode = 1;
} else {
  console.info(
    `Project catalog validation passed: 15 projects, taxonomy 4/3/8, ${jsonCount} localized JSON manifests and the content template.`,
  );
}
