import "server-only";
import {
  getProjectBySlug,
  getProjectsByPlacement,
  projectCatalog,
} from "./catalog.ts";
import {
  archiveProjectIds,
  featuredProjectIds,
  otherProjectIds,
} from "./taxonomy.ts";
import { caseStudyManifests } from "./manifests/index.ts";
import type {
  ProjectCaseStudyManifest,
  ProjectCatalogEntry,
  ProjectLocale,
} from "./types.ts";

export function getVisibleProjectsByPlacement(
  placement: "featured" | "other" | "archive",
) {
  return getProjectsByPlacement(placement);
}

export function getFeaturedProjects() {
  return featuredProjectIds
    .map((id) => projectCatalog.find((project) => project.id === id))
    .filter((project): project is ProjectCatalogEntry => Boolean(project));
}

export function getOtherProjects() {
  return otherProjectIds
    .map((id) => projectCatalog.find((project) => project.id === id))
    .filter((project): project is ProjectCatalogEntry => Boolean(project));
}

export function getArchiveProjects() {
  return archiveProjectIds
    .map((id) => projectCatalog.find((project) => project.id === id))
    .filter((project): project is ProjectCatalogEntry => Boolean(project));
}

export function getPublishedCaseStudy(
  locale: ProjectLocale,
  slug: string,
): ProjectCaseStudyManifest | undefined {
  const project = getProjectBySlug(slug);
  if (!project || project.portfolioVisibility !== "visible") return undefined;

  const publication = project.caseStudyByLocale[locale];
  if (publication?.status !== "published") return undefined;

  return caseStudyManifests[`${locale}:${project.id}`];
}

export function getAvailableCaseStudy(
  locale: ProjectLocale,
  slug: string,
): ProjectCaseStudyManifest | undefined {
  const project = getProjectBySlug(slug);
  if (!project || project.portfolioVisibility !== "visible") return undefined;

  const publication = project.caseStudyByLocale[locale];
  if (!publication || publication.status === "not-started") return undefined;

  return caseStudyManifests[`${locale}:${project.id}`];
}

export function getAvailableProjectSlugs(locale: ProjectLocale) {
  return projectCatalog
    .filter(
      (project) =>
        project.portfolioVisibility === "visible" &&
        project.caseStudyByLocale[locale]?.status !== undefined &&
        project.caseStudyByLocale[locale]?.status !== "not-started" &&
        Boolean(caseStudyManifests[`${locale}:${project.id}`]),
    )
    .map((project) => project.slug);
}

export function getPublishedProjectSlugs(locale: ProjectLocale) {
  return projectCatalog
    .filter(
      (project) =>
        project.portfolioVisibility === "visible" &&
        project.caseStudyByLocale[locale]?.status === "published" &&
        Boolean(caseStudyManifests[`${locale}:${project.id}`]),
    )
    .map((project) => project.slug);
}

export function isCaseStudyPublished(
  project: ProjectCatalogEntry,
  locale: ProjectLocale,
) {
  return (
    project.caseStudyByLocale[locale]?.status === "published" &&
    Boolean(caseStudyManifests[`${locale}:${project.id}`])
  );
}

export function isCaseStudyAvailable(
  project: ProjectCatalogEntry,
  locale: ProjectLocale,
) {
  return Boolean(getAvailableCaseStudy(locale, project.slug));
}

export function getPublishedNeighbors(
  locale: ProjectLocale,
  project: ProjectCatalogEntry,
) {
  const placementRank = { featured: 0, other: 1, archive: 2 } as const;
  const published = projectCatalog
    .filter((candidate) => isCaseStudyPublished(candidate, locale))
    .sort((a, b) => {
      if (a.placement !== b.placement) {
        return placementRank[a.placement] - placementRank[b.placement];
      }
      return a.order - b.order;
    });
  const index = published.findIndex((candidate) => candidate.id === project.id);
  if (index === -1 || published.length < 2) {
    return { previous: undefined, next: undefined };
  }

  return {
    previous: published[(index - 1 + published.length) % published.length],
    next: published[(index + 1) % published.length],
  };
}

export function getNextPortfolioProject(project: ProjectCatalogEntry) {
  const placementRank = { featured: 0, other: 1, archive: 2 } as const;
  const visibleProjects = projectCatalog
    .filter((candidate) => candidate.portfolioVisibility === "visible")
    .sort((a, b) => {
      if (a.placement !== b.placement) {
        return placementRank[a.placement] - placementRank[b.placement];
      }
      return a.order - b.order;
    });
  const index = visibleProjects.findIndex(
    (candidate) => candidate.id === project.id,
  );

  if (index === -1 || visibleProjects.length < 2) return undefined;
  return visibleProjects[(index + 1) % visibleProjects.length];
}

export function getProjectFromCatalog(slug: string) {
  return getProjectBySlug(slug);
}
