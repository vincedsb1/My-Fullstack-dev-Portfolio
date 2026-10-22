"use client";

import { SurfaceButton } from "@/components/ui/Button";

import { useState } from "react";
import type { ProjectGalleryItem } from "@/content/projects/types";
import { Dialog } from "@/components/ui/Dialog";
import ProjectVisualFrame from "./ProjectVisualFrame";
export default function ProjectGallery({
  items,
  title,
  closeLabel,
  openLabel,
}: {
  items: ProjectGalleryItem[];
  title: string;
  closeLabel: string;
  openLabel: string;
}) {
  const [active, setActive] = useState<ProjectGalleryItem | null>(null);
  return (
    <section id="gallery" className="border-b border-border py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="sr-only">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <figure key={item.id} data-reveal>
              <SurfaceButton
                type="button"
                aria-label={`${openLabel}: ${item.alt}`}
                onClick={() => setActive(item)}
                className="block aspect-video w-full overflow-hidden rounded-media"
              >
                <ProjectVisualFrame
                  visual={item.visual}
                  className="h-full w-full"
                />
              </SurfaceButton>
              {item.caption && (
                <figcaption className="mt-3 text-small text-content-muted">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
        <Dialog
          open={!!active}
          onClose={() => setActive(null)}
          title={active?.alt ?? title}
          closeLabel={closeLabel}
        >
          {active && (
            <>
              <ProjectVisualFrame
                visual={active.visual}
                className="aspect-video w-full"
                objectFit="contain"
              />
              {active.caption && (
                <p className="mt-4 text-small text-content-muted">
                  {active.caption}
                </p>
              )}
            </>
          )}
        </Dialog>
      </div>
    </section>
  );
}
