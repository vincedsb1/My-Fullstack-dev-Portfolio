import { SITE_URL, absoluteUrl } from "@/lib/site";
import { PERSON_ID, WEBSITE_ID } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { getTranslations } from "next-intl/server";
import { getProjectsPath } from "@/lib/projects/routes";
import { notFound } from "next/navigation";
import type { ProjectLocale } from "@/content/projects/types";
import {
  getAvailableCaseStudy,
  getNextPortfolioProject,
  getProjectFromCatalog,
  getPublishedNeighbors,
} from "@/content/projects/loaders";
import { loadProjectCaseStudyBody } from "@/content/projects/mdx";
import { getProjectDetailPath } from "@/lib/projects/routes";
import ProjectCaseStudyTemplate from "./ProjectCaseStudyTemplate";

export async function ProjectCaseStudyRoutePage({
  locale,
  slug,
}: {
  locale: ProjectLocale;
  slug: string;
}) {
  const project = getProjectFromCatalog(slug);
  const manifest = getAvailableCaseStudy(locale, slug);
  if (!project || !manifest) notFound();

  const { previous, next } = getPublishedNeighbors(locale, project);
  const nextPortfolioProject = getNextPortfolioProject(project);
  const mdxModule = await loadProjectCaseStudyBody(locale, project.slug);
  const EditorialBody = mdxModule?.default;
  const baseUrl = SITE_URL;
  const t = await getTranslations({ locale, namespace: "site" });
  const url = `${baseUrl}${getProjectDetailPath(locale, project.slug)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: manifest.seo.title,
    description: manifest.seo.description,
    url,
    inLanguage: locale === "fr" ? "fr-FR" : "en",
    creator: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    image: absoluteUrl(`${getProjectDetailPath(locale, slug)}/social-image`),
    dateModified: manifest.updatedAt,
    keywords: project.technologies.join(", "),
    about: {
      "@type": "CreativeWork",
      name: project.canonicalName,
    },
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Portfolio",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("projects"),
        item: `${baseUrl}${getProjectsPath(locale)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.canonicalName,
        item: url,
      },
    ],
  };

  const isIndexable = manifest.status === "published" && !manifest.seo.noindex;

  return (
    <>
      {isIndexable ? (
        <>
          <JsonLd data={structuredData} />
          <JsonLd data={breadcrumbStructuredData} />
        </>
      ) : null}
      <nav
        aria-label={t("breadcrumb")}
        className="mx-auto flex max-w-7xl flex-wrap gap-2 px-6 pt-8 text-small text-content-muted"
      >
        <a href={`/${locale}`}>Portfolio</a>
        <span aria-hidden>›</span>
        <a href={getProjectsPath(locale)}>{t("projects")}</a>
        <span aria-hidden>›</span>
        <span>{project.canonicalName}</span>
      </nav>
      <ProjectCaseStudyTemplate
        project={project}
        manifest={manifest}
        locale={locale}
        previous={previous}
        next={next}
        nextPortfolioProject={nextPortfolioProject}
        editorialBody={EditorialBody ? <EditorialBody /> : undefined}
      />
    </>
  );
}
