import type { RefObject } from "react";
import { ArrowLeft, ArrowRight, Clock, Compass, Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./Questionnaire.module.css";

export function Welcome({
  total,
  chapters,
  title,
  onStart,
  onClose,
}: {
  total: number;
  chapters: number;
  title: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("careerStrategy");
  const steps = [
    t("phaseWelcome"),
    t("welcomeQuestionCount", { count: total }),
    t("phaseResults"),
  ];
  const cards = [
    { id: "pace", Icon: Clock, metric: t("welcomeDuration") },
    {
      id: "themes",
      Icon: Layers,
      metric: t("welcomeThemesCount", { count: chapters }),
    },
    { id: "outcome", Icon: Compass, metric: t("welcomeOutcomeTiming") },
  ] as const;
  return (
    <div className={`${styles.quiz} ${styles.welcome}`}>
      <div className={styles["bg-mesh"]} aria-hidden />
      <form
        className={`${styles["glass-panel"]} ${styles["welcome-view"]}`}
        onSubmit={(event) => {
          event.preventDefault();
          onStart();
        }}
      >
        <div className={styles["modal-topbar"]}>
          <span className={styles["brand-eyebrow"]}>
            <span className={styles["brand-pulse"]} aria-hidden />
            {t("dialogTitle")}
          </span>
        </div>

        <div>
          <ol
            className={styles["journey-stepper"]}
            aria-label={t("welcomeSteps")}
          >
            {steps.map((step, i) => (
              <li
                key={step}
                className={`${styles["journey-step"]} ${
                  i === 0 ? styles.active : ""
                }`}
                aria-current={i === 0 ? "step" : undefined}
              >
                <span className={styles["journey-pill"]} aria-hidden />
                {i + 1}. {step}
              </li>
            ))}
          </ol>
        </div>
        <div className={styles["welcome-hero"]}>
          <h3 ref={title} tabIndex={-1} className={styles["welcome-title"]}>
            {t.rich("welcomeTitle", {
              focus: (chunks) => <strong>{chunks}</strong>,
            })}
          </h3>
          <p className={styles["welcome-subtitle"]}>
            {t("welcomeDescription")}
          </p>
        </div>

        <div className={styles["info-bento-grid"]}>
          {cards.map(({ id, Icon, metric }) => (
            <div
              key={id}
              className={`${styles["info-bento-card"]} ${
                id === "outcome" ? styles["is-featured"] : ""
              }`}
            >
              <div className={styles["info-card-top"]}>
                <span className={styles["info-icon-box"]}>
                  <Icon size={18} aria-hidden />
                </span>
                <span className={styles["info-metric-tag"]}>{metric}</span>
              </div>
              <div>
                <div className={styles["info-card-title"]}>
                  {t(`welcomeCards.${id}.title`)}
                </div>
                <p className={styles["info-card-desc"]}>
                  {t(`welcomeCards.${id}.description`, { count: total })}
                </p>
              </div>
            </div>
          ))}
        </div>
        <footer className={styles["welcome-footer"]}>
          <button
            type="button"
            className={styles["btn-article-link"]}
            onClick={onClose}
          >
            <ArrowLeft size={15} aria-hidden /> {t("returnArticle")}
          </button>
          <button type="submit" className={styles["btn-start"]}>
            {t("start", { count: total })}{" "}
            <ArrowRight size={16} style={{ strokeWidth: 2.4 }} aria-hidden />
          </button>
        </footer>
      </form>
    </div>
  );
}
