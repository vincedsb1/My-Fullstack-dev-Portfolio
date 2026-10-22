import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  readAllJsonBlogArticles,
  getJsonReadingText,
} from "@/lib/blog/json-source.mjs";
import { estimateReadingTime } from "@/lib/blog/reading-time";
import JsonArticlePage from "@/features/blog/json/JsonArticlePage";
import { getPublishedArticles } from "@/lib/blog/articles";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}
export const metadata: Metadata = {
  title: "Prévisualisation JSON du blog (développement)",
  robots: { index: false, follow: false },
};
export default async function JsonPreview({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ slug?: string | string[] }>;
}) {
  // En production, sortir avant toute lecture des données ou de la query.
  if (process.env.NODE_ENV === "production") notFound();
  const { locale } = await params;
  if (locale !== "fr" && locale !== "en") notFound();
  const slug = (await searchParams).slug ?? "json-demo-blog";
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    notFound();
  const fixture = readAllJsonBlogArticles().find(
    (record) =>
      record.metadata.locale === locale && record.metadata.slug === slug,
  );
  if (!fixture) notFound();
  const published = getPublishedArticles(locale);
  return (
    <JsonArticlePage
      article={fixture.data}
      readingMinutes={estimateReadingTime(getJsonReadingText(fixture.data))}
      related={published
        .filter(
          (record) =>
            fixture.data.related?.slugs.includes(record.metadata.slug),
        )
        .map((record) => ({
          slug: record.metadata.slug,
          title: record.metadata.title,
        }))}
    />
  );
}
