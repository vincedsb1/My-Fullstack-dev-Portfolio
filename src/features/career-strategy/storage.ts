import type { Bundle, Draft, Phase } from "./types";
import { validateAnswers } from "./engine";
export const STORAGE_KEY = "vd_ai_career_strategy_draft_v1";
export const MAX_AGE = 30 * 24 * 60 * 60 * 1000;
export type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type Saved = {
  schemaVersion: 1;
  questionnaireId: string;
  questionnaireVersion: string;
  engineVersion: string;
  catalogVersion: string;
  contentVersion: string;
  savedAt: number;
  expiresAt: number;
  revision: string;
  draft: Draft;
};
export type SavedState =
  | { kind: "none" | "invalid" | "expired" | "unavailable" }
  | { kind: "valid"; saved: Saved };
export function parseSaved(
  raw: string | null,
  bundle: Bundle,
  now = Date.now(),
): SavedState {
  if (!raw) return { kind: "none" };
  try {
    const x: unknown = JSON.parse(raw);
    if (!x || typeof x !== "object" || Array.isArray(x)) throw new Error();
    const s = x as Record<string, unknown>;
    if (
      s.schemaVersion !== 1 ||
      s.questionnaireId !== bundle.questionnaire.id ||
      s.questionnaireVersion !== bundle.questionnaireVersion ||
      typeof s.revision !== "string" ||
      !s.revision ||
      typeof s.savedAt !== "number" ||
      !Number.isFinite(s.savedAt) ||
      typeof s.expiresAt !== "number" ||
      !Number.isFinite(s.expiresAt) ||
      s.expiresAt !== s.savedAt + MAX_AGE ||
      s.savedAt > now + 60000
    )
      throw new Error();
    if (s.expiresAt <= now) return { kind: "expired" };
    for (const k of ["engineVersion", "catalogVersion", "contentVersion"])
      if (typeof s[k] !== "string" || !s[k]) throw new Error();
    if (!s.draft || typeof s.draft !== "object" || Array.isArray(s.draft))
      throw new Error();
    const d = s.draft as Record<string, unknown>;
    const phases: Phase[] = [
      "welcome",
      "questions",
      "review",
      "portrait",
      "results",
    ];
    if (
      !phases.includes(d.phase as Phase) ||
      !Number.isInteger(d.section) ||
      (d.section as number) < 0 ||
      (d.section as number) >= bundle.questionnaire.sections.length
    )
      throw new Error();
    if (typeof d.returnToReview !== "boolean") throw new Error();
    const complete = ["review", "portrait", "results"].includes(
      d.phase as string,
    );
    let draft: Draft;
    if (
      d.mode === null &&
      d.phase === "welcome" &&
      d.answers &&
      typeof d.answers === "object" &&
      !Array.isArray(d.answers) &&
      Object.keys(d.answers).length === 0
    ) {
      draft = {
        mode: null,
        phase: "welcome",
        section: 0,
        returnToReview: false,
        answers: {},
      };
    } else {
      if (d.mode !== "court" && d.mode !== "complet") throw new Error();
      draft = {
        mode: d.mode,
        phase: d.phase as Phase,
        section: d.section as number,
        returnToReview: d.returnToReview,
        answers: validateAnswers(
          bundle.questionnaire,
          d.mode,
          d.answers,
          complete ? 1 : 0,
        ),
      };
    }
    return {
      kind: "valid",
      saved: {
        schemaVersion: 1,
        questionnaireId: bundle.questionnaire.id,
        questionnaireVersion: bundle.questionnaireVersion,
        engineVersion: s.engineVersion as string,
        catalogVersion: s.catalogVersion as string,
        contentVersion: s.contentVersion as string,
        savedAt: s.savedAt,
        expiresAt: s.expiresAt,
        revision: s.revision,
        draft,
      },
    };
  } catch {
    return { kind: "invalid" };
  }
}
export function readSaved(
  storage: StoragePort,
  bundle: Bundle,
  now = Date.now(),
): SavedState {
  try {
    return parseSaved(storage.getItem(STORAGE_KEY), bundle, now);
  } catch {
    return { kind: "unavailable" };
  }
}
export function envelope(
  bundle: Bundle,
  draft: Draft,
  revision: string,
  now = Date.now(),
): Saved {
  return {
    schemaVersion: 1,
    questionnaireId: bundle.questionnaire.id,
    questionnaireVersion: bundle.questionnaireVersion,
    engineVersion: bundle.engineVersion,
    catalogVersion: bundle.catalogVersion,
    contentVersion: bundle.contentVersion,
    savedAt: now,
    expiresAt: now + MAX_AGE,
    revision,
    draft,
  };
}
export function saveDraft(
  storage: StoragePort,
  bundle: Bundle,
  draft: Draft,
  revision: string,
  now = Date.now(),
) {
  const saved = envelope(bundle, draft, revision, now);
  // Validate partial values as well as phase consistency before writing.
  if (parseSaved(JSON.stringify(saved), bundle, now).kind !== "valid")
    throw new Error("invalid");
  storage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return saved;
}
