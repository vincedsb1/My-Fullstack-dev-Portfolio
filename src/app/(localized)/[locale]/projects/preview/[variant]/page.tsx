import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectCaseStudyPreviewPage from "../../../../../../features/projects/ProjectCaseStudyPreviewPage";
import type { ProjectLocale } from "@/content/projects/types";

export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams() {
  if (process.env.NODE_ENV === "production") return [];
  return ["rich", "standard", "light"].map((variant) => ({
    locale: "en",
    variant,
  }));
}

function getEnglishLocale(value: string): ProjectLocale {
  if (value !== "en" && value !== "fr") notFound();
  return value;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; variant: string }>;
}): Promise<Metadata> {
  getEnglishLocale((await params).locale);
  return {
    title: "Template fixture — internal validation",
    robots: { index: false, follow: false },
  };
}

export default async function EnglishProjectCaseStudyPreview({
  params,
}: {
  params: Promise<{ locale: string; variant: string }>;
}) {
  const { locale: rawLocale, variant } = await params;
  return (
    <ProjectCaseStudyPreviewPage
      locale={getEnglishLocale(rawLocale)}
      variant={variant}
    />
  );
}
