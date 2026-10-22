"use client";

import { SurfaceButton } from "@/components/ui/Button";

import { useState, type ReactNode } from "react";
import type { ProjectCardModel } from "@/content/projects/view-models";
import { Dialog } from "@/components/ui/Dialog";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRight, ExternalLink } from "lucide-react";
export default function ArchiveCard({
  project: p,
  children,
  labels,
}: {
  project: ProjectCardModel;
  children: ReactNode;
  labels: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const t = (key: string) => labels[key];
  const fallbackHref = p.detailHref ?? p.liveUrl ?? p.githubUrl;
  const triggerClass =
    "group h-full w-full rounded-card border border-border bg-surface-raised p-6 text-left shadow-card transition-[transform,border-color,box-shadow] duration-300 hover:border-neutral-300 hover:shadow-card-hover motion-safe:hover:-translate-y-1 dark:hover:border-neutral-700";
  return (
    <>
      {fallbackHref ? (
        <a
          href={fallbackHref}
          target={p.detailHref ? undefined : "_blank"}
          rel={p.detailHref ? undefined : "noopener noreferrer"}
          onClick={(event) => {
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            event.preventDefault();
            setOpen(true);
          }}
          aria-haspopup="dialog"
          aria-label={`${t("openActions")}: ${p.name}`}
          className={`block ${triggerClass}`}
        >
          {children}
        </a>
      ) : (
        <SurfaceButton
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={`${t("openActions")}: ${p.name}`}
          className={triggerClass}
        >
          {children}
        </SurfaceButton>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={p.name}
        closeLabel={t("closeDialog")}
      >
        <p className="mb-2 text-eyebrow font-semibold uppercase text-accent">
          {t("projectActions")}
        </p>
        <p className="mb-6 leading-relaxed text-content-muted">
          {p.description}
        </p>
        <div className="flex flex-wrap gap-3">
          {p.detailHref && (
            <ButtonLink
              href={p.detailHref}
              icon={<ArrowUpRight size={17} aria-hidden="true" />}
            >
              {t("viewDetails")}
            </ButtonLink>
          )}
          {p.liveUrl && (
            <ButtonLink
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              icon={<ExternalLink size={17} aria-hidden="true" />}
              variant="secondary"
            >
              {t("accessProject")}
            </ButtonLink>
          )}
          {p.githubUrl && (
            <ButtonLink
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              {t("viewOnGithub")}
            </ButtonLink>
          )}
        </div>
      </Dialog>
    </>
  );
}
