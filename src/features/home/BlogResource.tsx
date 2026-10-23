import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import styles from "./BlogResource.module.css";

export interface BlogHomeArticle {
  locale: "fr" | "en";
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  image: string;
  hasCover: boolean;
  readingMinutes: number;
}

function ArticleCard({
  article,
  featured,
  locale,
}: {
  article: BlogHomeArticle;
  featured: boolean;
  locale: string;
}) {
  const readLabel =
    article.locale === "en"
      ? "Read article"
      : locale === "en"
      ? "Read this French article"
      : "Lire l’article";

  return (
    <article className="h-full">
      <Link
        href={`/${article.locale}/blog/${article.slug}`}
        className={`group flex h-full min-w-0 flex-col rounded-[2rem] border border-neutral-200/70 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.01)] transition-[transform,box-shadow,border-color] duration-300 hover:border-neutral-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.02)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4 motion-safe:hover:-translate-y-1 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:focus-visible:ring-offset-neutral-900 ${
          featured ? "gap-6 p-5 sm:p-8 md:flex-row md:gap-8" : "gap-6 p-5"
        }`}
      >
        <div
          className={`relative isolate aspect-[1200/630] shrink-0 overflow-hidden ${
            featured
              ? "rounded-3xl md:aspect-auto md:min-h-[300px] md:w-[46%]"
              : "rounded-[1.25rem]"
          } ${
            article.hasCover
              ? "bg-neutral-100 dark:bg-neutral-800"
              : "bg-neutral-900"
          }`}
        >
          <Image
            src={article.image}
            alt=""
            fill
            sizes={
              featured
                ? "(max-width: 767px) calc(100vw - 96px), (max-width: 1024px) 42vw, 430px"
                : "(max-width: 639px) calc(100vw - 72px), (max-width: 1024px) 42vw, 285px"
            }
            className={`transition-transform duration-700 ease-out motion-safe:group-hover:scale-105 ${
              article.hasCover ? "object-cover" : "object-contain"
            }`}
          />
        </div>

        <div
          className={`flex min-w-0 flex-1 flex-col ${
            featured ? "justify-center py-2 md:py-4" : "px-2 pb-3"
          }`}
        >
          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="rounded-full border border-neutral-200/60 bg-neutral-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-700 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
              {article.category}
            </span>
            <p className="text-xs font-medium leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-sm">
              <time dateTime={article.publishedAt}>
                {new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                }).format(new Date(`${article.publishedAt}T00:00:00.000Z`))}
              </time>
              {" · "}
              {article.readingMinutes}{" "}
              {locale === "fr" ? "min de lecture" : "min read"}
            </p>
          </div>
          <h3
            lang={article.locale}
            className="mb-4 text-2xl font-semibold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-red-600 dark:text-neutral-50 dark:group-hover:text-red-400"
          >
            {article.title}
          </h3>
          <p
            lang={article.locale}
            className={`mb-8 leading-relaxed ${
              featured
                ? "text-base font-light text-gray-600 dark:text-gray-400 md:text-lg"
                : "flex-1 text-sm text-neutral-600 dark:text-neutral-300"
            }`}
          >
            {article.excerpt}
          </p>
          <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-neutral-100">
            {readLabel}
            <ArrowRight
              aria-hidden="true"
              size={18}
              className="transition-transform duration-300 motion-safe:group-hover:translate-x-1.5"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}

export default async function BlogResource({
  articles,
}: {
  articles: BlogHomeArticle[];
}) {
  const t = await getTranslations("blogHome");
  const locale = await getLocale();
  const visibleArticles = articles.slice(0, 1);

  return (
    <section
      aria-labelledby="blog-resource-title"
      className={`${styles.section} w-full`}
    >
      <header className="mb-10 md:mb-14">
        <div
          className="mb-4 flex items-center text-neutral-700 dark:text-neutral-300"
          data-reveal
        >
          <div className="w-12 shrink-0" aria-hidden="true">
            <BookOpen size={32} />
          </div>
          <h2
            id="blog-resource-title"
            className="text-2xl font-bold tracking-tight 3xs:text-3xl"
          >
            {t("title")}
          </h2>
        </div>
        <div className="pl-12" data-reveal>
          <p className="max-w-2xl text-base font-light leading-relaxed text-[#707070] dark:text-neutral-400 md:text-lg">
            {t("description")}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {visibleArticles.map((article, index) => (
          <div
            key={`${article.locale}/${article.slug}`}
            className={index === 0 ? "sm:col-span-2 lg:col-span-3" : "min-w-0"}
            data-reveal
            data-reveal-delay={index === 0 ? 0 : (index - 1) * 60}
          >
            <ArticleCard
              article={article}
              featured={index === 0}
              locale={locale}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 flex sm:mt-14" data-reveal>
        <Link
          href={`/${locale}/blog`}
          className="group inline-flex items-center gap-3 rounded-lg text-base font-semibold text-gray-900 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4 dark:text-neutral-100 dark:hover:text-red-400 dark:focus-visible:ring-offset-neutral-900"
        >
          {t("link")}
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm transition-[transform,border-color,box-shadow] duration-300 group-hover:border-neutral-400 group-hover:shadow-md motion-safe:group-hover:scale-105 dark:border-neutral-700 dark:bg-neutral-800 dark:group-hover:border-neutral-500">
            <ArrowRight
              aria-hidden="true"
              size={20}
              className="transition-transform duration-300 motion-safe:group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      </div>
    </section>
  );
}
