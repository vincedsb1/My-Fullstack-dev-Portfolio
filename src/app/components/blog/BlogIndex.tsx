import type { BlogArticleRecord } from "@/lib/blog/articles";
import { getArticleReadingTime, type BlogLocale } from "@/lib/blog/articles";
import type { BlogIndexSeo } from "@/lib/blog/index-metadata";
import { BlogCard, BlogSiteNavigation } from "./BlogComponents";

export default function BlogIndex({
  articles,
  locale,
  seo,
}: {
  articles: BlogArticleRecord[];
  locale: BlogLocale;
  seo: BlogIndexSeo;
}) {
  const content =
    locale === "fr"
      ? {
          eyebrow: "Articles et conseils",
          articles: "Articles publiés",
          empty: "Les prochains articles paraîtront ici.",
        }
      : {
          eyebrow: "Articles and advice",
          articles: "Published articles",
          empty: "New articles will appear here.",
        };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <BlogSiteNavigation locale={locale} />
      <main
        aria-labelledby="blog-index-title"
        className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 sm:py-20"
      >
        <header className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-red-600 dark:text-red-400">
            {content.eyebrow}
          </p>
          <h1
            id="blog-index-title"
            className="mb-5 text-4xl font-bold tracking-tight 2xs:text-5xl sm:text-6xl"
          >
            {seo.heading}
          </h1>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
            {seo.introduction}
          </p>
        </header>

        {articles.length > 0 ? (
          <section aria-label={content.articles} className="grid gap-6">
            {articles.map((article) => (
              <BlogCard
                key={`${article.metadata.locale}/${article.metadata.slug}`}
                article={article}
                readingMinutes={getArticleReadingTime(article)}
              />
            ))}
          </section>
        ) : (
          <p className="rounded-xl border border-neutral-200 p-6 text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
            {content.empty}
          </p>
        )}
      </main>
    </div>
  );
}
