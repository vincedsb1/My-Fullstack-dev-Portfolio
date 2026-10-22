import { getPathname } from "@/i18n/paths";
import type { ProjectLocale } from "@/content/projects/types";
export const getProjectsPath = (locale: ProjectLocale) =>
  getPathname({ locale, href: "/projects" });
export const getPortfolioPath = (locale: ProjectLocale) =>
  `/${locale}#${locale === "fr" ? "projets" : "projects"}`;
export const getArchivePath = (locale: ProjectLocale) =>
  getPathname({ locale, href: "/projects/archive" });
export const getProjectDetailPath = (locale: ProjectLocale, slug: string) =>
  getPathname({
    locale,
    href: { pathname: "/projects/[slug]", params: { slug } },
  });
export const getProjectPreviewPath = (
  locale: ProjectLocale,
  variant: "rich" | "standard" | "light",
) =>
  getPathname({
    locale,
    href: { pathname: "/projects/preview/[variant]", params: { variant } },
  });
