import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectArchivesPage from "../../../../components/projects/ProjectArchivesPage";
import { getArchivePath } from "@/lib/projects/routes";
import type { ProjectLocale } from "@/content/projects/types";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

function getEnglishLocale(value: string): ProjectLocale {
  if (value !== "en") notFound();
  return "en";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = getEnglishLocale((await params).locale);
  const title = "Project archive | Vincent DESBROSSES";
  const description =
    "Explore eight additional projects from Vincent DESBROSSES’ portfolio.";
  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${getArchivePath(locale)}`,
      languages: {
        fr: `${baseUrl}${getArchivePath("fr")}`,
        en: `${baseUrl}${getArchivePath("en")}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${getArchivePath(locale)}`,
      siteName: "Vincent DESBROSSES",
      type: "website",
      locale: "en_US",
      images: [
        { url: `${baseUrl}/pp.jpg`, width: 1084, height: 1084, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/pp.jpg`],
    },
  };
}

export default async function EnglishProjectArchives({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getEnglishLocale((await params).locale);
  return <ProjectArchivesPage locale={locale} />;
}
