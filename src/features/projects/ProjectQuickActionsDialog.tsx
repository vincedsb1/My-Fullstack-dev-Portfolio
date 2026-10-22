"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import type { ProjectCardModel } from "@/content/projects/view-models";
import ProjectVisualFrame from "./ProjectVisualFrame";
import styles from "./ProjectQuickActionsDialog.module.css";

export default function ProjectQuickActionsDialog({
  project: p,
  labels,
  open,
  onClose,
}: {
  project: ProjectCardModel;
  labels: Record<string, string>;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClose={onClose}
      aria-labelledby={`project-dialog-title-${p.id}`}
      className={`${styles.panel} fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-6 text-neutral-900 shadow-2xl backdrop:bg-neutral-950/65 backdrop:backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 sm:p-8`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const elements = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = elements[0];
        const last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-neutral-800 dark:hover:text-white"
        aria-label={labels.closeDialog}
      >
        <X size={20} aria-hidden="true" />
      </button>
      <div className="mb-6 max-w-[calc(100%-3rem)]">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
          {labels.projectActions}
        </p>
        <h2
          id={`project-dialog-title-${p.id}`}
          className="text-3xl font-bold tracking-tight"
        >
          {p.name}
        </h2>
      </div>
      <div
        className={`mb-6 rounded-2xl ${
          p.cardVisual.type === "image" || p.cardVisual.type === "mockup"
            ? "aspect-[16/9] overflow-hidden"
            : "p-4"
        }`}
      >
        <ProjectVisualFrame
          visual={p.cardVisual}
          className="h-full w-full"
          sizes="(max-width: 640px) 100vw, 448px"
        />
      </div>
      <div className="grid gap-3">
        {p.detailHref ? (
          <a
            href={p.detailHref}
            onClick={onClose}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {labels.viewDetails}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full bg-neutral-200 px-5 text-sm font-semibold text-neutral-500 dark:bg-neutral-800"
          >
            {labels.viewDetails}
          </button>
        )}
        {p.liveUrl && (
          <a
            href={p.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold text-neutral-800 transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-neutral-700 dark:text-neutral-100 dark:hover:text-red-400"
          >
            {labels.accessProject}
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        )}
        {p.githubUrl && (
          <a
            href={p.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold text-neutral-800 transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-neutral-700 dark:text-neutral-100 dark:hover:text-red-400"
          >
            <GithubLogoIcon size={16} aria-hidden="true" />
            {labels.viewOnGithub}
          </a>
        )}
      </div>
    </dialog>
  );
}
