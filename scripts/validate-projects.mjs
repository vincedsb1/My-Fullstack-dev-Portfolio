const { validateProjectCatalog } = await import(
  "../src/content/projects/validation.ts"
);
const { validateCaseStudyManifest } = await import(
  "../src/content/projects/validation.ts"
);
const { getProjectFixture, projectFixtureCoverage, projectFixtures } =
  await import("../src/content/projects/fixtures.ts");

const issues = validateProjectCatalog();
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

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`[${issue.code}] ${issue.message}`);
  }
  process.exitCode = 1;
} else {
  console.info(
    "Project catalog validation passed: 15 projects, taxonomy 4/3/8.",
  );
}
