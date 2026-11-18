"use client";
import { useEffect, useRef, useState } from "react";
import QuestionField from "./QuestionField";
import StoryScreen from "./StoryScreen";
import { Welcome } from "./Welcome";
import {
  ANNOUNCED_QUESTIONS,
  CHAPTERS,
  QUESTIONS,
  STEPS,
  TWIST_STEP,
  type AnswerId,
  type QuestionId,
} from "./journey";

/**
 * Parcours narratif. Les deux réponses restent en mémoire pour l’interaction
 * (état sélectionné au retour arrière) : elles ne sont ni calculées, ni stockées,
 * ni transmises.
 */
export default function Assistant({
  open,
  onClose,
  onReveal,
}: {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars -- Type-only callback parameter.
  onReveal: (revealed: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, AnswerId>>>(
    {},
  );
  const title = useRef<HTMLHeadingElement>(null);
  const current = STEPS[step];

  useEffect(() => {
    if (!open || current.kind !== "welcome") return;
    const frame = requestAnimationFrame(() => {
      title.current?.focus({ preventScroll: true });
      title.current
        ?.closest("dialog")
        ?.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, current.kind]);

  // Update the backdrop rule in the same render as the step, not one frame later.
  function go(target: number) {
    const value = Math.min(STEPS.length - 1, Math.max(0, target));
    setStep(value);
    onReveal(value >= TWIST_STEP);
  }
  const previous = () => go(step - 1);
  const next = () => go(step + 1);

  switch (current.kind) {
    case "welcome":
      return (
        <Welcome
          total={ANNOUNCED_QUESTIONS}
          chapters={CHAPTERS.length}
          title={title}
          onStart={next}
          onClose={onClose}
        />
      );
    case "question": {
      const id = QUESTIONS[current.index].id;
      return (
        <QuestionField
          open={open}
          index={current.index}
          value={answers[id]}
          onPrevious={previous}
          onNext={next}
          onAnswer={(value) =>
            setAnswers((state) => ({ ...state, [id]: value }))
          }
        />
      );
    }
    default:
      return (
        <StoryScreen
          open={open}
          screen={current}
          onPrevious={previous}
          onNext={
            current.kind === "conclusion"
              ? () => {
                  onClose();
                  go(0);
                  setAnswers({});
                }
              : next
          }
        />
      );
  }
}
