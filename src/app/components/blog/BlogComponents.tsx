import Image from "next/image";
import Link from "next/link";
import type { BlogArticleRecord, BlogLocale } from "@/lib/blog/articles";
import { getArticleSocialImagePath } from "@/lib/blog/articles";
import ShareButtons from "./ShareButtons";
import ThemeToggle from "./ThemeToggle";

export function formatBlogDate(date: string, locale: BlogLocale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function BlogSiteNavigation({ locale }: { locale: BlogLocale }) {
  return (
    <header className="border-b border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-950/90">
      <nav
        className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
        aria-label={
          locale === "fr" ? "Navigation principale" : "Main navigation"
        }
      >
        <Link
          href={`/${locale}`}
          className="font-semibold tracking-tight text-neutral-900 transition-colors hover:text-red-600 dark:text-neutral-100 dark:hover:text-red-400"
        >
          Vincent DESBROSSES
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/blog`}
            className="rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:text-neutral-200 dark:hover:text-red-400"
          >
            Blog
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

export function ArticleBreadcrumbs({
  article,
}: {
  article: BlogArticleRecord;
}) {
  const { locale, title } = article.metadata;
  return (
    <nav
      aria-label={locale === "fr" ? "Fil d’Ariane" : "Breadcrumb"}
      className="mb-8 text-sm text-neutral-500 dark:text-neutral-400"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            className="underline-offset-4 hover:text-red-600 hover:underline dark:hover:text-red-400"
            href={`/${locale}`}
          >
            Portfolio
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            className="underline-offset-4 hover:text-red-600 hover:underline dark:hover:text-red-400"
            href={`/${locale}/blog`}
          >
            Blog
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li
          aria-current="page"
          className="max-w-full truncate text-neutral-700 dark:text-neutral-200"
        >
          <span>{title}</span>
        </li>
      </ol>
    </nav>
  );
}

export function BlogCard({
  article,
  readingMinutes,
}: {
  article: BlogArticleRecord;
  readingMinutes: number;
}) {
  const { metadata } = article;
  const image = metadata.cover ?? getArticleSocialImagePath(metadata);

  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg hover:shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-black/20">
      <Link
        href={`/${metadata.locale}/blog/${metadata.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-600"
      >
        <div className="relative aspect-[1200/630] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={image}
            alt={metadata.coverAlt ?? metadata.title}
            fill
            sizes="(max-width: 700px) 100vw, 680px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none"
          />
        </div>
        <div className="p-5 sm:p-7">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-[0.12em] text-red-600 dark:text-red-400">
            <span>{metadata.category}</span>
            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-current"
            />
            <time dateTime={metadata.publishedAt}>
              {formatBlogDate(metadata.publishedAt, metadata.locale)}
            </time>
          </div>
          <h2 className="mb-3 text-xl font-semibold leading-snug tracking-tight text-neutral-900 group-hover:text-red-700 dark:text-neutral-100 dark:group-hover:text-red-300 sm:text-2xl">
            {metadata.title}
          </h2>
          <p className="mb-5 leading-relaxed text-neutral-600 dark:text-neutral-300">
            {metadata.excerpt}
          </p>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {metadata.locale === "fr"
              ? `${readingMinutes} min de lecture`
              : `${readingMinutes} min read`}
          </span>
        </div>
      </Link>
    </article>
  );
}

export function ArticleHeader({
  article,
  readingMinutes,
}: {
  article: BlogArticleRecord;
  readingMinutes: number;
}) {
  const { metadata } = article;
  const image = metadata.cover ?? getArticleSocialImagePath(metadata);

  return (
    <header className="mb-10 sm:mb-14">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-red-600 dark:text-red-400">
        {metadata.category}
      </p>
      <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-neutral-950 dark:text-white sm:text-5xl">
        {metadata.title}
      </h1>
      <p className="mb-7 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-xl">
        {metadata.excerpt}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-neutral-200 py-4 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
          Vincent DESBROSSES
        </span>
        <span aria-hidden="true">·</span>
        <time dateTime={metadata.publishedAt}>
          {formatBlogDate(metadata.publishedAt, metadata.locale)}
        </time>
        {metadata.updatedAt && metadata.updatedAt !== metadata.publishedAt ? (
          <>
            <span aria-hidden="true">·</span>
            <span>
              {metadata.locale === "fr" ? "Mis à jour le " : "Updated "}
              {formatBlogDate(metadata.updatedAt, metadata.locale)}
            </span>
          </>
        ) : null}
        <span aria-hidden="true">·</span>
        <span>
          {metadata.locale === "fr"
            ? `${readingMinutes} min de lecture`
            : `${readingMinutes} min read`}
        </span>
      </div>
      <div className="relative mt-8 aspect-[1200/630] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={image}
          alt={metadata.coverAlt ?? metadata.title}
          fill
          priority
          sizes="(max-width: 760px) 100vw, 760px"
          className="object-cover"
        />
      </div>
    </header>
  );
}

export function ArticleFooter({ article }: { article: BlogArticleRecord }) {
  return (
    <footer className="mt-14 border-t border-neutral-200 pt-7 dark:border-neutral-800">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ShareButtons title={article.metadata.title} />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
          <Link
            href={`/${article.metadata.locale}/blog`}
            className="text-neutral-700 underline-offset-4 hover:text-red-600 hover:underline dark:text-neutral-200 dark:hover:text-red-400"
          >
            {article.metadata.locale === "fr"
              ? "Tous les articles"
              : "All articles"}
          </Link>
          <Link
            href={`/${article.metadata.locale}`}
            className="text-neutral-700 underline-offset-4 hover:text-red-600 hover:underline dark:text-neutral-200 dark:hover:text-red-400"
          >
            Portfolio
          </Link>
        </div>
      </div>
    </footer>
  );
}
