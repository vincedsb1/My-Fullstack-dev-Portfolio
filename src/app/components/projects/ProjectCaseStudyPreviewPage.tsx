import { notFound } from "next/navigation";
import { getProjectFixture } from "@/content/projects/fixtures";
import type {
  ProjectCatalogEntry,
  ProjectLocale,
} from "@/content/projects/types";
import ProjectCaseStudyTemplate from "./ProjectCaseStudyTemplate";

const fixtureProject: ProjectCatalogEntry = {
  id: "allaw",
  slug: "__fixture",
  canonicalName: "Template fixture",
  nameKey: "allaw.name",
  descriptionKey: "allaw.description",
  portfolioVisibility: "hidden",
  placement: "featured",
  order: 0,
  kind: "platform",
  maturity: "not-audited",
  technologies: ["nextjs", "typescript", "tailwind"],
  links: {},
  caseStudyByLocale: {},
  evidence: { sourceFiles: [] },
};

export default function ProjectCaseStudyPreviewPage({
  locale,
  variant,
}: {
  locale: ProjectLocale;
  variant: string;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const fixture = getProjectFixture(locale, variant);
  if (!fixture) notFound();

  return (
    <ProjectCaseStudyTemplate
      project={{ ...fixtureProject, canonicalName: fixture.meta.title }}
      manifest={fixture}
      locale={locale}
      preview
    />
  );
}
