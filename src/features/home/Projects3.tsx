import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, Rocket } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { ProjectCardModel } from "@/content/projects/view-models";
import { getArchivePath } from "@/lib/projects/routes";
import ProjectCard from "@/features/projects/ProjectCard";
import ProjectVisualFrame from "@/features/projects/ProjectVisualFrame";
import { TechnologyBadges } from "@/features/projects/TechnologyBadges";
import FeaturedCarousel from "@/features/projects/FeaturedCarousel";

export default async function Projects({
  featured,
  others,
}: {
  featured: ProjectCardModel[];
  others: ProjectCardModel[];
}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("projects");
  return (
    <section
      id="projects3"
      className="w-full bg-neutral-100 py-12 dark:bg-neutral-900 md:py-24 lg:py-32"
      aria-labelledby="projectsTitle"
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav aria-label={t("title")} className="sr-only">
          {featured.concat(others).map((project) =>
            project.detailHref ? (
              <a key={project.id} href={project.detailHref}>
                {project.name}
              </a>
            ) : null,
          )}
        </nav>
        <div className="mb-10 w-full md:mb-14">
          <div
            className="mb-4 flex w-full flex-row items-center text-neutral-700 dark:text-neutral-300"
            data-reveal
          >
            <div className="w-12 shrink-0" aria-hidden="true">
              <Rocket size={32} className="mr-6" />
            </div>
            <h2
              id="projectsTitle"
              className="text-2xl font-bold tracking-tight 3xs:text-3xl"
            >
              {t("title")}
            </h2>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-12 shrink-0" aria-hidden="true" />
            <p
              className="max-w-2xl text-base font-light leading-relaxed text-[#707070] dark:text-neutral-400 md:text-lg"
              data-reveal
            >
              {t("subtitle")}
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-5xl" data-reveal>
          <FeaturedCarousel
            ids={featured.map((p) => p.id)}
            names={featured.map((p) => p.name)}
            labels={Object.fromEntries(
              [
                "previousProjectAriaLabel",
                "nextProjectAriaLabel",
                "featuredNavigation",
                "goToProjectAriaLabel",
                "autoplayProgress",
                "currentProject",
              ].map((k) => [k, k === "currentProject" ? t.raw(k) : t(k)]),
            )}
          >
            {featured.map((p) => (
              <div key={p.id} className="flex h-full flex-col">
                <div className="grid flex-1 gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-12">
                  <div className="order-2 flex flex-col items-start md:order-1">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className="inline-flex rounded-full bg-neutral-100 px-4 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                        {p.kindLabel}
                      </span>
                    </div>
                    <h3 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
                      {p.name}
                    </h3>
                    {p.carouselDescriptionKey ? (
                      <div className="mt-5 max-w-xl space-y-5 text-base font-light leading-relaxed text-gray-600 dark:text-gray-400 md:text-lg">
                        {t.rich(p.carouselDescriptionKey, {
                          paragraph: (chunks) => <p>{chunks}</p>,
                          strong: (chunks) => (
                            <strong className="font-medium text-gray-900 dark:text-neutral-100">
                              {chunks}
                            </strong>
                          ),
                          break: () => <br />,
                        })}
                      </div>
                    ) : (
                      <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-gray-600 dark:text-gray-400 md:text-lg">
                        {p.featuredDescription}
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap gap-3 pt-8">
                      {p.detailHref ? (
                        <a
                          href={p.detailHref}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                          {t("viewDetails")}
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full bg-neutral-200 px-5 text-sm font-semibold text-neutral-500 dark:bg-neutral-700"
                        >
                          {t("viewDetails")}
                        </button>
                      )}
                      {p.liveUrl ? (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold text-neutral-800 transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-neutral-700 dark:text-neutral-100 dark:hover:text-red-400"
                        >
                          {t("accessProject")}
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <div className="order-1 flex min-w-0 flex-col md:order-2">
                    <div
                      className={`relative min-h-64 flex-1 overflow-hidden rounded-[1.5rem] ${
                        p.transparent
                          ? "bg-transparent dark:bg-transparent"
                          : "bg-neutral-100 dark:bg-neutral-900"
                      }`}
                    >
                      <ProjectVisualFrame
                        visual={p.visual}
                        className="h-full min-h-64 w-full"
                        sizes="(max-width: 768px) 100vw, 45vw"
                        priority
                      />
                    </div>
                    <div className="mt-6">
                      <TechnologyBadges
                        technologies={p.technologies}
                        label={t("technologies")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </FeaturedCarousel>
        </div>
        <div className="mt-16" data-reveal>
          <div className="mb-6 mt-12 flex flex-wrap items-end justify-between gap-4 md:mt-16">
            <h3 className="text-2xl font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
              {t("othersTitle")}
            </h3>
            <a
              href={getArchivePath(locale)}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-neutral-700 dark:text-neutral-100 dark:hover:text-red-400"
            >
              {t("archives")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                typography="home"
                labels={Object.fromEntries(
                  [
                    "openActions",
                    "closeDialog",
                    "projectActions",
                    "viewDetails",
                    "accessProject",
                    "viewOnGithub",
                  ].map((k) => [k, t(k)]),
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
