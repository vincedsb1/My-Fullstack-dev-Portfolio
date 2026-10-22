import "server-only";
import allawFr from "./fr/allaw.json" with { type: "json" };
import allawEn from "./en/allaw.json" with { type: "json" };
import iconiseFr from "./fr/iconise.json" with { type: "json" };
import iconiseEn from "./en/iconise.json" with { type: "json" };
import suggstFr from "./fr/suggst.json" with { type: "json" };
import suggstEn from "./en/suggst.json" with { type: "json" };
import smartflowFr from "./fr/smartflow.json" with { type: "json" };
import smartflowEn from "./en/smartflow.json" with { type: "json" };
import aiSystemFr from "./fr/ai-system.json" with { type: "json" };
import aiSystemEn from "./en/ai-system.json" with { type: "json" };
import aimotoFr from "./fr/aimoto.json" with { type: "json" };
import aimotoEn from "./en/aimoto.json" with { type: "json" };
import truthifyFr from "./fr/truthify.json" with { type: "json" };
import truthifyEn from "./en/truthify.json" with { type: "json" };
import { parseCaseStudyManifest } from "../validation.ts";
import type {
  ProjectCaseStudyManifest,
  ProjectId,
  ProjectLocale,
} from "../types.ts";

// Enregistrer ici les JSON des projets. Aucun contenu ni style dans ce registre.
const sources: unknown[] = [
  allawFr,
  allawEn,
  iconiseFr,
  iconiseEn,
  suggstFr,
  suggstEn,
  smartflowFr,
  smartflowEn,
  aiSystemFr,
  aiSystemEn,
  aimotoFr,
  aimotoEn,
  truthifyFr,
  truthifyEn,
];

export const caseStudyManifests: Partial<
  Record<`${ProjectLocale}:${ProjectId}`, ProjectCaseStudyManifest>
> = {};

for (const source of sources) {
  const manifest = parseCaseStudyManifest(source);
  if (manifest.projectId === "fixture" || manifest.status === "fixture") {
    throw new Error("Une fixture ne doit pas être enregistrée comme projet.");
  }
  const key: `${ProjectLocale}:${ProjectId}` = `${manifest.locale}:${manifest.projectId}`;
  if (caseStudyManifests[key]) {
    throw new Error(`Étude de cas enregistrée deux fois : ${key}.`);
  }
  caseStudyManifests[key] = manifest;
}
