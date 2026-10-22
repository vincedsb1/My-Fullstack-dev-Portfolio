import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShowcase from "@/features/blog/design-system/BlogShowcase";

// Route de revue graphique volontairement hors catalogue, sitemap et index.
// La page est consultable par URL directe, mais n'est pas destinée au SEO.
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export const metadata: Metadata = {
  title: "Blog Showcase — Design system éditorial | Vincent DESBROSSES",
  description: "Page interne de référence pour les composants du blog.",
  robots: { index: false, follow: false },
};

export default async function BlogShowcasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "fr") notFound();
  return <BlogShowcase />;
}
