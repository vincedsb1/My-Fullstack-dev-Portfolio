"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

const checklist = [
  { id: "demo-a", text: "Un titre unique et une introduction claire" },
  { id: "demo-b", text: "Des composants alignés sur le design system" },
  { id: "demo-c", text: "Une vérification mobile et en mode sombre" },
] as const;

export function BlogChecklistDemo() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const count = checklist.filter((item) => completed[item.id]).length;

  return (
    <div className="blog-ds__checklist">
      <div className="blog-ds__checklist-heading">
        <div>
          <p>Ta progression</p>
          <strong aria-live="polite">
            {count}/{checklist.length} étapes terminées
          </strong>
        </div>
        <button
          type="button"
          onClick={() => setCompleted({})}
          disabled={count === 0}
        >
          <RotateCcw size={14} aria-hidden="true" /> Réinitialiser
        </button>
      </div>
      <div
        className="blog-ds__checklist-track"
        role="progressbar"
        aria-label="Progression de la checklist"
        aria-valuemin={0}
        aria-valuemax={checklist.length}
        aria-valuenow={count}
      >
        <div style={{ width: `${(count / checklist.length) * 100}%` }} />
      </div>
      <div className="blog-ds__checklist-items">
        {checklist.map((item) => (
          <label
            key={item.id}
            className="blog-ds__checklist-item"
            data-checked={completed[item.id] ? "true" : "false"}
          >
            <input
              type="checkbox"
              checked={Boolean(completed[item.id])}
              onChange={(event) =>
                setCompleted((current) => ({
                  ...current,
                  [item.id]: event.target.checked,
                }))
              }
            />
            <span>{item.text}</span>
            {completed[item.id] ? (
              <CheckCircle2 size={17} aria-hidden="true" />
            ) : null}
          </label>
        ))}
      </div>
      <p className="blog-ds__hint">
        Démonstration isolée : aucun état n’est enregistré. La migration du
        guide conservera sa clé de stockage historique.
      </p>
    </div>
  );
}

type Key = "need" | "market" | "capacity";
const questions: Array<{ id: Key; text: string }> = [
  {
    id: "need",
    text: "Cette fonctionnalité répond-elle à un besoin identifié ?",
  },
  { id: "market", text: "Dispose-t-on d’un signal d’intérêt mesurable ?" },
  { id: "capacity", text: "Peut-on assurer sa maintenance ?" },
];

export function BlogDecisionDemo() {
  const [answers, setAnswers] = useState<Partial<Record<Key, boolean>>>({});
  const complete = questions.every(({ id }) => answers[id] !== undefined);
  const decision = useMemo(() => {
    if (!complete) return null;
    const positive = questions.filter(({ id }) => answers[id]).length;
    return positive >= 2
      ? "Les signaux semblent suffisants pour tester une première version limitée."
      : "Priorité à la validation du besoin avant de multiplier les fonctionnalités.";
  }, [answers, complete]);

  return (
    <div className="blog-ds__decision">
      {questions.map((question, index) => (
        <fieldset key={question.id} className="blog-ds__decision-question">
          <legend>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {question.text}
          </legend>
          <div>
            {[true, false].map((option) => (
              <button
                key={String(option)}
                type="button"
                aria-pressed={answers[question.id] === option}
                onClick={() =>
                  setAnswers((old) => ({ ...old, [question.id]: option }))
                }
              >
                {option ? "Oui" : "Non"}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      <div
        className="blog-ds__decision-result"
        role="status"
        aria-live="polite"
      >
        <span>Résultat</span>
        <p>
          {decision ??
            "Réponds aux trois questions pour afficher une orientation."}
        </p>
      </div>
      {Object.keys(answers).length > 0 && (
        <button
          type="button"
          className="blog-ds__decision-reset"
          onClick={() => setAnswers({})}
        >
          Recommencer
        </button>
      )}
    </div>
  );
}
