"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";

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
  storageKey?: string;
  items: ReadonlyArray<{ id: string; label: string }>;
  locale?: "fr" | "en";
}) {
  const [volatile, setVolatile] = useState<string | null>(null);
  const snapshot = useCallback(() => {
    try {
      return storageKey
        ? window.localStorage.getItem(storageKey) ?? "{}"
        : "{}";
    } catch {
      return "{}";
    }
  }, [storageKey]);
  const saved = useSyncExternalStore(subscribe, snapshot, serverValue);
  const checked = useMemo(() => {
    try {
      const data: unknown = JSON.parse(volatile ?? saved);
      if (!data || typeof data !== "object" || Array.isArray(data)) return {};
      const state = data as Record<string, unknown>;
      return Object.fromEntries(
        items.map((item) => [item.id, state[item.id] === true]),
      );
    } catch {
      return {};
    }
  }, [saved, volatile, items]);

  const count = items.filter((item) => checked[item.id]).length;
  function update(next: Record<string, boolean>) {
    const stored = Object.fromEntries(
      items
        .filter((item) => next[item.id] === true)
        .map((item) => [item.id, true]),
    );
    const serialized = JSON.stringify(stored);
    if (!storageKey) {
      setVolatile(serialized);
      return;
    }
    try {
      window.localStorage.setItem(storageKey, serialized);
      setVolatile(null);
    } catch {
      setVolatile(serialized);
    }
    window.dispatchEvent(new Event(EVENT));
  }
  const fr = locale === "fr";
  return (
    <section
      className="blog-ds__json-checklist"
      aria-label={fr ? "Liste d’actions" : "Action checklist"}
    >
      <div className="blog-ds__json-checklist-head">
        <span aria-live="polite">
          {count}/{items.length}{" "}
          {fr
            ? items.length === 1
              ? "étape terminée"
              : "étapes terminées"
            : items.length === 1
            ? "completed step"
            : "completed steps"}
        </span>
        <Button
          variant="ghost"
          type="button"
          onClick={() => {
            if (
              storageKey === "vd_guide_checklist_v1" &&
              !window.confirm("Réinitialiser toute la checklist ?")
            )
              return;
            update({});
          }}
          disabled={count === 0}
        >
          {fr ? "Réinitialiser" : "Reset"}
        </Button>
      </div>
      <progress
        max={items.length}
        value={count}
        aria-label={fr ? "Progression de la checklist" : "Checklist progress"}
      />
      {items.map((item) => (
        <label key={item.id} className="blog-ds__json-checklist-row">
          <input
            type="checkbox"
            data-id={item.id}
            checked={Boolean(checked[item.id])}
            onChange={(event) =>
              update({ ...checked, [item.id]: event.target.checked })
            }
          />
          <span>{item.label}</span>
        </label>
      ))}
      {storageKey && volatile !== null ? (
        <p role="status" className="blog-ds__hint">
          {fr
            ? "Le stockage est indisponible. La progression est conservée uniquement sur cette page."
            : "Storage is unavailable. Progress is kept only on this page."}
        </p>
      ) : null}
    </section>
  );
}
