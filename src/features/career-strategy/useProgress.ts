"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Bundle, Draft } from "./types";
import {
  parseSaved,
  readSaved,
  saveDraft,
  STORAGE_KEY,
  type Saved,
  type SavedState,
} from "./storage";
export const emptyDraft = (): Draft => ({
  mode: null,
  answers: {},
  phase: "welcome",
  section: 0,
  returnToReview: false,
});
function read(bundle: Bundle): SavedState {
  try {
    return readSaved(window.localStorage, bundle);
  } catch {
    return { kind: "unavailable" };
  }
}
export function useProgress(bundle: Bundle) {
  const [initial] = useState(() => read(bundle));
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [candidate, setCandidate] = useState<Saved | null>(
    initial.kind === "valid" ? initial.saved : null,
  );
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<
    | "memory"
    | "saved"
    | "saveFailed"
    | "invalidSaved"
    | "expiredSaved"
    | "externalDeleted"
  >(
    initial.kind === "unavailable"
      ? "saveFailed"
      : initial.kind === "invalid"
      ? "invalidSaved"
      : initial.kind === "expired"
      ? "expiredSaved"
      : "memory",
  );
  const [conflict, setConflict] = useState<SavedState | null>(null);
  const revision = useRef(
    initial.kind === "valid" ? initial.saved.revision : null,
  );
  useEffect(() => {
    if (initial.kind === "expired") {
      try {
        if (readSaved(window.localStorage, bundle).kind === "expired")
          window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* The in-memory session remains usable. */
      }
    }
  }, [bundle, initial]);
  useEffect(() => {
    function external(event: StorageEvent) {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      const next = read(bundle);
      if (next.kind === "valid" && next.saved.revision === revision.current)
        return;
      if (enabled) setConflict(next);
      else if (draft.mode === null) {
        setCandidate(next.kind === "valid" ? next.saved : null);
      }
    }
    window.addEventListener("storage", external);
    return () => window.removeEventListener("storage", external);
  }, [bundle, enabled, draft.mode]);
  const persist = useCallback(
    (next: Draft, force = false) => {
      try {
        const current = parseSaved(
          window.localStorage.getItem(STORAGE_KEY),
          bundle,
        );
        const currentRevision =
          current.kind === "valid" ? current.saved.revision : null;
        if (!force && currentRevision !== revision.current) {
          setConflict(current);
          return;
        }
        const saved = saveDraft(
          window.localStorage,
          bundle,
          next,
          crypto.randomUUID(),
        );
        revision.current = saved.revision;
        setStatus("saved");
      } catch {
        setStatus("saveFailed");
      }
    },
    [bundle],
  );
  function update(next: Draft) {
    setDraft(next);
    if (enabled && !conflict) persist(next);
  }
  function remove() {
    let removed = false;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      removed = true;
      revision.current = null;
      setStatus("memory");
    } catch {
      setStatus("saveFailed");
    }
    setEnabled(false);
    setCandidate(null);
    setConflict(null);
    return removed;
  }
  function toggle(next: boolean) {
    if (!next) {
      remove();
      return;
    }
    setEnabled(true);
    persist(draft);
  }
  function resume(saved: Saved) {
    // Re-read before accepting a stale resume prompt.
    const current = read(bundle);
    if (current.kind !== "valid" || current.saved.revision !== saved.revision) {
      setCandidate(null);
      setConflict(current);
      return;
    }
    setDraft(saved.draft);
    setCandidate(null);
    setConflict(null);
    setEnabled(true);
    revision.current = saved.revision;
    persist(saved.draft, true);
  }
  function keepCurrent() {
    setCandidate(null);
    setConflict(null);
    setEnabled(true);
    persist(draft, true);
  }
  function useExternal() {
    const current = read(bundle);
    if (current.kind === "valid") resume(current.saved);
    else if (remove()) {
      setStatus("externalDeleted");
    }
  }
  function reset() {
    remove();
    setDraft(emptyDraft());
  }
  return {
    draft,
    update,
    candidate,
    enabled,
    status,
    conflict,
    toggle,
    remove,
    resume,
    keepCurrent,
    useExternal,
    reset,
  };
}
