import { projectCatalog } from "./catalog.ts";
import { technologyIds } from "./types.ts";
import type { ProjectValidationIssue } from "./validation.ts";

type RuleArgs = [unknown, string, ProjectValidationIssue[]];
// eslint-disable-next-line no-unused-vars -- Signature de type, sans paramètres exécutables.
type Rule = (...args: RuleArgs) => void;

function invalid(
  path: string,
  expected: string,
  issues: ProjectValidationIssue[],
) {
  issues.push({
    code: "INVALID_MANIFEST_SHAPE",
    message: `${path}: ${expected}.`,
  });
}

const text: Rule = (value, path, issues) => {
  if (typeof value !== "string") invalid(path, "expected a string", issues);
};
const boolean: Rule = (value, path, issues) => {
  if (typeof value !== "boolean") invalid(path, "expected a boolean", issues);
};
const number: Rule = (value, path, issues) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    invalid(path, "expected a finite number", issues);
  }
};
const oneOf =
  (values: readonly unknown[]): Rule =>
  (value, path, issues) => {
    if (!values.includes(value))
      invalid(path, `expected one of ${values.join(", ")}`, issues);
  };
const array =
  (rule: Rule): Rule =>
  (value, path, issues) => {
    if (!Array.isArray(value))
      return invalid(path, "expected an array", issues);
    value.forEach((item, index) => rule(item, `${path}[${index}]`, issues));
  };
const object =
  (required: Record<string, Rule>, optional: Record<string, Rule> = {}): Rule =>
  (value, path, issues) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return invalid(path, "expected an object", issues);
    }
    const record = value as Record<string, unknown>;
    Object.entries(required).forEach(([key, rule]) =>
      rule(record[key], `${path}.${key}`, issues),
    );
    Object.entries(optional).forEach(([key, rule]) => {
      if (record[key] !== undefined)
        rule(record[key], `${path}.${key}`, issues);
    });
    Object.keys(record).forEach((key) => {
      if (!Object.hasOwn(required, key) && !Object.hasOwn(optional, key)) {
        invalid(`${path}.${key}`, "unknown field", issues);
      }
    });
  };

const visual = object(
  {
    type: oneOf(["image", "mockup", "illustration", "diagram", "placeholder"]),
  },
  {
    src: text,
    alt: text,
    width: number,
    height: number,
    label: text,
    imageId: text,
  },
);

const workflowVisuals: Record<string, Rule> = {
  icon: object(
    { type: oneOf(["icon"]), title: text, description: text },
    { icon: text },
  ),
  mockup: object({
    type: oneOf(["mockup"]),
    title: text,
    description: text,
    visual,
  }),
  flow: object({
    type: oneOf(["flow"]),
    title: text,
    description: text,
    steps: array(text),
  }),
  result: object(
    { type: oneOf(["result"]), title: text, description: text },
    { visual },
  ),
};
const workflowVisual: Rule = (value, path, issues) => {
  const type =
    value && typeof value === "object" && "type" in value
      ? value.type
      : undefined;
  if (typeof type !== "string" || !Object.hasOwn(workflowVisuals, type)) {
    return invalid(
      `${path}.type`,
      "expected icon, mockup, flow or result",
      issues,
    );
  }
  workflowVisuals[type](value, path, issues);
};

// Contrat des données JSON, partagé par le chargement et la commande de validation.
// Les règles de présentation (ordre, tailles, couleurs, limites de cartes) restent dans le template.
const manifest = object(
  {
    schemaVersion: oneOf([1]),
    status: oneOf(["fixture", "draft", "published"]),
    projectId: oneOf([
      ...projectCatalog.map((project) => project.id),
      "fixture",
    ]),
    slug: text,
    locale: oneOf(["fr", "en"]),
    variant: oneOf(["rich", "standard", "light"]),
    meta: object({ title: text, category: text }, { year: text, role: text }),
    seo: object(
      { title: text, description: text },
      { socialImage: visual, noindex: boolean },
    ),
    hero: object(
      { hook: text, description: text },
      { pill: text, category: text, year: text, role: text, visual },
    ),
    overview: object(
      { problem: text, solution: text },
      { audience: text, context: text, scope: text, role: text },
    ),
  },
  {
    stack: array(oneOf(technologyIds)),
    workflow: array(
      object({
        id: text,
        title: text,
        description: text,
        visual: workflowVisual,
      }),
    ),
    architecture: object(
      {
        description: text,
        nodes: array(
          object(
            { id: text, label: text, type: text, role: text },
            {
              technology: text,
              icon: text,
              highlight: boolean,
              position: object({ x: number, y: number }),
            },
          ),
        ),
        edges: array(
          object(
            { id: text, from: text, to: text },
            { label: text, flow: text },
          ),
        ),
      },
      {
        featuredNodeIds: array(text),
        featuredEdgeLabels: array(text),
        asyncFlows: array(object({ id: text, description: text })),
      },
    ),
    gallery: array(object({ id: text, visual, alt: text }, { caption: text })),
    video: object(
      { verified: boolean },
      {
        provider: oneOf(["file", "youtube"]),
        url: text,
        poster: visual,
        caption: text,
        playLabel: text,
        regionLabel: text,
      },
    ),
    decisions: array(
      object(
        { id: text, title: text, choice: text, rationale: text },
        { alternative: text, constraint: text },
      ),
    ),
    challenges: array(
      object(
        { id: text, title: text },
        {
          problem: text,
          constraint: text,
          decision: text,
          solution: text,
          tradeoff: text,
          result: text,
        },
      ),
    ),
    outcomes: array(
      object({ id: text, title: text, description: text }, { evidence: text }),
    ),
    limitations: array(text),
    mdxFile: text,
  },
);

export function validateCaseStudyShape(
  value: unknown,
): ProjectValidationIssue[] {
  const issues: ProjectValidationIssue[] = [];
  manifest(value, "manifest", issues);
  return issues;
}
