"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const EVENT = "blog-json-checklist-changed";
const serverValue = () => "{}";

function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(EVENT, notify);
  };
}

/** Sauvegarde identique au guide historique : seules les cases cochées sont stockées. */
export default function JsonChecklist({
  storageKey,
  items,
  locale = "fr",
}: {
  storageKey: string;
  items: ReadonlyArray<{ id: string; label: string }>;
  locale?: "fr" | "en";
}) {
  const snapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(storageKey) ?? "{}";
    } catch {
      return "{}";
    }
  }, [storageKey]);
  const saved = useSyncExternalStore(subscribe, snapshot, serverValue);
  const checked = useMemo(() => {
    try {
      const data: unknown = JSON.parse(saved);
      if (!data || typeof data !== "object" || Array.isArray(data)) return {};
      const state = data as Record<string, unknown>;
      return Object.fromEntries(items.map((item) => [item.id, state[item.id] === true]));
    } catch {
      return {};
    }
  }, [saved, items]);

  const count = items.filter((item) => checked[item.id]).length;
  function update(next: Record<string, boolean>) {
    const stored = Object.fromEntries(items.filter((item) => next[item.id] === true).map((item) => [item.id, true]));
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(stored));
    } catch {
      // Les cases restent utilisables même si localStorage est bloqué.
    }
    window.dispatchEvent(new Event(EVENT));
  }
  const fr = locale === "fr";
  return (
    <section className="blog-ds__json-checklist" aria-label={fr ? "Liste d’actions" : "Action checklist"}>
      <div className="blog-ds__json-checklist-head">
        <span aria-live="polite">
          {count}/{items.length} {fr ? (items.length === 1 ? "étape terminée" : "étapes terminées") : (items.length === 1 ? "completed step" : "completed steps")}
        </span>
        <button type="button" onClick={() => update({})} disabled={count === 0}>
          {fr ? "Réinitialiser" : "Reset"}
        </button>
      </div>
      <progress max={items.length} value={count} aria-label={fr ? "Progression de la checklist" : "Checklist progress"} />
      {items.map((item) => (
        <label key={item.id} className="blog-ds__json-checklist-row">
          <input type="checkbox" checked={Boolean(checked[item.id])} onChange={(event) => update({ ...checked, [item.id]: event.target.checked })} />
          <span>{item.label}</span>
        </label>
      ))}
    </section>
  );
}
