"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, X } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import type {
  ProjectCatalogEntry,
  ProjectLocale,
} from "@/content/projects/types";
import { isCaseStudyAvailable } from "@/content/projects/loaders";
import { getVerifiedCardVisual } from "@/content/projects/media";
import { getProjectDetailPath } from "@/lib/projects/routes";
import ProjectVisualFrame from "./ProjectVisualFrame";

function getFocusable(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export default function ProjectQuickActionsDialog({
  project,
  open,
  onClose,
}: {
  project: ProjectCatalogEntry;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("projects");
  const locale = useLocale() as ProjectLocale;
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);
  const detailAvailable = isCaseStudyAvailable(project, locale);
  const cardVisual = getVerifiedCardVisual(project);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        previousFocus.current?.focus();
        previousFocus.current = null;
        wasOpen.current = false;
      }
      return;
    }

    wasOpen.current = true;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const focusable = getFocusable(dialogRef.current);
    window.setTimeout(() => focusable[0]?.focus(), 0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const elements = getFocusable(dialogRef.current);
      if (elements.length === 0) {
        event.preventDefault();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-neutral-950/65 p-4 backdrop-blur-sm sm:items-center"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            id={`project-dialog-${project.id}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-dialog-title-${project.id}`}
            className="relative w-full max-w-md rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-6 text-neutral-900 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 sm:p-8"
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-neutral-800 dark:hover:text-white"
              aria-label={t("closeDialog")}
            >
              <X size={20} aria-hidden="true" />
            </button>

            <div className="mb-6 max-w-[calc(100%-3rem)]">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                {t("projectActions")}
              </p>
              <h2
                id={`project-dialog-title-${project.id}`}
                className="text-3xl font-bold tracking-tight"
              >
                {t(project.nameKey)}
              </h2>
            </div>

            {cardVisual || project.illustration ? (
              <div className="mb-6 aspect-[16/9] overflow-hidden rounded-2xl">
                <ProjectVisualFrame
                  visual={
                    cardVisual
                      ? {
                          ...cardVisual,
                          alt: cardVisual.alt || project.canonicalName,
                        }
                      : {
                          type: "illustration",
                          label: project.canonicalName,
                        }
                  }
                  className="h-full w-full"
                  sizes="(max-width: 640px) 100vw, 448px"
                />
              </div>
            ) : null}

            <div className="grid gap-3">
              {detailAvailable ? (
                <Link
                  href={getProjectDetailPath(locale, project.slug)}
                  onClick={onClose}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  {t("viewDetails")}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-neutral-200 px-5 text-sm font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500"
                >
                  {t("viewDetails")}
                </button>
              )}

              {project.links.live?.verified ? (
                <a
                  href={project.links.live.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold text-neutral-800 transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-neutral-700 dark:text-neutral-100 dark:hover:text-red-400"
                >
                  {t("accessProject")}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              ) : null}

              {project.links.github?.verified ? (
                <a
                  href={project.links.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold text-neutral-800 transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-neutral-700 dark:text-neutral-100 dark:hover:text-red-400"
                >
                  <Github size={16} aria-hidden="true" />
                  {t("viewOnGithub")}
                </a>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
