"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type { ProjectCatalogEntry } from "@/content/projects/types";
import { getVerifiedCardVisual } from "@/content/projects/media";
import ProjectQuickActionsDialog from "./ProjectQuickActionsDialog";
import ProjectVisualFrame from "./ProjectVisualFrame";
import { TechnologyBadges } from "./TechnologyBadges";

export default function ProjectCard({
  project,
  featured = false,
}: {
  project: ProjectCatalogEntry;
  featured?: boolean;
}) {
  const t = useTranslations("projects");
  const [dialogOpen, setDialogOpen] = useState(false);
  const cardVisual = getVerifiedCardVisual(project);
  const openDialog = () => setDialogOpen(true);
  const handleCardKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openDialog();
  };

  return (
    <>
      <article
        className={`group flex h-full flex-col rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 ${
          featured ? "p-6 md:p-8" : "md:p-6"
        }`}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={openDialog}
          onKeyDown={handleCardKeyDown}
          className="flex h-full cursor-pointer flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-neutral-900"
          aria-haspopup="dialog"
          aria-label={`${t("openActions")}: ${t(project.nameKey)}`}
        >
          <div className="flex-grow">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3
                className={`font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 ${
                  featured ? "text-3xl md:text-4xl" : "text-2xl 3xs:text-3xl"
                }`}
              >
                {t(project.nameKey)}
              </h3>
              <span className="mt-1 inline-flex shrink-0 rounded-full border border-neutral-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                {t(`kind.${project.kind}`)}
              </span>
            </div>
            <p
              className={`leading-relaxed text-neutral-600 dark:text-neutral-300 ${
                featured ? "text-base" : "line-clamp-3 text-sm"
              }`}
            >
              {t.rich(project.descriptionKey, {
                strong: (chunks) => <strong>{chunks}</strong>,
                break: () => <br />,
              })}
            </p>
            <div className="mt-5">
              <TechnologyBadges
                technologies={project.technologies}
                compact={!featured}
                label={t("technologies")}
              />
            </div>
          </div>

          <div
            className={`relative mt-7 overflow-hidden rounded-2xl ${
              featured ? "aspect-[16/10]" : "aspect-[4/3]"
            }`}
          >
            {cardVisual ? (
              <Image
                src={cardVisual.src as string}
                alt={
                  cardVisual.alt ||
                  `${t(project.nameKey)} — ${t("projectPreview")}`
                }
                fill
                sizes={
                  featured
                    ? "(max-width: 768px) 100vw, 800px"
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                }
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                priority={featured}
              />
            ) : (
              <ProjectVisualFrame
                visual={{
                  type: "illustration",
                  label: project.canonicalName,
                  imageId: project.id,
                }}
                className="h-full w-full"
                sizes={featured ? "(max-width: 768px) 100vw, 800px" : "33vw"}
              />
            )}
            <span className="pointer-events-none absolute bottom-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-neutral-950/80 text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
              <span aria-hidden="true">↗</span>
            </span>
          </div>
        </div>
      </article>
      <ProjectQuickActionsDialog
        project={project}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
