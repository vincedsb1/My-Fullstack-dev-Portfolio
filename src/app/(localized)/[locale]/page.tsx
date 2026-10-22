import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PERSON_ID, WEBSITE_ID } from "@/lib/seo/schema";
import { AUTHOR, SOCIAL_LINKS, SITE_NAME, absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomeProjects } from "@/content/projects/view-models";
import {
  getPublishedArticles,
  getArticleReadingTime,
  getArticleSocialImagePath,
} from "@/lib/blog/articles";
import Hero from "@/features/home/Header";
import Skills from "@/features/home/Skills";
import Projects from "@/features/home/Projects3";
import BlogResource from "@/features/home/BlogResource";
import Timeline from "@/features/home/Timeline";
import FAQ from "@/features/home/FAQ";
import Reveal from "@/components/motion/Reveal";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildPageMetadata({
    locale,
    path: `/${locale}`,
    title: t("title"),
    description: t("description"),
    alternates: { fr: "/fr", en: "/en" },
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  setRequestLocale(locale);
  const projects = await getHomeProjects(locale);
  const local = getPublishedArticles(locale);
  const blogArticles = (local.length ? local : getPublishedArticles("fr"))
    .slice(0, 1)
    .map((a) => ({
      locale: a.metadata.locale,
      slug: a.metadata.slug,
      title: a.metadata.title,
      excerpt: a.metadata.excerpt,
      category: a.metadata.category,
      publishedAt: a.metadata.publishedAt,
      image: a.metadata.cover ?? getArticleSocialImagePath(a.metadata),
      readingMinutes: getArticleReadingTime(a),
    }));
  const t = await getTranslations("header");
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: absoluteUrl("/"),
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: AUTHOR.name,
        url: absoluteUrl(`/${locale}`),
        jobTitle: `${t("jobTitleStart")} · ${t("jobTitleEnd")}`,
        description: `${t("descriptionStart")}${t("descriptionHighlight")}${t(
          "descriptionEnd",
        )}`,
        image: absoluteUrl("/pp.jpg"),
        sameAs: [
          SOCIAL_LINKS.linkedin.fr,
          SOCIAL_LINKS.github,
          SOCIAL_LINKS.x,
          SOCIAL_LINKS.malt,
        ],
        knowsAbout: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL"],
      },
      {
        "@type": "ProfilePage",
        "@id": absoluteUrl(`/${locale}#profile`),
        url: absoluteUrl(`/${locale}`),
        mainEntity: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: locale,
      },
    ],
  };
  return (
    <>
      <JsonLd data={graph} />
      <main id="main">
        <Hero />
        <Reveal className="bg-neutral-100 dark:bg-neutral-900">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-16 flex w-full flex-col items-center pt-16 sm:mb-32 sm:pt-24">
              <Skills />
            </div>
            <div className="mb-16 flex w-full flex-col items-center sm:mb-32">
              <Projects {...projects} />
            </div>
            <div className="mb-16 flex w-full flex-col items-center px-4 sm:mb-32 md:px-6">
              <BlogResource articles={blogArticles} />
            </div>
            <div className="mb-16 flex w-full flex-col items-center sm:mb-32">
              <Timeline />
            </div>
            <div className="flex w-full flex-col items-center pb-16 sm:pb-32">
              <FAQ />
            </div>
          </div>
        </Reveal>
      </main>
    </>
  );
}
