"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Layers,
  RotateCcw,
  Save,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { getQuestions, submit } from "./engine";
import { validateBundle, ENGINE_VERSION } from "./schema.mjs";
import { useProgress } from "./useProgress";
import QuestionField from "./QuestionField";
import Portrait from "./PortraitResult";
import Recommendations from "./Recommendations";
import type { Bundle, Locale, Mode, Phase } from "./types";
import styles from "./Assistant.module.css";
export function parseResource(
  value: unknown,
  locale: Locale,
  version: string,
): Bundle {
  validateBundle(value);
  if (
    value.content.locale !== locale ||
    value.contentVersion !== version ||
    value.engineVersion !== ENGINE_VERSION
  )
    throw new Error("configuration");
  return value;
}
const phases: Phase[] = [
  "welcome",
  "questions",
  "review",
  "portrait",
  "results",
];
const phaseLabels = [
  "phaseWelcome",
  "phaseQuestions",
  "phaseReview",
  "phasePortrait",
  "phaseResults",
] as const;
export default function Assistant({
  bundle,
  open,
  onClose,
}: {
  bundle: Bundle;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("careerStrategy"),
    progress = useProgress(bundle);
  const { draft, update } = progress;
  const saveHelpId = useId();
  const title = useRef<HTMLHeadingElement>(null),
    errorSummary = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<string[]>([]),
    [announcement, setAnnouncement] = useState("");
  const [calculationError, setCalculationError] = useState(false);
  const q = bundle.questionnaire,
    mode = draft.mode;
  const questions = mode ? getQuestions(q, mode) : [];
  const section = q.sections[draft.section];
  const sectionQuestions = mode
    ? section.questions.filter((x) => mode === "complet" || x.tier === "court")
    : [];
  const result = useMemo(() => {
    if (!mode || !["portrait", "results"].includes(draft.phase)) return null;
    try {
      return submit(q, bundle.catalog, mode, draft.answers);
    } catch {
      return null;
    }
  }, [q, bundle.catalog, mode, draft.phase, draft.answers]);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      title.current?.focus({ preventScroll: true });
      title.current
        ?.closest("dialog")
        ?.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, draft.phase, draft.section]);
  const phaseTitle =
    draft.phase === "welcome"
      ? t("welcomeTitle")
      : draft.phase === "questions"
      ? bundle.content.sections[section.id].title
      : draft.phase === "review"
      ? t("reviewTitle")
      : draft.phase === "portrait"
      ? t("portraitTitle")
      : t("strategiesTitle");
  function move(phase: Phase, sectionIndex = draft.section) {
    setErrors([]);
    setCalculationError(false);
    setAnnouncement("");
    update({ ...draft, phase, section: sectionIndex });
  }
  function selectMode(next: Mode) {
    if (mode === next) return;
    const ids = new Set(getQuestions(q, next).map((x) => x.id));
    if (
      next === "court" &&
      Object.keys(draft.answers).some((id) => !ids.has(id)) &&
      !window.confirm(t("modeChangeConfirm"))
    )
      return;
    setErrors([]);
    setCalculationError(false);
    update({
      ...draft,
      mode: next,
      answers: Object.fromEntries(
        Object.entries(draft.answers).filter(([id]) => ids.has(id)),
      ),
      phase: draft.phase === "welcome" ? "welcome" : "questions",
      section: 0,
      returnToReview: false,
    });
  }
  function edit(index: number) {
    setErrors([]);
    setCalculationError(false);
    update({
      ...draft,
      phase: "questions",
      section: index,
      returnToReview: true,
    });
  }
  function nextSection() {
    const missing = sectionQuestions
      .filter((x) => draft.answers[x.id] === undefined)
      .map((x) => x.id);
    setErrors(missing);
    if (missing.length) {
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }
    if (draft.returnToReview || draft.section === q.sections.length - 1) {
      update({ ...draft, phase: "review", returnToReview: false });
    } else move("questions", draft.section + 1);
  }
  function makePortrait() {
    if (!mode) return;
    try {
      submit(q, bundle.catalog, mode, draft.answers);
      move("portrait");
    } catch {
      setCalculationError(true);
      requestAnimationFrame(() => errorSummary.current?.focus());
    }
  }
  function restart() {
    if (!window.confirm(t("restartConfirm"))) return;
    progress.reset();
    requestAnimationFrame(() => title.current?.focus());
    setErrors([]);
    setCalculationError(false);
  }
  function answerLabel(id: string) {
    const value = draft.answers[id];
    return Array.isArray(value)
      ? value.map((x) => bundle.content.questions[id].options![x]).join(" · ")
      : bundle.content.answerLabels[value] ?? "";
  }
  return (
    <div className={styles.assistant}>
      <div className={styles.progressHeader}>
        <ol className={styles.stepper}>
          {phases.map((phase, index) => (
            <li
              key={phase}
              aria-current={draft.phase === phase ? "step" : undefined}
              data-complete={index < phases.indexOf(draft.phase)}
            >
              <span className={styles.dot} aria-hidden />{" "}
              <span className={styles.stepLabel}>{t(phaseLabels[index])}</span>
            </li>
          ))}
        </ol>
        {mode && (
          <span className={styles.hint} aria-live="polite">
            {t("answersProgress", {
              count: Object.keys(draft.answers).length,
              total: questions.length,
            })}
          </span>
        )}
      </div>
      <div className={styles.titleGroup}>
        <span className={styles.eyebrow}>
          {draft.phase === "questions"
            ? t("sectionProgress", {
                current: draft.section + 1,
                total: q.sections.length,
              })
            : t(phaseLabels[phases.indexOf(draft.phase)])}
        </span>
        <h3 ref={title} tabIndex={-1}>
          {phaseTitle}
        </h3>
        <p>
          {draft.phase === "welcome"
            ? t("welcomeDescription")
            : draft.phase === "questions"
            ? bundle.content.sections[section.id].description
            : draft.phase === "review"
            ? t("reviewDescription")
            : draft.phase === "portrait"
            ? t("portraitDescription")
            : ""}
        </p>
      </div>
      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      {progress.conflict && (
        <div className={styles.notice} role="alert">
          <strong>{t("conflictTitle")}</strong>
          <p>{t("conflictDescription")}</p>
          <div className={styles.actions}>
            <Button onClick={progress.useExternal} variant="secondary">
              {progress.conflict.kind === "valid"
                ? t("useExternal")
                : t("removeSaved")}
            </Button>
            <Button onClick={progress.keepCurrent} className={styles.primary}>
              {t("keepCurrent")}
            </Button>
          </div>
        </div>
      )}
      {progress.candidate ? (
        <section className={styles.notice}>
          <h4>{t("resumeTitle")}</h4>
          <p>{t("resumeDescription")}</p>
          <div className={styles.actions}>
            <Button
              onClick={() => progress.resume(progress.candidate!)}
              className={styles.primary}
            >
              {t("resume")}
            </Button>
            <Button onClick={restart} variant="secondary">
              {t("restart")}
            </Button>
          </div>
        </section>
      ) : (
        <>
          {draft.phase === "welcome" && (
            <>
              <fieldset className={styles.modeChoices}>
                <legend className={styles.srOnly}>{t("modeLabel")}</legend>
                {(["court", "complet"] as const).map((choice) => (
                  <label className={styles.modeCard} key={choice}>
                    <input
                      type="radio"
                      name="career-mode"
                      checked={mode === choice}
                      onChange={() => selectMode(choice)}
                    />
                    <span className={styles.modeArt} aria-hidden>
                      {choice === "court" ? (
                        <Compass size={56} strokeWidth={1.2} />
                      ) : (
                        <Layers size={56} strokeWidth={1.2} />
                      )}
                    </span>
                    <strong>{t(choice === "court" ? "short" : "full")}</strong>
                    <span>
                      {t(
                        choice === "court"
                          ? "shortDescription"
                          : "fullDescription",
                      )}
                    </span>
                    <Check className={styles.modeCheck} aria-hidden size={20} />
                  </label>
                ))}
              </fieldset>
              <p className={styles.hint}>{t("disclaimer")}</p>
            </>
          )}
          {mode && draft.phase !== "welcome" && (
            <label className={styles.modeSelect}>
              {t("modeLabel")}
              <select
                value={mode}
                onChange={(e) => selectMode(e.target.value as Mode)}
              >
                <option value="court">{t("short")}</option>
                <option value="complet">{t("full")}</option>
              </select>
            </label>
          )}
          {(errors.length > 0 ||
            calculationError ||
            (["portrait", "results"].includes(draft.phase) && !result)) && (
            <div
              className={styles.errorSummary}
              role="alert"
              tabIndex={-1}
              ref={errorSummary}
            >
              {calculationError || !errors.length
                ? t("calculationError")
                : t("fixErrors")}
            </div>
          )}
          {draft.phase === "questions" && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                nextSection();
              }}
              noValidate
            >
              <div className={styles.fields}>
                {sectionQuestions.map((question) => (
                  <QuestionField
                    key={question.id}
                    question={question}
                    bundle={bundle}
                    value={draft.answers[question.id]}
                    error={errors.includes(question.id)}
                    onLimit={() => setAnnouncement(t("maxChoices"))}
                    onChange={(value) => {
                      const answers = { ...draft.answers };
                      if (value === undefined) delete answers[question.id];
                      else answers[question.id] = value;
                      setErrors((old) =>
                        old.filter((id) => id !== question.id),
                      );
                      setAnnouncement("");
                      update({ ...draft, answers });
                    }}
                  />
                ))}
              </div>
              <div className={styles.navigation}>
                <Button
                  variant="ghost"
                  onClick={() =>
                    move(
                      draft.section === 0 ? "welcome" : "questions",
                      Math.max(0, draft.section - 1),
                    )
                  }
                >
                  <ArrowLeft size={16} aria-hidden />
                  {t("back")}
                </Button>
                <Button type="submit" className={styles.primary}>
                  {t("next")}
                  <ArrowRight size={16} aria-hidden />
                </Button>
              </div>
            </form>
          )}
          {draft.phase === "review" && (
            <div className={styles.review}>
              {q.sections.map((s, index) => (
                <details key={s.id} className={styles.reviewSection}>
                  <summary>{bundle.content.sections[s.id].title}</summary>
                  <dl>
                    {s.questions
                      .filter((x) => mode === "complet" || x.tier === "court")
                      .map((x) => (
                        <div key={x.id}>
                          <dt>{bundle.content.questions[x.id].prompt}</dt>
                          <dd>{answerLabel(x.id)}</dd>
                        </div>
                      ))}
                  </dl>
                  <Button onClick={() => edit(index)} variant="secondary">
                    {t("editSection")}
                  </Button>
                </details>
              ))}
            </div>
          )}
          {draft.phase === "portrait" && result && (
            <Portrait bundle={bundle} result={result} answers={draft.answers} />
          )}
          {draft.phase === "results" && result && (
            <Recommendations bundle={bundle} result={result} />
          )}
          {draft.phase !== "questions" && (
            <div className={styles.navigation}>
              <div>
                {draft.phase !== "welcome" && (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      move(
                        draft.phase === "results"
                          ? "portrait"
                          : draft.phase === "portrait"
                          ? "review"
                          : "questions",
                        draft.phase === "review"
                          ? q.sections.length - 1
                          : draft.section,
                      )
                    }
                  >
                    <ArrowLeft size={16} aria-hidden />
                    {draft.phase === "results" ? t("backPortrait") : t("back")}
                  </Button>
                )}
              </div>
              {draft.phase === "welcome" ? (
                <Button
                  disabled={!mode}
                  className={styles.primary}
                  onClick={() => move("questions", 0)}
                >
                  {t("start")}
                  <ArrowRight size={16} aria-hidden />
                </Button>
              ) : draft.phase === "review" ? (
                <Button className={styles.primary} onClick={makePortrait}>
                  {t("makePortrait")}
                  <ArrowRight size={16} aria-hidden />
                </Button>
              ) : draft.phase === "portrait" ? (
                <Button
                  className={styles.primary}
                  disabled={!result}
                  onClick={() => move("results")}
                >
                  {t("showStrategies")}
                  <ArrowRight size={16} aria-hidden />
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => move("review")}>
                  {t("editAnswers")}
                </Button>
              )}
            </div>
          )}
          <section className={styles.saving}>
            <label>
              <input
                type="checkbox"
                checked={progress.enabled}
                onChange={(e) => progress.toggle(e.target.checked)}
                aria-describedby={saveHelpId}
              />
              <Save size={16} aria-hidden />
              <span>{t("saveLabel")}</span>
            </label>
            <p id={saveHelpId} className={styles.hint}>
              {t("saveHelp")}
            </p>
            <p className={styles.saveStatus} role="status">
              {t(progress.conflict ? "savingPaused" : progress.status)}
            </p>
            {progress.enabled && (
              <Button variant="ghost" onClick={progress.remove}>
                {t("removeSaved")}
              </Button>
            )}
          </section>
        </>
      )}
      <p className={styles.privacy}>{t("privacy")}</p>
      <div className={styles.bottomActions}>
        <Button variant="ghost" onClick={onClose}>
          {t("returnArticle")}
        </Button>
        {mode && !progress.candidate && (
          <Button variant="ghost" onClick={restart}>
            <RotateCcw size={14} aria-hidden />
            {t("restart")}
          </Button>
        )}
      </div>
    </div>
  );
}
