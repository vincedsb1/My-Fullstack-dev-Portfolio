import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Mail, ShoppingBag } from "lucide-react";

import cover from "../../../docs/Julie_Dieris-Le_Silence_de_la_Nuit-Cover.png";
import DownloadModal from "./DownloadModal";
import { AndroidIcon, WindowsIcon } from "./PlatformIcons";
import styles from "./page.module.css";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Le Silence de la Nuit — Julie Dieris",
  description:
    "Découvrez Le Silence de la Nuit de Julie Dieris et téléchargez votre exemplaire ePub avec votre code d'accès.",
  alternates: { canonical: `${baseUrl}/juliedieris` },
  openGraph: {
    title: "Le Silence de la Nuit — Julie Dieris",
    description:
      "Découvrez Le Silence de la Nuit de Julie Dieris et téléchargez votre exemplaire ePub.",
    url: `${baseUrl}/juliedieris`,
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: cover.src,
        width: 1686,
        height: 2528,
        alt: "Couverture du livre Le Silence de la Nuit",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function JulieDierisPage() {
  return (
    <main className={styles.page} lang="fr">
      <div className={styles.main}>
        <div className={styles.layout}>
          <div className={styles.coverColumn}>
            <div className={styles.coverGlow} aria-hidden="true" />
            <Image
              src={cover}
              alt="Couverture du livre Le Silence de la Nuit"
              className={styles.cover}
              sizes="(max-width: 640px) 66vw, (max-width: 1023px) 50vw, 440px"
              priority
            />
          </div>

          <div className={styles.content}>
            <p className={styles.eyebrow}>Parution exclusive</p>

            <h1 className={styles.title}>
              Le <br className={styles.desktopBreak} />
              <span className={styles.goldText}>Silence</span>
              <br />
              de la <br className={styles.desktopBreak} />
              <span className={`${styles.goldText} ${styles.night}`}>Nuit</span>
            </h1>

            <p className={styles.author}>de Julie Dieris</p>

            <div className={styles.actions}>
              <DownloadModal />

              <div className={styles.utilityLinks}>
                <span
                  className={`${styles.utilityLink} ${styles.utilityLinkDisabled}`}
                  aria-disabled="true"
                >
                  <ShoppingBag aria-hidden="true" size={16} />
                  Bientôt disponible sur Amazon
                </span>
                <a
                  className={styles.utilityLink}
                  href="https://www.instagram.com/dragibus44/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ouvrir le profil Instagram"
                  aria-label="Contacter l'autrice sur Instagram"
                >
                  <Mail aria-hidden="true" size={16} />
                  Contacter l&apos;autrice
                </a>
              </div>
            </div>

            <section
              className={styles.readerGuidance}
              aria-labelledby="juliedieris-reader-title"
            >
              <div className={styles.readerHeader}>
                <h2
                  id="juliedieris-reader-title"
                  className={styles.readerHeading}
                >
                  Besoin d&apos;une application pour lire l&apos;ePub&nbsp;?
                </h2>
                <p className={styles.readerIntro}>
                  Choisissez le lecteur adapté à votre appareil.
                </p>
              </div>

              <div className={styles.readerGrid}>
                <article className={styles.readerCard}>
                  <div className={styles.readerCardHeading}>
                    <span
                      className={`${styles.readerIcon} ${styles.readerIconAndroid}`}
                    >
                      <AndroidIcon className={styles.androidMark} />
                    </span>
                    <div>
                      <p className={styles.readerPlatform}>ANDROID</p>
                      <h3 className={styles.readerName}>Google Play Livres</h3>
                    </div>
                  </div>
                  <p className={styles.readerDescription}>
                    Un lecteur conseillé pour ouvrir votre ePub sur Android.
                  </p>
                  <a
                    className={styles.readerLink}
                    href="https://play.google.com/store/apps/details?hl=fr&id=com.google.android.apps.books"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Installer l&apos;application
                    <ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                </article>

                <article className={styles.readerCard}>
                  <div className={styles.readerCardHeading}>
                    <span
                      className={`${styles.readerIcon} ${styles.readerIconWindows}`}
                    >
                      <WindowsIcon />
                    </span>
                    <div>
                      <p className={styles.readerPlatform}>WINDOWS</p>
                      <h3 className={styles.readerName}>Calibre</h3>
                    </div>
                  </div>
                  <p className={styles.readerDescription}>
                    Un lecteur ePub pour votre ordinateur Windows.
                  </p>
                  <a
                    className={styles.readerLink}
                    href="https://calibre-ebook.com/dist/win64"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Télécharger Calibre
                    <ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                </article>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
