import { projectCatalog } from "./catalog.ts";
import { validateCaseStudyShape } from "./manifest-shape.ts";
import {
  archiveProjectIds,
  featuredProjectIds,
  otherProjectIds,
} from "./taxonomy.ts";
import type { ProjectCaseStudyManifest } from "./types.ts";

export interface ProjectValidationIssue {
  code: string;
  message: string;
}

function containsInvalidFragment(value: unknown): boolean {
  if (typeof value === "string") {
    return value === "#" || value.includes('href="#"');
  }
  if (Array.isArray(value)) return value.some(containsInvalidFragment);
  if (value && typeof value === "object") {
    return Object.values(value).some(containsInvalidFragment);
  }
  return false;
}

export function validateCaseStudyManifest(
  value: unknown,
): ProjectValidationIssue[] {
  const issues = validateCaseStudyShape(value);
  if (issues.length) return issues;
  // La structure et les discriminants sont contrôlés avant l’accès aux champs.
  const manifest = value as ProjectCaseStudyManifest;
  const workflowIds = manifest.workflow?.map((step) => step.id) ?? [];
  const nodeIds = manifest.architecture?.nodes.map((node) => node.id) ?? [];
  const galleryIds = manifest.gallery?.map((item) => item.id) ?? [];
  const unique = (values: string[]) => new Set(values).size === values.length;

  if (!unique(workflowIds)) {
    issues.push({
      code: "DUPLICATE_WORKFLOW_ID",
      message: "Workflow step IDs must be unique.",
    });
  }
  if (!unique(nodeIds)) {
    issues.push({
      code: "DUPLICATE_NODE_ID",
      message: "Architecture node IDs must be unique.",
    });
  }
  if (!unique(galleryIds)) {
    issues.push({
      code: "DUPLICATE_GALLERY_ID",
      message: "Gallery media IDs must be unique.",
    });
  }

  const nodeSet = new Set(nodeIds);
  for (const edge of manifest.architecture?.edges ?? []) {
    if (!nodeSet.has(edge.from) || !nodeSet.has(edge.to)) {
      issues.push({
        code: "INVALID_ARCHITECTURE_EDGE",
        message: `Architecture edge ${edge.id} references an unknown node.`,
      });
    }
  }

  for (const id of manifest.architecture?.featuredNodeIds ?? []) {
    if (!nodeSet.has(id)) {
      issues.push({
        code: "INVALID_FEATURED_NODE",
        message: `Featured architecture node ${id} does not exist.`,
      });
    }
  }

  if (containsInvalidFragment(manifest)) {
    issues.push({
      code: "INVALID_FRAGMENT_LINK",
      message:
        'Case-study data must not contain href="#" or a placeholder fragment link.',
    });
  }

  if (manifest.status === "fixture" && !manifest.seo.noindex) {
    issues.push({
      code: "FIXTURE_INDEXABLE",
      message: "Development fixtures must be marked noindex.",
    });
  }

  if (manifest.status === "draft" && !manifest.seo.noindex) {
    issues.push({
      code: "DRAFT_INDEXABLE",
      message: "Draft case studies must be marked noindex.",
    });
  }

  if (manifest.status === "published") {
    if (!manifest.seo.title || !manifest.seo.description) {
      issues.push({
        code: "PUBLISHED_SEO_MISSING",
        message:
          "Published case studies require title and description metadata.",
      });
    }
    if (
      !manifest.hero.hook ||
      !manifest.overview.problem ||
      !manifest.overview.solution
    ) {
      issues.push({
        code: "PUBLISHED_CONTENT_MISSING",
        message: "Published case studies require a complete hero and overview.",
      });
    }
  }

  return issues;
}

/** Point d’entrée des fichiers JSON : aucun cast non vérifié dans le registre. */
export function parseCaseStudyManifest(
  value: unknown,
): ProjectCaseStudyManifest {
  const issues = validateCaseStudyManifest(value);
  if (issues.length) {
    throw new Error(
      `Invalid project case study:\n${issues
        .map((issue) => `[${issue.code}] ${issue.message}`)
        .join("\n")}`,
    );
  }
  return value as ProjectCaseStudyManifest;
}

export function validateProjectCatalog(): ProjectValidationIssue[] {
  const issues: ProjectValidationIssue[] = [];
  const expectedIds = [
    ...featuredProjectIds,
    ...otherProjectIds,
    ...archiveProjectIds,
  ];
  const catalogIds = projectCatalog.map((project) => project.id);
  const unique = new Set(catalogIds);

  if (projectCatalog.length !== 15) {
    issues.push({
      code: "CATALOG_COUNT",
      message: `Expected 15 projects, received ${projectCatalog.length}.`,
    });
  }

  if (unique.size !== catalogIds.length) {
    issues.push({
      code: "CATALOG_DUPLICATE_ID",
      message: "Project identifiers must be unique.",
    });
  }

  if (new Set(expectedIds).size !== expectedIds.length) {
    issues.push({
      code: "TAXONOMY_DUPLICATE_ID",
      message: "Taxonomy lists must not contain duplicate identifiers.",
    });
  }

  for (const id of expectedIds) {
    if (!catalogIds.includes(id)) {
      issues.push({
        code: "TAXONOMY_MISSING_PROJECT",
        message: `Taxonomy project ${id} is absent from the catalog.`,
      });
    }
  }

  for (const project of projectCatalog) {
    if (!project.slug || project.slug.includes(" ")) {
      issues.push({
        code: "INVALID_SLUG",
        message: `Project ${project.id} has an invalid slug.`,
      });
    }

    for (const link of [project.links.live, project.links.github]) {
      if (link && (!link.verified || !/^https:\/\//.test(link.url))) {
        issues.push({
          code: "UNVERIFIED_EXTERNAL_LINK",
          message: `External link for ${project.id} is not verified HTTPS.`,
        });
      }
    }

    for (const locale of ["fr", "en"] as const) {
      const publication = project.caseStudyByLocale[locale];
      if (publication?.status === "published" && !publication.manifestFile) {
        issues.push({
          code: "PUBLISHED_WITHOUT_MANIFEST",
          message: `${project.id}/${locale} is published without a manifest file.`,
        });
      }
    }
  }

  const featured = projectCatalog.filter(
    (project) => project.placement === "featured",
  );
  const other = projectCatalog.filter(
    (project) => project.placement === "other",
  );
  const archive = projectCatalog.filter(
    (project) => project.placement === "archive",
  );
  if (featured.length !== 4 || other.length !== 3 || archive.length !== 8) {
    issues.push({
      code: "TAXONOMY_COUNTS",
      message: `Expected 4/3/8 placement counts, received ${featured.length}/${other.length}/${archive.length}.`,
    });
  }

  return issues;
}
