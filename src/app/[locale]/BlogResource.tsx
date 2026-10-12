"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export interface BlogHomeArticle {
  locale: "fr" | "en";
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  image: string;
  readingMinutes: number;
}

export default function BlogResource({
  article,
}: {
  article: BlogHomeArticle | null;
}) {
  const t = useTranslations("blogHome");
  const locale = useLocale();

  return (
    <section
      aria-labelledby="blog-resource-title"
      className="w-full rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800 sm:p-8"
    >
      <div className="mb-6 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          {t("eyebrow")}
        </p>
        <h2
          id="blog-resource-title"
          className="mb-3 text-xl font-bold text-neutral-900 dark:text-neutral-50 sm:text-2xl"
        >
          {t("title")}
        </h2>
        <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          {t("description")}
        </p>
        {locale === "en" && article?.locale !== "en" ? (
          <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {t("frenchNotice")}
          </p>
        ) : null}
      </div>

      {article ? (
        <article className="mb-6 grid gap-5 border-t border-neutral-200 pt-6 dark:border-neutral-700 sm:grid-cols-[180px_1fr] sm:items-center">
          <div className="relative aspect-[1200/630] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, 180px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              {article.category}
            </p>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              {article.title}
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {article.excerpt}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
                dateStyle: "long",
                timeZone: "UTC",
              }).format(new Date(`${article.publishedAt}T00:00:00.000Z`))}
              {" · "}
              {article.readingMinutes} min
            </p>
            <Link
              href={`/${article.locale}/blog/${article.slug}`}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 underline-offset-4 hover:text-red-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:text-white dark:hover:text-red-400"
            >
              {article.locale === "en"
                ? "Read article"
                : locale === "en"
                ? "Read this French article"
                : "Lire l’article"}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </article>
      ) : null}

      <Link
        href={`/${article?.locale ?? "fr"}/blog`}
        className="inline-flex items-center gap-2 font-semibold text-neutral-900 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-4 dark:text-white dark:hover:text-red-400 dark:focus-visible:ring-offset-neutral-800"
      >
        {article?.locale === "en" && locale === "en"
          ? "Read all articles"
          : t("link")}
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </section>
  );
}
