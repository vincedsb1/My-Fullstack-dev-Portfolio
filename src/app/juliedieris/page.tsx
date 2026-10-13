import type { Metadata } from "next";
import Image from "next/image";
import { Download, Mail, ShoppingBag } from "lucide-react";

import cover from "../../../docs/Julie_Dieris-Le_Silence_de_la_Nuit-Cover.png";
import DownloadModal from "./DownloadModal";
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

            <div className={styles.calibre}>
              <p className={styles.calibreText}>
                Besoin d&apos;une application pour lire l&apos;ePub sur Windows
                ?
              </p>
              <a
                className={styles.calibreLink}
                href="https://calibre-ebook.com/dist/win64"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download aria-hidden="true" size={20} />
                Télécharger un lecteur (Calibre)
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
