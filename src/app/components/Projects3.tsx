"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type {
  ProjectCatalogEntry,
  ProjectLocale,
} from "@/content/projects/types";
import {
  getFeaturedProjects,
  getOtherProjects,
  isCaseStudyAvailable,
} from "@/content/projects/loaders";
import { getVerifiedCardVisual } from "@/content/projects/media";
import { getArchivePath, getProjectDetailPath } from "@/lib/projects/routes";
import ProjectCard from "./projects/ProjectCard";
import ProjectVisualFrame from "./projects/ProjectVisualFrame";
import { TechnologyBadges } from "./projects/TechnologyBadges";
import { ProjectIllustration } from "./projectsIllustrations";

const AUTO_PLAY_DURATION = 4000;

function FeaturedVisual({ project }: { project: ProjectCatalogEntry }) {
  if (project.id === "iconise") {
    return (
      <ProjectVisualFrame
        visual={{
          type: "illustration",
          imageId: "iconise-product-figure",
          label: project.canonicalName,
        }}
        className="h-full min-h-64 w-full"
        sizes="(max-width: 768px) 100vw, 45vw"
        priority
      />
    );
  }

  if (
    project.id === "suggst" ||
    project.id === "smartflow" ||
    project.id === "truthify"
  ) {
    return <ProjectIllustration projectId={project.id} className="w-full" />;
  }

  const cardVisual = getVerifiedCardVisual(project);
  return (
    <ProjectVisualFrame
      visual={
        cardVisual
          ? { ...cardVisual, alt: cardVisual.alt || project.canonicalName }
          : {
              type: "illustration",
              label: project.canonicalName,
            }
      }
      className="h-full min-h-64 w-full"
      sizes="(max-width: 768px) 100vw, 45vw"
      priority
    />
  );
}

function FeaturedPanel({
  project,
  locale,
  t,
}: {
  project: ProjectCatalogEntry;
  locale: ProjectLocale;
  t: ReturnType<typeof useTranslations>;
}) {
  const detailAvailable = isCaseStudyAvailable(project, locale);
  const liveUrl = project.links.live?.verified
    ? project.links.live.url
    : undefined;

  return (
    <div className="flex h-full flex-col">
      <div className="grid flex-1 gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-12">
        <div className="order-2 flex flex-col items-start md:order-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-neutral-100 px-4 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100">
              {t(`kind.${project.kind}`)}
            </span>
          </div>
          <h3 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-5xl">
            {t(project.nameKey)}
          </h3>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-lg">
            {t.rich(project.descriptionKey, {
              strong: (chunks) => <strong>{chunks}</strong>,
              break: () => <br />,
            })}
          </p>

          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            {detailAvailable ? (
              <Link
                href={getProjectDetailPath(locale, project.slug)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                {t("viewDetails")}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full bg-neutral-200 px-5 text-sm font-semibold text-neutral-500 dark:bg-neutral-700 dark:text-neutral-500"
              >
                {t("viewDetails")}
              </button>
            )}
            {liveUrl ? (
              <a
                href={liveUrl}
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
              project.id === "iconise" || project.id === "smartflow"
                ? "bg-transparent dark:bg-transparent"
                : "bg-neutral-100 dark:bg-neutral-900"
            }`}
          >
            <FeaturedVisual project={project} />
          </div>
          <div className="mt-6">
            <TechnologyBadges
              technologies={project.technologies}
              label={t("technologies")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function Projects3() {
  const t = useTranslations("projects");
  const locale = useLocale() as ProjectLocale;
  const featuredProjects = getFeaturedProjects();
  const otherProjects = getOtherProjects();
  const [[activeIndex, direction], setActive] = useState<[number, 1 | -1]>([
    0, 1,
  ]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotionPreference();
  const elapsedRef = useRef(0);

  useEffect(() => {
    AOS.init({ duration: 300 });
  }, []);

  useEffect(() => {
    const updateVisibility = () =>
      setIsPageVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  const pauseAutoplayOnHover = useCallback(() => {
    setIsHovering(true);
  }, []);

  const resumeAutoplayAfterHover = useCallback(() => {
    // Hover only pauses the RAF temporarily. Manual interactions do not
    // disable autoplay.
    setIsHovering(false);
  }, []);

  const goToIndex = useCallback(
    (nextIndex: number, nextDirection: 1 | -1) => {
      if (
        isAnimating ||
        nextIndex === activeIndex ||
        nextIndex < 0 ||
        nextIndex >= featuredProjects.length
      ) {
        return;
      }
      elapsedRef.current = 0;
      setProgress(0);
      setIsAnimating(true);
      setActive([nextIndex, nextDirection]);
    },
    [activeIndex, featuredProjects.length, isAnimating],
  );

  const handleNext = useCallback(() => {
    goToIndex((activeIndex + 1) % featuredProjects.length, 1);
  }, [activeIndex, featuredProjects.length, goToIndex]);

  const handlePrevious = useCallback(() => {
    goToIndex(
      (activeIndex - 1 + featuredProjects.length) % featuredProjects.length,
      -1,
    );
  }, [activeIndex, featuredProjects.length, goToIndex]);

  const handleNavigationKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex = index;
      let nextDirection: 1 | -1 = 1;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % featuredProjects.length;
        nextDirection = 1;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex =
          (index - 1 + featuredProjects.length) % featuredProjects.length;
        nextDirection = -1;
      } else if (event.key === "Home") {
        nextIndex = 0;
        nextDirection = -1;
      } else if (event.key === "End") {
        nextIndex = featuredProjects.length - 1;
        nextDirection = 1;
      } else {
        return;
      }

      event.preventDefault();
      goToIndex(nextIndex, nextDirection);
      window.requestAnimationFrame(() => {
        document
          .getElementById(
            `featured-project-tab-${featuredProjects[nextIndex].id}`,
          )
          ?.focus();
      });
    },
    [featuredProjects, goToIndex],
  );

  useEffect(() => {
    if (
      reducedMotion ||
      isHovering ||
      !isPageVisible ||
      isAnimating ||
      featuredProjects.length < 2
    ) {
      return;
    }

    let frame = 0;
    let lastTime = performance.now();
    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      elapsedRef.current = Math.min(
        AUTO_PLAY_DURATION,
        elapsedRef.current + delta,
      );
      const nextProgress = (elapsedRef.current / AUTO_PLAY_DURATION) * 100;
      setProgress(nextProgress);

      if (elapsedRef.current >= AUTO_PLAY_DURATION) {
        elapsedRef.current = 0;
        setProgress(0);
        setIsAnimating(true);
        setActive([(activeIndex + 1) % featuredProjects.length, 1]);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [
    activeIndex,
    featuredProjects.length,
    isAnimating,
    isHovering,
    isPageVisible,
    reducedMotion,
  ]);

  const activeProject = featuredProjects[activeIndex];
  if (!activeProject) return null;

  const slideVariants = {
    enter: (slideDirection: 1 | -1) => ({
      x: reducedMotion ? 0 : slideDirection === 1 ? "100%" : "-100%",
      opacity: reducedMotion ? 1 : 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (slideDirection: 1 | -1) => ({
      x: reducedMotion ? 0 : slideDirection === 1 ? "-100%" : "100%",
      opacity: reducedMotion ? 1 : 0,
    }),
  };

  return (
    <section
      id="projects3"
      className="w-full bg-neutral-100 py-12 dark:bg-neutral-900 md:py-24 lg:py-32"
      aria-labelledby="projectsTitle"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 w-full md:mb-14">
          <div
            className="mb-4 flex w-full flex-row items-center"
            data-aos="fade-up"
          >
            <div className="w-12" aria-hidden="true">
              <Rocket size={32} className="mr-6" />
            </div>
            <h2
              id="projectsTitle"
              className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 3xs:text-3xl"
            >
              {t("title")}
            </h2>
          </div>
          <div className="flex w-full flex-row">
            <div className="w-12" aria-hidden="true" />
            <p
              className="max-w-2xl text-sm text-neutral-500 dark:text-neutral-400 md:text-base"
              data-aos="fade-up"
            >
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div
          className="mx-auto max-w-5xl"
          data-aos="fade-up"
          onPointerEnter={pauseAutoplayOnHover}
          onPointerLeave={resumeAutoplayAfterHover}
        >
          <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-10 lg:p-12">
            <div className="relative grid min-h-[39rem] md:min-h-[33rem]">
              <AnimatePresence
                custom={direction}
                initial={false}
                mode="sync"
                onExitComplete={() => setIsAnimating(false)}
              >
                <motion.div
                  key={activeProject.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: reducedMotion ? 0 : 0.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  drag={reducedMotion ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={(
                    _: MouseEvent | TouchEvent | PointerEvent,
                    info: PanInfo,
                  ) => {
                    if (info.offset.x < -50) handleNext();
                    else if (info.offset.x > 50) handlePrevious();
                  }}
                  className="col-start-1 row-start-1 w-full cursor-grab active:cursor-grabbing"
                >
                  <FeaturedPanel
                    project={activeProject}
                    locale={locale}
                    t={t}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  aria-label={t("previousProjectAriaLabel")}
                  disabled={isAnimating}
                  className="inline-flex size-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-wait disabled:opacity-40 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <div
                  className="flex gap-2"
                  role="tablist"
                  aria-label={t("featuredNavigation")}
                >
                  {featuredProjects.map((project, index) => (
                    <button
                      key={project.id}
                      id={`featured-project-tab-${project.id}`}
                      type="button"
                      role="tab"
                      aria-selected={activeIndex === index}
                      tabIndex={activeIndex === index ? 0 : -1}
                      aria-label={`${t("goToProjectAriaLabel")} ${t(
                        project.nameKey,
                      )}`}
                      onClick={() =>
                        goToIndex(index, index > activeIndex ? 1 : -1)
                      }
                      onKeyDown={(event) =>
                        handleNavigationKeyDown(event, index)
                      }
                      aria-disabled={isAnimating}
                      className="flex size-8 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 aria-disabled:cursor-wait aria-disabled:opacity-60"
                    >
                      {activeIndex === index ? (
                        <span className="relative block size-5">
                          <span
                            role="progressbar"
                            aria-label={t("autoplayProgress")}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(progress)}
                            className={`absolute inset-0 block rounded-full transition-opacity duration-300 ease-out motion-reduce:transition-none [--progress-color:#d4d4d4] [--progress-track:#eeeeee] dark:[--progress-color:#525252] dark:[--progress-track:#707070] ${
                              isHovering ? "opacity-0" : "opacity-100"
                            }`}
                            style={{
                              background: `conic-gradient(var(--progress-color) 0deg ${
                                progress * 3.6
                              }deg, var(--progress-track) ${
                                progress * 3.6
                              }deg 360deg)`,
                            }}
                          />
                          <span
                            className="pointer-events-none absolute inset-[6px] rounded-full bg-neutral-300 dark:bg-neutral-600"
                            aria-hidden="true"
                          />
                        </span>
                      ) : (
                        <span className="block size-2 rounded-full bg-neutral-300 transition-[transform] duration-200 hover:scale-125 dark:bg-neutral-600" />
                      )}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={t("nextProjectAriaLabel")}
                  disabled={isAnimating}
                  className="inline-flex size-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-wait disabled:opacity-40 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>
              <p className="sr-only" aria-live="polite">
                {t("currentProject", { name: t(activeProject.nameKey) })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16" data-aos="fade-up">
          <div className="mb-6 mt-12 flex flex-wrap items-end justify-between gap-4 md:mt-16">
            <h3 className="text-2xl font-semibold text-neutral-950 dark:text-neutral-50 md:text-3xl">
              {t("othersTitle")}
            </h3>
            <Link
              href={getArchivePath(locale)}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-neutral-700 dark:text-neutral-100 dark:hover:text-red-400"
            >
              {t("archives")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects3;
