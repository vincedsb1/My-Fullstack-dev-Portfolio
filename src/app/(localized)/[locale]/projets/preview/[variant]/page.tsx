import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectCaseStudyPreviewPage from "../../../../../components/projects/ProjectCaseStudyPreviewPage";
import type { ProjectLocale } from "@/content/projects/types";

export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams() {
  if (process.env.NODE_ENV === "production") return [];
  return ["rich", "standard", "light"].map((variant) => ({
    locale: "fr",
    variant,
  }));
}

function getFrenchLocale(value: string): ProjectLocale {
  if (value !== "fr") notFound();
  return "fr";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; variant: string }>;
}): Promise<Metadata> {
  getFrenchLocale((await params).locale);
  return {
    title: "Fixture template — validation interne",
    robots: { index: false, follow: false },
  };
}

export default async function FrenchProjectCaseStudyPreview({
  params,
}: {
  params: Promise<{ locale: string; variant: string }>;
}) {
  const { locale: rawLocale, variant } = await params;
  return (
    <ProjectCaseStudyPreviewPage
      locale={getFrenchLocale(rawLocale)}
      variant={variant}
    />
  );
}
