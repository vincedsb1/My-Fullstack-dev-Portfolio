import { ArticleIcon } from "@phosphor-icons/react/dist/ssr/Article";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { BriefcaseIcon } from "@phosphor-icons/react/dist/ssr/Briefcase";
import { DownloadSimpleIcon } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { LinkedinLogoIcon } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { XLogoIcon } from "@phosphor-icons/react/dist/ssr/XLogo";
import { getLocale, getTranslations } from "next-intl/server";
import { Avatar } from "@/components/ui/Avatar";
import { getPathname } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { AUTHOR, SOCIAL_LINKS } from "@/lib/site";
import { heroInter } from "./heroFont";
import styles from "./Header.module.css";

export default async function Hero() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("header");
  const blogHref = getPathname({ locale, href: "/blog" });
  const socialLinks = [
    {
      key: "linkedin",
      href: SOCIAL_LINKS.linkedin[locale],
      label: t("social.linkedin"),
      ariaLabel: t("social.linkedinAria"),
      external: true,
      Icon: LinkedinLogoIcon,
    },
    {
      key: "github",
      href: SOCIAL_LINKS.github,
      label: t("social.github"),
      ariaLabel: t("social.githubAria"),
      external: true,
      Icon: GithubLogoIcon,
    },
    {
      key: "x",
      href: SOCIAL_LINKS.x,
      label: t("social.x"),
      ariaLabel: t("social.xAria"),
      external: true,
      Icon: XLogoIcon,
    },
    {
      key: "malt",
      href: SOCIAL_LINKS.malt,
      label: t("social.malt"),
      ariaLabel: t("social.maltAria"),
      external: true,
      Icon: BriefcaseIcon,
    },
    {
      key: "blog",
      href: blogHref,
      label: t("social.blog"),
      ariaLabel: t("social.blogAria"),
      external: false,
      Icon: ArticleIcon,
    },
  ];
  return (
    <section
      id="hero"
      className={`${styles.hero} ${heroInter.className}`}
      aria-labelledby="hero-title"
    >
      <div className={styles.backgroundGrid} aria-hidden="true" />
      <div className={styles.topGlow} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.copy}>
          <div
            className={`${styles.pillWrap} ${styles.reveal} ${styles.delay100}`}
          >
            <div className={styles.pill}>
              <span className={styles.status} aria-hidden="true">
                <span />
                <span />
              </span>
              {t("tagline")}
            </div>
          </div>

          <h1
            id="hero-title"
            className={`${styles.name} ${styles.reveal} ${styles.delay200}`}
          >
            <span className={styles.givenName}>{t("firstName")}</span>
            <span className={styles.familyName}>{t("lastName")}</span>
          </h1>

          <h2
            className={`${styles.jobTitle} ${styles.reveal} ${styles.delay300}`}
          >
            {t("jobTitleStart")}{" "}
            <span className={styles.jobSeparator} aria-hidden="true">
              ·
            </span>{" "}
            {t("jobTitleEnd")}
          </h2>

          <p
            className={`${styles.description} ${styles.reveal} ${styles.delay400}`}
          >
            {t("descriptionStart")}
            <strong>{t("descriptionHighlight")}</strong>
            {t("descriptionEnd")}
          </p>

          <div
            className={`${styles.actions} ${styles.reveal} ${styles.delay500}`}
          >
            <div className={styles.primaryActions}>
              <a
                className={styles.contactButton}
                href={`mailto:${AUTHOR.email}`}
              >
                <span>{t("contactAction")}</span>
                <span className={styles.buttonIcon} aria-hidden="true">
                  <ArrowRightIcon size={18} weight="bold" />
                </span>
              </a>
              <a
                className={styles.resumeButton}
                href={
                  locale === "fr"
                    ? "/cv-vincent-desbrosses-fr.pdf"
                    : "/resume-vincent-desbrosses-en.pdf"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.downloadIcon} aria-hidden="true">
                  <DownloadSimpleIcon size={20} weight="regular" />
                </span>
                <span>{t("resumeAction")}</span>
              </a>
            </div>

            <span className={styles.actionDivider} aria-hidden="true" />

            <nav
              className={styles.socialDock}
              aria-label={t("socialNavigation")}
            >
              {socialLinks.map(
                ({ key, href, label, ariaLabel, external, Icon }) => (
                  <span className={styles.tooltipContainer} key={key}>
                    <a
                      className={styles.socialLink}
                      href={href}
                      data-social={key}
                      aria-label={ariaLabel}
                      aria-describedby={`hero-${key}-tooltip`}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer me" : undefined}
                    >
                      <Icon
                        className={
                          key === "malt" || key === "blog"
                            ? styles.socialCompactMark
                            : styles.socialMark
                        }
                        size="100%"
                        weight="fill"
                        aria-hidden="true"
                      />
                    </a>
                    <span
                      className={styles.tooltip}
                      id={`hero-${key}-tooltip`}
                      role="tooltip"
                    >
                      {label}
                    </span>
                  </span>
                ),
              )}
            </nav>
          </div>
        </div>

        <div
          className={`${styles.avatarColumn} ${styles.reveal} ${styles.delay300}`}
        >
          <div className={styles.glowBlob} aria-hidden="true" />
          <div className={`${styles.photoFloat} ${styles.animateFloat}`}>
            <div className={`${styles.avatarRing} ${styles.gradientMove}`}>
              <Avatar
                size={352}
                sizes="(min-width: 768px) 348px, (min-width: 640px) 316px, 268px"
                loading="eager"
                fetchPriority="high"
                alt={t("profileAlt")}
                className={styles.photo}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
