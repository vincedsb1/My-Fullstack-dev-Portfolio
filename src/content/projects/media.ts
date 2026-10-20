import type { ProjectCatalogEntry, ProjectMediaReference } from "./types.ts";

export function getVerifiedCardVisual(project: ProjectCatalogEntry) {
  const visual = project.cardVisual;
  if (!visual || !visual.verified) return undefined;
  return visual;
}

export function isPublishableMedia(
  media: ProjectMediaReference | undefined,
): media is ProjectMediaReference {
  if (!media || !media.verified) return false;
  if (media.type === "placeholder") return false;
  return Boolean(media.src || media.label);
}
