import { notFound } from "next/navigation";
import type { ProjectLocale } from "@/content/projects/types";
import {
  getAvailableCaseStudy,
  getNextPortfolioProject,
  getProjectFromCatalog,
  getPublishedNeighbors,
} from "@/content/projects/loaders";
import { loadProjectCaseStudyBody } from "@/content/projects/mdx";
import { getArchivePath, getProjectDetailPath } from "@/lib/projects/routes";
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
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";
  const url = `${baseUrl}${getProjectDetailPath(locale, project.slug)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: manifest.seo.title,
    description: manifest.seo.description,
    url,
    inLanguage: locale === "fr" ? "fr-FR" : "en",
    author: {
      "@type": "Person",
      name: "Vincent DESBROSSES",
      url: `${baseUrl}/${locale}`,
    },
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
        name: locale === "fr" ? "Portfolio" : "Portfolio",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "fr" ? "Projets" : "Projects",
        item: `${baseUrl}${getArchivePath(locale)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.canonicalName,
        item: url,
      },
    ],
  };
  const serialize = (data: object) =>
    JSON.stringify(data).replace(/</g, "\\u003c");

  const isIndexable = manifest.status === "published" && !manifest.seo.noindex;

  return (
    <>
      {isIndexable ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serialize(structuredData) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serialize(breadcrumbStructuredData),
            }}
          />
        </>
      ) : null}
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
