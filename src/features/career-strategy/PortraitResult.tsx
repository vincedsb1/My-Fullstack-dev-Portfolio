"use client";
import { useTranslations } from "next-intl";
import type { Answers, Bundle, Result } from "./types";
import { buildPortrait } from "./build-portrait";
import styles from "./Assistant.module.css";
export default function Portrait({
  bundle,
  result,
  answers,
}: {
  bundle: Bundle;
  result: Result;
  answers: Answers;
}) {
  const t = useTranslations("careerStrategy");
  const groups = buildPortrait(bundle, result.dimensions);
  const priorities = ["q015", "q080"].flatMap((id) => {
    const answer = answers[id];
    return Array.isArray(answer)
      ? answer.map((option) => bundle.content.questions[id].options![option])
      : [];
  });
  return (
    <div className={styles.results}>
      {groups.map((group) => (
        <section
          className={styles.resultCard}
          key={group.id}
          data-portrait-group={group.id}
        >
          <h4>{group.title}</h4>
          {!group.details.length ? (
            <p>{t("noData")}</p>
          ) : (
            <>
              {group.highlights.length ? (
                group.highlights.map((d) => (
                  <div key={d.id} className={styles.observation}>
                    <span className={styles.tag}>
                      {t(d.tentative ? "tentative" : "observed")}
                    </span>
                    <p>
                      <strong>{d.label}</strong> — {d.text}.
                    </p>
                    <small>
                      {t("evidence", { count: d.observation.count })}
                      {d.observation.contradictory
                        ? ` · ${t("divergent")}`
                        : ""}
                    </small>
                  </div>
                ))
              ) : (
                <p>{t("neutralGroup")}</p>
              )}
              <details className={styles.details}>
                <summary>{t("details")}</summary>
                <ul>
                  {group.details.map((d) => (
                    <li key={d.id}>
                      <strong>{d.label}</strong> : {d.text}
                      {d.band !== "neutral" ? "." : ""}{" "}
                      <small>
                        {t("evidence", { count: d.observation.count })}
                        {d.tentative ? ` · ${t("tentative")}` : ""}
                        {d.observation.contradictory
                          ? ` · ${t("divergent")}`
                          : ""}
                      </small>
                    </li>
                  ))}
                </ul>
              </details>
            </>
          )}
        </section>
      ))}
      {!!priorities.length && (
        <section className={styles.resultCard}>
          <h4>{t("priorities")}</h4>
          <ul>
            {priorities.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>
      )}
      <section className={styles.notice}>
        <h4>{t("uncertaintyTitle")}</h4>
        <p>{t("uncertainty")}</p>
      </section>
    </div>
  );
}
