"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  ANNOUNCED_MINUTES,
  ANNOUNCED_QUESTIONS,
  CHAPTERS,
  QUESTIONS,
  SCALE,
  UNSURE,
  type AnswerId,
} from "./journey";
import { HighlightedTitle } from "./HighlightedTitle";
import styles from "./Questionnaire.module.css";

type Props = {
  open: boolean;
  index: number;
  value?: AnswerId;
  onPrevious: () => void;
  onNext: () => void;
  // eslint-disable-next-line no-unused-vars -- Type-only callback parameter.
  onAnswer: (value: AnswerId) => void;
};

function spotlight(event: PointerEvent<HTMLButtonElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  card.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export default function QuestionField({
  open,
  index,
  value,
  onPrevious,
  onNext,
  onAnswer,
}: Props) {
  const t = useTranslations("careerStrategy");
  const locale = useLocale();
  const id = useId();
  const title = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [leaving, setLeaving] = useState(false);
  const question = QUESTIONS[index];
  const Icon = question.icon;
  const prompt = t(`questions.${question.id}.prompt`);
  const highlight = t(`questions.${question.id}.highlight`);
  // Only the first chapter is ever reached: the rest of the bar stays empty.
  const chapter = CHAPTERS[0];
  const remaining = ANNOUNCED_QUESTIONS - index;
  const minutes = Math.max(
    1,
    Math.round((ANNOUNCED_MINUTES * remaining) / ANNOUNCED_QUESTIONS),
  );

  useLayoutEffect(() => {
    if (!open) return;
    const heading = title.current;
    const dialog = heading?.closest("dialog");
    if (dialog?.open) {
      heading?.focus({ preventScroll: true });
      dialog.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [question.id, open]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      setLeaving(false);
      if (
        document.activeElement ===
        title.current?.closest("dialog")?.querySelector("button")
      ) {
        title.current?.focus({ preventScroll: true });
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
    };
  }, [open]);

  function select(option: AnswerId) {
    if (timer.current !== null) return;
    onAnswer(option);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onNext();
      return;
    }
    timer.current = setTimeout(() => {
      setLeaving(true);
      timer.current = setTimeout(() => {
        timer.current = null;
        setLeaving(false);
        onNext();
      }, 190);
    }, 260);
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
    const answer = /^[1-5]$/.test(event.key)
      ? SCALE[Number(event.key) - 1]
      : undefined;
    if (answer) {
      event.preventDefault();
      select(answer.id);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (timer.current === null) onPrevious();
    }
  }

  return (
    <div className={styles.quiz} onKeyDown={shortcuts}>
      <div className={styles["bg-mesh"]} aria-hidden />
      <div className={styles["glass-panel"]}>
        <header className={styles["quiz-header"]}>
          <div className={styles["header-meta-row"]}>
            <div className={styles["breadcrumb-section"]}>
              <span>
                {t("quizChapter", { current: 1, total: CHAPTERS.length })}
              </span>
              <span className={styles["breadcrumb-sep"]}>·</span>
              <strong>{t(`quizChapters.${chapter.id}`)}</strong>
            </div>
            <div className={styles["header-controls"]}>
              <div className={styles["progress-stats"]} aria-live="polite">
                <span className={styles["time-chip"]}>~{minutes} min</span>
                <span>
                  {index + 1} / {ANNOUNCED_QUESTIONS}
                </span>
              </div>
            </div>
          </div>
          <div className={styles["chapters-bar"]} aria-hidden>
            {CHAPTERS.map((item, i) => (
              <div className={styles["chapter-track"]} key={item.id}>
                <div
                  className={styles["chapter-fill"]}
                  style={{
                    width:
                      i === 0 ? `${((index + 1) / chapter.size) * 100}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>
        </header>
        <section
          key={question.id}
          data-question={question.id}
          aria-labelledby={id}
          className={`${styles["question-stage"]} ${
            leaving ? styles["is-leaving"] : styles["is-entering"]
          }`}
        >
          <div className={styles["question-hero"]}>
            <div className={styles["question-watermark"]} aria-hidden>
              <Icon aria-hidden size={128} style={{ strokeWidth: 1.5 }} />
            </div>
            <h3
              id={id}
              ref={title}
              tabIndex={-1}
              className={styles["question-title"]}
            >
              <HighlightedTitle
                text={prompt}
                highlight={highlight}
                locale={locale}
              />
            </h3>
            <div className={styles["question-context"]}>
              <p className={styles["context-text"]}>
                <span className={styles["context-lead"]}>
                  {t("quizExample")}
                </span>
                {t(`questions.${question.id}.context`)}
              </p>
            </div>
          </div>
          <div className={styles["answers-area"]}>
            <div
              className={styles["likert-grid"]}
              role="group"
              aria-labelledby={id}
            >
              {SCALE.map((option, i) => {
                const Glyph = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={value === option.id}
                    data-answer={option.id}
                    data-score={i + 1}
                    className={`${styles["likert-card"]} ${
                      value === option.id ? styles.selected : ""
                    }`}
                    style={{ "--i": i } as CSSProperties}
                    onPointerMove={spotlight}
                    onClick={() => select(option.id)}
                  >
                    <span className={styles["likert-glyph"]}>
                      <Glyph aria-hidden size={22} />
                    </span>
                    <span className={styles["likert-text"]}>
                      {t(`answerLabels.${option.id}`)}
                    </span>
                    <span aria-hidden className={styles["likert-kbd"]}>
                      {i + 1}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className={styles["neutral-exit-row"]}>
              <button
                type="button"
                aria-pressed={value === UNSURE.id}
                data-answer={UNSURE.id}
                className={`${styles["btn-unsure"]} ${
                  value === UNSURE.id ? styles.selected : ""
                }`}
                onClick={() => select(UNSURE.id)}
              >
                <UNSURE.icon aria-hidden size={14} />
                {t(`answerLabels.${UNSURE.id}`)}
              </button>
            </div>
          </div>
        </section>
        <footer className={styles["quiz-footer"]}>
          <button
            type="button"
            className={`${styles["btn-nav"]} ${styles["btn-back"]}`}
            onClick={() => {
              if (timer.current === null) onPrevious();
            }}
          >
            <ArrowLeft size={15} style={{ strokeWidth: 2.2 }} aria-hidden />
            {t("quizPrevious")}
          </button>
          <span className={styles["shortcut-hint"]}>
            {t.rich("quizShortcuts", {
              keycap: (chunks) => <kbd>{chunks}</kbd>,
            })}
          </span>
        </footer>
      </div>
    </div>
  );
}
