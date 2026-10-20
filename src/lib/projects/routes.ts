import type { ProjectLocale } from "@/content/projects/types";

export function getProjectsPath(locale: ProjectLocale) {
  return locale === "fr" ? `/${locale}/projets` : `/${locale}/projects`;
}

export function getPortfolioPath(locale: ProjectLocale) {
  return `/${locale}#projects3`;
}

export function getArchivePath(locale: ProjectLocale) {
  return locale === "fr"
    ? `/${locale}/projets/archives`
    : `/${locale}/projects/archive`;
}

export function getProjectDetailPath(locale: ProjectLocale, slug: string) {
  return `${getProjectsPath(locale)}/${slug}`;
}

export function getProjectPreviewPath(
  locale: ProjectLocale,
  variant: "rich" | "standard" | "light",
) {
  return `${getProjectsPath(locale)}/preview/${variant}`;
}
