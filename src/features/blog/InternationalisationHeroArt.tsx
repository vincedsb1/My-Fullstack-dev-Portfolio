import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Globe2, MoveUpRight } from "lucide-react";
import styles from "./InternationalisationArticle.module.css";

/** Illustration serveur partagée par le rendu historique et le registre JSON. */
export default function InternationalisationHeroArt() {
  const t = useTranslations("blogSaas.hero");
  return (
    <div
      className={`${styles.heroArt} blog-ds__saas-hero-art`}
      aria-hidden="true"
    >
      <div className={styles.artTop}>
        <span>
          <Globe2 size={16} /> {t("name")}
        </span>
        <span>FR → 世界</span>
      </div>
      <div className={styles.artEquation}>
        <span>6</span>
        <i>×</i>
        <span>6</span>
      </div>
      <p className={styles.artCaption}>
        {t("interface")} <span>×</span> {t("content")}
      </p>
      <div className={styles.artGrid}>
        {Array.from({ length: 36 }, (_, index) => (
          <span
            key={index}
            data-highlight={index < 12 ? "true" : undefined}
            style={{ "--cell-index": index } as CSSProperties}
          />
        ))}
      </div>
      <div className={styles.artBottom}>
        <p>
          <strong>36</strong>
          <span>
            {t("combinations")}
            <br />
            {t("decision")}
          </span>
        </p>
        <MoveUpRight size={30} strokeWidth={1} />
      </div>
      <div className={styles.artSticker}>
        {t("more")}
        <br />
        <strong>{t("value")}</strong>
      </div>
    </div>
  );
}
