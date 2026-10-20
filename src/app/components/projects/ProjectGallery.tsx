"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type { ProjectGalleryItem } from "@/content/projects/types";
import ProjectVisualFrame from "./ProjectVisualFrame";

function focusableElements(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    ),
  );
}

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
  const [activeItem, setActiveItem] = useState<ProjectGalleryItem | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const openItem = (item: ProjectGalleryItem) => setActiveItem(item);
  const handleGalleryKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
    item: ProjectGalleryItem,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openItem(item);
  };

  useEffect(() => {
    if (!activeItem) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(
      () => focusableElements(dialogRef.current)[0]?.focus(),
      0,
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveItem(null);
        return;
      }
      if (event.key !== "Tab") return;
      const elements = focusableElements(dialogRef.current);
      if (!elements.length) return;
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
      previousFocus.current?.focus();
      previousFocus.current = null;
    };
  }, [activeItem]);

  const gridClass =
    items.length === 1
      ? "grid-cols-1"
      : items.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : items.length <= 5
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <section
        id="gallery"
        className="border-b border-neutral-200 bg-white py-24 dark:border-neutral-900 dark:bg-[#0A0A0A] md:py-32"
      >
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="sr-only">{title}</h2>
          <div className={`grid gap-6 ${gridClass}`}>
            {items.map((item, index) => (
              <figure
                key={item.id}
                data-reveal
                data-reveal-delay={(index % 3) * 60}
                className={
                  items.length === 3 && index === 0
                    ? "md:col-span-2 lg:col-span-2"
                    : ""
                }
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openItem(item)}
                  onKeyDown={(event) => handleGalleryKeyDown(event, item)}
                  className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 text-left outline-none transition-shadow hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-red-500 dark:border-neutral-800 dark:bg-neutral-900"
                  aria-label={`${openLabel}: ${item.alt}`}
                >
                  <ProjectVisualFrame
                    visual={item.visual}
                    className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
                {item.caption ? (
                  <figcaption className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-neutral-950/85 p-4 backdrop-blur-md sm:p-8"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveItem(null);
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-lightbox-title"
              className="relative flex max-h-full w-full max-w-6xl flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <h2 id="project-lightbox-title" className="sr-only">
                {activeItem.alt}
              </h2>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="absolute right-0 top-0 z-10 inline-flex size-11 items-center justify-center rounded-full bg-neutral-900/70 text-white backdrop-blur transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label={closeLabel}
              >
                <X size={22} aria-hidden="true" />
              </button>
              <div className="relative h-[70vh] w-full max-w-5xl overflow-hidden rounded-2xl">
                <ProjectVisualFrame
                  visual={activeItem.visual}
                  className="h-full w-full"
                  sizes="100vw"
                  objectFit="contain"
                />
              </div>
              {activeItem.caption ? (
                <p className="mt-4 max-w-2xl text-center text-sm text-white/75">
                  {activeItem.caption}
                </p>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
