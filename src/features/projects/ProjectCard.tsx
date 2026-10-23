"use client";

import { useState } from "react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import type { ProjectCardModel } from "@/content/projects/view-models";
import ProjectVisualFrame from "./ProjectVisualFrame";
import { TechnologyBadges } from "./TechnologyBadges";
import ProjectQuickActionsDialog from "./ProjectQuickActionsDialog";

export default function ProjectCard({
  project: p,
  labels,
  typography = "default",
}: {
  project: ProjectCardModel;
  labels: Record<string, string>;
  typography?: "default" | "home";
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SpotlightCard
        className="group flex h-full flex-col p-5 md:p-6"
        data-project-card
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-full cursor-pointer flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-neutral-900"
          aria-haspopup="dialog"
          aria-label={`${labels.openActions}: ${p.name}`}
        >
          <div className="flex-grow">
            <div
              className={`mb-3 flex flex-wrap items-start justify-between gap-3 ${
                typography === "default" ? "sm:flex-nowrap" : ""
              }`}
            >
              <h3
                className={`min-w-0 text-2xl font-semibold tracking-tight ${
                  typography === "home"
                    ? "text-gray-900 dark:text-neutral-50"
                    : "text-neutral-950 dark:text-neutral-50 3xs:text-3xl"
                }`}
              >
                {p.name}
              </h3>
              <span
                className={`mt-1 inline-flex shrink-0 rounded-full border border-neutral-200 px-2.5 py-1 font-semibold uppercase tracking-[0.16em] dark:border-neutral-700 ${
                  typography === "home"
                    ? "text-xs text-neutral-600 dark:text-neutral-300"
                    : "text-[10px] text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {p.kindLabel}
              </span>
            </div>
            <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {p.description}
            </p>
            <div className="mt-5">
              <TechnologyBadges technologies={p.technologies} />
            </div>
          </div>
          <div
            inert
            className="relative mt-7 aspect-[4/3] overflow-hidden rounded-2xl"
          >
            <ProjectVisualFrame
              visual={p.cardVisual}
              className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </button>
      </SpotlightCard>
      <ProjectQuickActionsDialog
        project={p}
        labels={labels}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
