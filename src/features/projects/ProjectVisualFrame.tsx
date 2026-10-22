import { projectImages } from "@/lib/project-images";
import Image from "next/image";
import {
  Aperture,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Database,
  Layers3,
  Sparkles,
} from "lucide-react";
import type { ProjectVisual } from "@/content/projects/types";
import { getProjectIdFromImageId, ProjectIllustration } from "./illustrations";
import IconiseLandingProductFigure from "./IconiseLandingProductFigure";

const abstractIcons = [
  Sparkles,
  Layers3,
  BrainCircuit,
  Aperture,
  Code2,
  Database,
];

function PlaceholderVisual({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex min-h-44 items-center justify-center overflow-hidden rounded-card bg-[radial-gradient(circle_at_25%_20%,rgba(239,68,68,0.22),transparent_35%),linear-gradient(135deg,#fafafa,#e5e5e5)] p-8 text-center dark:bg-[radial-gradient(circle_at_25%_20%,rgba(239,68,68,0.22),transparent_35%),linear-gradient(135deg,#262626,#0a0a0a)] ${className}`}
    >
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(115,115,115,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(115,115,115,0.15)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative flex flex-col items-center gap-3 text-neutral-600 dark:text-neutral-300">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-neutral-300/80 bg-white/70 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/70">
          <Sparkles className="text-accent" aria-hidden="true" />
        </span>
        {label ? <span className="text-sm font-medium">{label}</span> : null}
      </div>
    </div>
  );
}

function AbstractVisual({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex min-h-52 items-center justify-center overflow-hidden rounded-card bg-neutral-950 p-8 text-white dark:bg-neutral-900 ${className}`}
    >
      <div className="absolute -left-16 -top-20 size-64 rounded-full bg-red-500/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-12 size-72 rounded-full bg-orange-200/20 blur-3xl" />
      <div className="relative grid w-full max-w-sm grid-cols-3 gap-3 opacity-90">
        {abstractIcons.map((Icon, index) => (
          <div
            key={index}
            className={`flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] shadow-2xl backdrop-blur ${
              index === 4 ? "-translate-y-3 bg-red-500/80" : ""
            }`}
          >
            <Icon size={index === 4 ? 30 : 22} aria-hidden="true" />
          </div>
        ))}
      </div>
      {label ? (
        <span className="absolute bottom-5 left-6 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export default function ProjectVisualFrame({
  visual,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  objectFit = "cover",
}: {
  visual?: ProjectVisual;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
}) {
  if (!visual) return null;

  if (visual.type === "placeholder") {
    return <PlaceholderVisual label={visual.label} className={className} />;
  }

  if (visual.type === "illustration" || visual.type === "diagram") {
    if (visual.imageId === "iconise-product-figure") {
      return <IconiseLandingProductFigure className={className} />;
    }

    const projectId = getProjectIdFromImageId(visual.imageId);
    if (projectId) {
      return (
        <ProjectIllustration projectId={projectId} className={className} />
      );
    }
    return <AbstractVisual label={visual.label} className={className} />;
  }

  if (!visual.src) {
    return (
      <div className={`relative overflow-hidden rounded-card ${className}`}>
        <PlaceholderVisual label={visual.label} />
      </div>
    );
  }

  if (visual.type === "mockup") {
    return (
      <div
        className={`rounded-card border border-neutral-200 bg-white p-2 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
      >
        <div className="overflow-hidden rounded-card border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex h-9 items-center gap-1.5 border-b border-neutral-200 bg-neutral-50 px-4 dark:border-neutral-800 dark:bg-neutral-900">
            <span className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </div>
          <div className="relative aspect-[16/10]">
            <Image
              src={projectImages[visual.src] ?? visual.src}
              placeholder={projectImages[visual.src] ? "blur" : undefined}
              alt={visual.alt || visual.label || ""}
              fill
              sizes={sizes}
              priority={priority}
              className={
                objectFit === "contain" ? "object-contain" : "object-cover"
              }
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-card ${className}`}>
      <Image
        src={projectImages[visual.src] ?? visual.src}
        placeholder={projectImages[visual.src] ? "blur" : undefined}
        alt={visual.alt || visual.label || ""}
        fill
        sizes={sizes}
        priority={priority}
        className={objectFit === "contain" ? "object-contain" : "object-cover"}
      />
      {visual.type === "image" ? null : (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-4">
          <span className="rounded-full bg-neutral-950/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <CheckCircle2
              className="mr-1 inline-block size-3.5"
              aria-hidden="true"
            />
            {visual.label}
          </span>
        </div>
      )}
    </div>
  );
}
