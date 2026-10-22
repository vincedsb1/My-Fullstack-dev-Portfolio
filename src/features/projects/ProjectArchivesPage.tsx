import { ArrowLeft, Archive } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ProjectLocale } from "@/content/projects/types";
import { getArchiveModels } from "@/content/projects/view-models";
import { getPortfolioPath } from "@/lib/projects/routes";
import ProjectArchiveGrid from "./ProjectArchiveGrid";

export default async function ProjectArchivesPage({
  locale,
}: {
  locale: ProjectLocale;
}) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const projects = await getArchiveModels(locale);

  return (
    <main
      id="main"
      className="min-h-screen bg-neutral-100 px-4 py-16 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={getPortfolioPath(locale)}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:border-red-500 hover:text-red-600    dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:text-red-400"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {t("backToPortfolio")}
          </Link>
          <span className="inline-flex items-center gap-2 text-sm text-content-muted dark:text-content-subtle">
            <Archive size={17} aria-hidden="true" />
            {t("archiveCount", { count: projects.length })}
          </span>
        </div>

        <header className="mb-14 max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {t("archives")}
          </p>
          <h1 className="text-5xl font-extrabold tracking-[-0.055em] text-gradient sm:text-6xl md:text-7xl">
            {t("archivesTitle")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-600 dark:text-content-subtle md:text-xl">
            {t("archivesIntro")}
          </p>
        </header>

        <ProjectArchiveGrid projects={projects} />
      </div>
    </main>
  );
}
