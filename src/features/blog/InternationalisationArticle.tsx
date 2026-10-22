import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Globe2,
  MoveUpRight,
} from "lucide-react";
import type { BlogArticleRecord } from "@/lib/blog/articles";
import { ArticleBreadcrumbs, formatBlogDate } from "./BlogComponents";

import ShareButtons from "./ShareButtons";
import {
  ReadingNavigation,
  ReadingProgress,
  PrintArticle,
} from "./InternationalisationReading";
import styles from "./InternationalisationArticle.module.css";
import { Avatar } from "@/components/ui/Avatar";

export default function InternationalisationArticle({
  article,
  readingMinutes,
  children,
}: {
  article: BlogArticleRecord;
  readingMinutes: number;
  children: ReactNode;
}) {
  const [titleStart, titleEnd] =
    article.metadata.title.split("internationaliser");
  return (
    <div className={styles.page} id="article-top">
      <a href="#article-body" className={styles.skipLink}>
        Aller au contenu
      </a>
      <div className="sticky top-20 z-40">
        <ReadingProgress />
        <div className="flex justify-end gap-3 p-3">
          <PrintArticle />
          <ShareButtons title={article.metadata.title} />
        </div>
      </div>

      <main id="main" className={styles.main}>
        <div className={styles.breadcrumbs}>
          <ArticleBreadcrumbs article={article} />
        </div>
        <article>
          <header className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span />
                {article.metadata.category} & réflexion
                <span className={styles.eyebrowDivider}>/</span>Retour
                d’expérience
              </p>
              <h1>
                {titleStart}
                <span>internationaliser</span>
                {titleEnd}
              </h1>
              <p className={styles.dek}>{article.metadata.excerpt}</p>
              <div className={styles.byline}>
                <Avatar size={44} alt="" className={styles.avatar} />
                <div>
                  <strong>Vincent DESBROSSES</strong>
                  <span>Développeur Fullstack</span>
                </div>
                <div className={styles.publication}>
                  <time dateTime={article.metadata.publishedAt}>
                    {formatBlogDate(article.metadata.publishedAt, "fr")}
                  </time>
                  <span>{readingMinutes} min de lecture</span>
                </div>
              </div>
              <a className={styles.startReading} href="#article-body">
                Explorer la réflexion
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>

            <div className={styles.heroArt} aria-hidden="true">
              <div className={styles.artTop}>
                <span>
                  <Globe2 size={16} /> Internationalisation
                </span>
                <span>FR → 世界</span>
              </div>
              <div className={styles.artEquation}>
                <span>6</span>
                <i>×</i>
                <span>6</span>
              </div>
              <p className={styles.artCaption}>
                Langue de l’interface <span>×</span> langue du contenu
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
                    combinaisons.
                    <br />
                    Une décision produit.
                  </span>
                </p>
                <MoveUpRight size={30} strokeWidth={1} />
              </div>
              <div className={styles.artSticker}>
                Plus de langues.
                <br />
                <strong>Plus de valeur ?</strong>
              </div>
            </div>
          </header>

          <div className={styles.readingLayout}>
            <ReadingNavigation />
            <div className={styles.articleColumn}>
              <div
                id="article-body"
                className={`blog-prose ${styles.prose}`}
                tabIndex={-1}
              >
                {children}
              </div>
              <footer className={styles.articleEnd}>
                <p className={styles.endMark}>La suite se mesure.</p>
                <div className={styles.endActions}>
                  <ShareButtons title={article.metadata.title} />
                  <a href="#article-top">
                    Retour en haut <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
                <div className={styles.authorCard}>
                  <Avatar size={80} alt="" className={styles.authorAvatar} />
                  <div>
                    <p className={styles.eyebrow}>Derrière cet article</p>
                    <strong>Vincent DESBROSSES</strong>
                    <p>
                      Développeur Fullstack. Je conçois des applications web et
                      partage les réflexions qui accompagnent leur création.
                    </p>
                    <Link href="/fr">
                      Découvrir mes projets{" "}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
                <Link
                  href="/fr/blog/guide-premier-emploi-developpeur"
                  className={styles.nextArticle}
                >
                  <div>
                    <span>
                      <BookOpen size={14} aria-hidden="true" /> Pour continuer
                      la lecture
                    </span>
                    <p>
                      Comment décrocher son premier emploi de développeur en
                      2026 ?
                    </p>
                  </div>
                  <ArrowRight size={24} aria-hidden="true" />
                </Link>
              </footer>
            </div>
          </div>
        </article>
        <div className={styles.colophon}>
          <Link href="/fr">
            Vincent DESBROSSES<span>.</span>
          </Link>
          <Link href="/fr/blog">
            Tous les articles <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </main>
    </div>
  );
}
