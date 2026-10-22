import "server-only";
import { getTranslations } from "next-intl/server";
import {
  getFeaturedProjects,
  getOtherProjects,
  getArchiveProjects,
  isCaseStudyAvailable,
} from "./loaders";
import { getProjectDetailPath } from "@/lib/projects/routes";
import type {
  ProjectCatalogEntry,
  ProjectLocale,
  ProjectVisual,
  TechnologyId,
} from "./types";
export interface ProjectCardModel {
  id: string;
  name: string;
  description: string;
  featuredDescription: string;
  carouselDescriptionKey: string | null;
  kindLabel: string;
  technologies: TechnologyId[];
  visual: ProjectVisual;
  cardVisual: ProjectVisual;
  transparent: boolean;
  detailHref: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
}
export async function getProjectModels(
  locale: ProjectLocale,
  projects: ProjectCatalogEntry[],
): Promise<ProjectCardModel[]> {
  const t = await getTranslations({ locale, namespace: "projects" });
  return projects.map((p) => ({
    id: p.id,
    name: t(p.nameKey),
    description: t(p.descriptionKey).replace(/<[^>]+>/g, ""),
    featuredDescription: String(
      t.raw(p.carouselDescriptionKey ?? p.descriptionKey),
    )
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    carouselDescriptionKey: p.carouselDescriptionKey ?? null,
    kindLabel: t(`kind.${p.kind}`),
    technologies: p.technologies,
    visual:
      p.featuredVisual ??
      (p.cardVisual?.verified
        ? { ...p.cardVisual, alt: p.cardVisual.alt || t(p.nameKey) }
        : {
            type: "illustration",
            imageId: p.illustration,
            label: t(p.nameKey),
          }),
    cardVisual: p.cardVisual?.verified
      ? { ...p.cardVisual, alt: p.cardVisual.alt || t(p.nameKey) }
      : {
          type: "illustration",
          imageId: p.illustration,
          label: t(p.nameKey),
        },
    transparent: p.featuredTransparent ?? false,
    detailHref: isCaseStudyAvailable(p, locale)
      ? getProjectDetailPath(locale, p.slug)
      : null,
    liveUrl: p.links.live?.verified ? p.links.live.url : null,
    githubUrl: p.links.github?.verified ? p.links.github.url : null,
  }));
}
export async function getHomeProjects(locale: ProjectLocale) {
  return {
    featured: await getProjectModels(locale, getFeaturedProjects()),
    others: await getProjectModels(locale, getOtherProjects()),
  };
}
export const getArchiveModels = (locale: ProjectLocale) =>
  getProjectModels(locale, getArchiveProjects());
