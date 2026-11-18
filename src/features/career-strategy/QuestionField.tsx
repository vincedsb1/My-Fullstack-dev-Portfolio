"use client";
import { useId } from "react";
import { useTranslations } from "next-intl";
import type { Bundle, Question } from "./types";
import styles from "./Assistant.module.css";
export default function QuestionField({
  question,
  bundle,
  value,
  error,
  onChange,
  onLimit,
}: {
  question: Question;
  bundle: Bundle;
  value?: string | string[];
  error: boolean;
  // eslint-disable-next-line no-unused-vars -- Type-only callback parameter.
  onChange: (value: string | string[] | undefined) => void;
  onLimit: () => void;
}) {
  const id = useId(),
    t = useTranslations("careerStrategy");
  const text = bundle.content.questions[question.id],
    multiple = question.type === "choix_multiple";
  const options = multiple
    ? question.options!.map((o) => ({ id: o.id, label: text.options![o.id] }))
    : bundle.questionnaire.answerSets[question.answerSetId!].map((o) => ({
        id: o.id,
        label: bundle.content.answerLabels[o.id],
      }));
  function select(option: string, checked: boolean) {
    if (!multiple) {
      onChange(option);
      return;
    }
    const old = Array.isArray(value) ? value : [];
    if (checked && old.length >= question.maxSelections!) {
      onLimit();
      return;
    }
    const next = checked ? [...old, option] : old.filter((x) => x !== option);
    onChange(next.length ? next : undefined);
  }
  return (
    <fieldset
      className={styles.question}
      data-question={question.id}
      aria-describedby={
        `${multiple ? `${id}-help ` : ""}${
          error ? `${id}-error` : ""
        }`.trim() || undefined
      }
      aria-invalid={error || undefined}
    >
      <legend>{text.prompt}</legend>
      {multiple && (
        <p id={`${id}-help`} className={styles.hint}>
          {t("chooseUpTo")}
        </p>
      )}
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.id} className={styles.option}>
            <input
              type={multiple ? "checkbox" : "radio"}
              name={id}
              value={option.id}
              checked={
                multiple
                  ? Array.isArray(value) && value.includes(option.id)
                  : value === option.id
              }
              onChange={(event) => select(option.id, event.target.checked)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {t("required")}
        </p>
      )}
    </fieldset>
  );
}
