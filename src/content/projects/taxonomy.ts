import type { ProjectId } from "./types.ts";

export const featuredProjectIds = [
  "allaw",
  "iconise",
  "suggst",
  "smartflow",
] as const satisfies readonly ProjectId[];

export const otherProjectIds = [
  "aiSystem",
  "aimoto",
  "truthify",
] as const satisfies readonly ProjectId[];

export const archiveProjectIds = [
  "codeMaster",
  "decorNature",
  "teslaApp",
  "liic",
  "wilderGame",
  "legalDirectory",
  "legalConstat",
  "emmausConnect",
] as const satisfies readonly ProjectId[];

export const projectTaxonomy = {
  featured: featuredProjectIds,
  other: otherProjectIds,
  archive: archiveProjectIds,
} as const;
