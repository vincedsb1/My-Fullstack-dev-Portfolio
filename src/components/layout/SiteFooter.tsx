import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { LinkedinLogoIcon } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { getTranslations } from "next-intl/server";
import { AUTHOR, SOCIAL_LINKS, SITE_NAME } from "@/lib/site";
import type { Locale } from "@/i18n/routing";
import { Avatar } from "@/components/ui/Avatar";
import styles from "./SiteFooter.module.css";

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  return (
    <footer
      id="contact"
      className={styles.footer}
      aria-labelledby="footer-title"
    >
      <div className={styles.backgroundGrid} aria-hidden="true" />
      <div className={styles.bottomGlow} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardGlow} aria-hidden="true" />
          <div className={styles.cardGlowWarm} aria-hidden="true" />
          <div className={styles.composition}>
            <div className={styles.avatarColumn}>
              <div className={styles.avatarRing}>
                <Avatar
                  size={160}
                  alt={t("profileAlt")}
                  sizes="(min-width: 1024px) 156px, (min-width: 640px) 140px, 124px"
                  className={styles.photo}
                />
              </div>
            </div>
            <div className={styles.copy}>
              <h2 id="footer-title" className={styles.title}>
                {t.rich("title", {
                  gradient: (chunks) => (
                    <span className={styles.titleGradient}>{chunks}</span>
                  ),
                })}
              </h2>
              <p className={styles.description}>
                {t.rich("description", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
              <div className={styles.actions}>
                <a
                  className={styles.emailButton}
                  href={`mailto:${AUTHOR.email}`}
                >
                  <EnvelopeSimpleIcon
                    size={18}
                    weight="bold"
                    aria-hidden="true"
                  />
                  <span>{t("email")}</span>
                </a>
                <a
                  className={styles.linkedinButton}
                  href={SOCIAL_LINKS.linkedin[locale]}
                  target="_blank"
                  rel="noopener noreferrer me"
                >
                  <LinkedinLogoIcon
                    size={20}
                    weight="fill"
                    aria-hidden="true"
                  />
                  <span>{t("linkedin")}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.credits}>
          <p>
            {t("copyright", {
              year: new Date().getFullYear(),
              name: SITE_NAME,
            })}
          </p>
          <div className={styles.technical}>{t("technical")}</div>
        </div>
      </div>
    </footer>
  );
}
