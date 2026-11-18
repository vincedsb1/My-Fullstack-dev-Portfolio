"use client";
import { useTranslations } from "next-intl";
import type { Bundle, Result } from "./types";
import styles from "./Assistant.module.css";
export default function Recommendations({
  bundle,
  result,
}: {
  bundle: Bundle;
  result: Result;
}) {
  const t = useTranslations("careerStrategy");
  return (
    <div className={styles.results}>
      <p>
        {result.generic ? t("genericDescription") : t("strategiesDescription")}
      </p>
      <ol className={styles.strategyList}>
        {result.recommendations.map((s, index) => {
          const text = bundle.content.strategies[s.id];
          return (
            <li key={s.id} className={styles.resultCard} data-strategy={s.id}>
              <span className={styles.tag}>{t(s.kind)}</span>
              <div className={styles.strategyHeading}>
                <span className={styles.number} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h4>{text.title}</h4>
              </div>
              <p className={styles.hint}>
                {bundle.content.families[s.family]} · {text.horizon}
              </p>
              <p>{text.summary}</p>
              {!!s.reasons.length && (
                <div>
                  <strong>{t("why")}</strong>
                  <ul>
                    {s.reasons.map((id) => (
                      <li key={id}>{text.reasons[id]}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!!s.conflicts.length && (
                <div className={styles.notice}>
                  <strong>{t("conflict")}</strong>
                  <ul>
                    {s.conflicts.map((id) => (
                      <li key={id}>{text.reasons[id]}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <strong>{t("actions")}</strong>
                <ul>
                  {text.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
              {!!s.cautions.length && (
                <div className={styles.notice}>
                  <strong>{t("reservations")}</strong>
                  <ul>
                    {s.cautions.map((id) => (
                      <li key={id}>{text.cautions[id]}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className={styles.hint}>
                <strong>{t("limitation")}</strong> : {text.caveat}
              </p>
            </li>
          );
        })}
      </ol>
      <p className={styles.hint}>{bundle.content.scenario}</p>
      <p className={styles.hint}>{bundle.content.notice}</p>
      <p className={styles.hint}>
        {t("versionNote", {
          engine: bundle.engineVersion,
          catalog: bundle.catalogVersion,
        })}
      </p>
    </div>
  );
}
