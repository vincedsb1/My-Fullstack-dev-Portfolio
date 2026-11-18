"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ArrowLeft, ArrowRight, CornerDownRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  ANNOUNCED_QUESTIONS,
  CONCLUSION_ICON,
  PILLARS,
  QUESTIONS,
  TWIST_ICON,
  type PillarId,
} from "./journey";
import { HighlightedTitle } from "./HighlightedTitle";
import styles from "./Questionnaire.module.css";

type Props = {
  open: boolean;
  screen:
    | { kind: "twist" }
    | { kind: "pillar"; index: number }
    | { kind: "conclusion" };
  onPrevious: () => void;
  onNext: () => void;
};

const LEAVE_MS = 190;

export default function StoryScreen({
  open,
  screen,
  onPrevious,
  onNext,
}: Props) {
  const t = useTranslations("careerStrategy");
  const locale = useLocale();
  const id = useId();
  const title = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [leaving, setLeaving] = useState(false);
  const total = PILLARS.length;
  const pillar = screen.kind === "pillar" ? PILLARS[screen.index] : null;
  const key = pillar ? pillar.id : screen.kind;
  const Icon = pillar
    ? pillar.icon
    : screen.kind === "twist"
    ? TWIST_ICON
    : CONCLUSION_ICON;
  // Number of pillar segments already reached in the narrative progress bar.
  const reached =
    screen.kind === "pillar"
      ? screen.index + 1
      : screen.kind === "conclusion"
      ? total
      : 0;

  useLayoutEffect(() => {
    if (!open) return;
    const heading = title.current;
    const dialog = heading?.closest("dialog");
    if (dialog?.open) {
      heading?.focus({ preventScroll: true });
      dialog.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [key, open]);

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
    },
    [],
  );

  function next() {
    if (timer.current !== null) return;
    if (
      screen.kind === "conclusion" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      onNext();
      return;
    }
    setLeaving(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setLeaving(false);
      onNext();
    }, LEAVE_MS);
  }

  function previous() {
    if (timer.current === null) onPrevious();
  }

  function shortcuts(event: KeyboardEvent<HTMLDivElement>) {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.repeat
    )
      return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    } else if (event.key === "ArrowRight" && screen.kind !== "conclusion") {
      event.preventDefault();
      next();
    }
  }

  const label = t(`story.${screen.kind}.eyebrow`);

  return (
    <div className={styles.quiz} onKeyDown={shortcuts}>
      <div className={styles["bg-mesh"]} aria-hidden />
      <div className={styles["glass-panel"]}>
        <header className={styles["quiz-header"]}>
          <div className={styles["header-meta-row"]}>
            <div className={styles["breadcrumb-section"]}>
              {pillar ? (
                <>
                  <span>{label}</span>
                  <span className={styles["breadcrumb-sep"]}>·</span>
                  <strong>{t(`pillars.${pillar.id}.short`)}</strong>
                </>
              ) : (
                <strong>{label}</strong>
              )}
            </div>
            <div className={styles["header-controls"]}>
              <div className={styles["progress-stats"]}>
                {reached === 0
                  ? t("story.progressStart", { total })
                  : t("story.progress", { current: reached, total })}
              </div>
            </div>
          </div>
          <ol
            className={`${styles["chapters-bar"]} ${styles["story-bar"]}`}
            aria-label={t("story.progressLabel")}
          >
            {PILLARS.map((item, i) => (
              <li
                className={styles["chapter-track"]}
                key={item.id}
                aria-current={pillar?.id === item.id ? "step" : undefined}
              >
                <span className={styles["sr-only"]}>
                  {t("story.stepLabel", {
                    current: i + 1,
                    title: t(`pillars.${item.id}.short`),
                  })}
                </span>
                <span
                  aria-hidden
                  className={styles["chapter-fill"]}
                  style={{ width: i < reached ? "100%" : "0%" }}
                />
              </li>
            ))}
          </ol>
        </header>
        <section
          key={key}
          data-story={key}
          aria-labelledby={id}
          className={`${styles["question-stage"]} ${styles["story-stage"]} ${
            leaving
              ? styles["is-leaving"]
              : screen.kind === "twist"
              ? styles["is-twist"]
              : styles["is-entering"]
          }`}
        >
          <div className={styles["question-watermark"]} aria-hidden>
            <Icon aria-hidden size={128} style={{ strokeWidth: 1.5 }} />
          </div>
          <div className={styles["story-badge"]}>
            <span className={styles["story-icon"]}>
              <Icon aria-hidden size={20} />
            </span>
            {pillar && (
              <span className={styles["story-number"]}>
                {t("story.pillarNumber", { current: reached })}
              </span>
            )}
          </div>
          <h3
            id={id}
            ref={title}
            tabIndex={-1}
            className={styles["question-title"]}
          >
            <HighlightedTitle
              text={
                pillar
                  ? t(`pillars.${pillar.id}.title`)
                  : t(`story.${screen.kind}.title`, {
                      total: ANNOUNCED_QUESTIONS,
                    })
              }
              highlight={
                pillar
                  ? t(`pillars.${pillar.id}.highlight`)
                  : t(`story.${screen.kind}.highlight`)
              }
              locale={locale}
            />
          </h3>
          {pillar ? (
            <PillarBody id={pillar.id} />
          ) : (
            <div className={styles["story-text"]}>
              <p>
                {t(`story.${screen.kind}.p1`, {
                  remaining: ANNOUNCED_QUESTIONS - QUESTIONS.length,
                })}
              </p>
              <p>{t(`story.${screen.kind}.p2`)}</p>
              {screen.kind === "twist" && <p>{t("story.twist.p3")}</p>}
              {screen.kind === "conclusion" && (
                <p className={styles["story-signoff"]}>
                  {t("story.conclusion.signoff")}
                </p>
              )}
            </div>
          )}
        </section>
        <footer className={styles["quiz-footer"]}>
          <button
            type="button"
            className={`${styles["btn-nav"]} ${styles["btn-back"]}`}
            onClick={previous}
          >
            <ArrowLeft size={15} style={{ strokeWidth: 2.2 }} aria-hidden />
            {t("quizPrevious")}
          </button>
          {screen.kind !== "conclusion" && (
            <span className={styles["shortcut-hint"]}>
              {t.rich("storyShortcuts", {
                keycap: (chunks) => <kbd>{chunks}</kbd>,
              })}
            </span>
          )}
          <button
            type="button"
            className={`${styles["btn-nav"]} ${styles["btn-continue"]}`}
            onClick={next}
          >
            {screen.kind === "twist"
              ? t("story.twist.cta")
              : screen.kind === "conclusion"
              ? t("story.conclusion.cta")
              : t("next")}
            {screen.kind !== "conclusion" && (
              <ArrowRight size={15} style={{ strokeWidth: 2.2 }} aria-hidden />
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}

function PillarBody({ id }: { id: PillarId }) {
  const t = useTranslations("careerStrategy");
  return (
    <>
      <div className={styles["story-text"]}>
        <p>{t(`pillars.${id}.text`)}</p>
      </div>
      <div className={styles["story-actions"]}>
        <p className={styles["story-actions-title"]}>
          {t("story.actionsTitle")}
        </p>
        <ul>
          {(["action1", "action2"] as const).map((action) => (
            <li key={action}>
              <CornerDownRight aria-hidden size={16} />
              <span>{t(`pillars.${id}.${action}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
