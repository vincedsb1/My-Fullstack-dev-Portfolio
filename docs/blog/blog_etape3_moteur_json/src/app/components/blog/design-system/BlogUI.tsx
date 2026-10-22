import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import ShareButtons from "../ShareButtons";
import CopyButton from "../CopyButton";
import { BlogReadingProgress } from "./BlogReadingControls";

export type BlogTone = "neutral" | "accent" | "success" | "warning" | "info";

export function BlogSiteHeader({
  locale = "fr",
  shareTitle,
  progressTargetId,
  children,
}: {
  locale?: "fr" | "en";
  shareTitle?: string;
  progressTargetId?: string;
  children?: ReactNode;
}) {
  return (
    <header className="blog-ds__site-header">
      <nav className="blog-ds__header-inner" aria-label={locale === "fr" ? "Navigation principale" : "Main navigation"}>
        <Link href={`/${locale}`} className="blog-ds__wordmark">
          Vincent DESBROSSES<span aria-hidden="true">.</span>
        </Link>
        <Link href={`/${locale}/blog`} className="blog-ds__nav-blog">
          {locale === "fr" ? "Le blog" : "The blog"}
        </Link>
        <div className="blog-ds__header-actions">
          {children}
          {shareTitle ? <ShareButtons title={shareTitle} /> : null}
          <ThemeToggle />
        </div>
      </nav>
      {progressTargetId ? <BlogReadingProgress targetId={progressTargetId} /> : null}
    </header>
  );
}

export function BlogBreadcrumbs({
  items,
  locale = "fr",
}: {
  items: ReadonlyArray<{ label: string; href?: string }>;
  locale?: "fr" | "en";
}) {
  return (
    <nav className="blog-ds__breadcrumb" aria-label={locale === "fr" ? "Fil d’Ariane" : "Breadcrumb"}>
      <ol>
        {items.map((item, index) => (
          <li key={`${index}-${item.label}`}>
            {index > 0 ? <span aria-hidden="true" className="blog-ds__breadcrumb-separator">/</span> : null}
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function BlogEyebrow({ children }: { children: ReactNode }) {
  return <p className="blog-ds__eyebrow"><span aria-hidden="true" />{children}</p>;
}

export function BlogArticleHero({
  category,
  title,
  excerpt,
  publishedLabel,
  publishedAt,
  readingLabel,
  author = "Vincent DESBROSSES",
  authorRole = "Développeur Fullstack",
  illustration,
  headingLevel = 1,
  ctaLabel = "Commencer la lecture",
  ctaTarget = "blog-article-body",
}: {
  category: string;
  title: string;
  excerpt: string;
  publishedLabel: string;
  publishedAt?: string;
  readingLabel: string;
  author?: string;
  authorRole?: string;
  illustration?: ReactNode;
  headingLevel?: 1 | 2;
  ctaLabel?: string;
  ctaTarget?: string;
}) {
  const heading = headingLevel === 1
    ? <h1 className="blog-ds__hero-title">{title}</h1>
    : <h2 className="blog-ds__hero-title">{title}</h2>;

  return (
    <header className={`blog-ds__hero${illustration ? " blog-ds__hero--illustrated" : ""}`}>
      <div className="blog-ds__hero-copy">
        <BlogEyebrow>{category}</BlogEyebrow>
        {heading}
        <p className="blog-ds__hero-dek">{excerpt}</p>
        <div className="blog-ds__byline">
          <div className="blog-ds__avatar"><Image src="/pp.jpg" alt="" width={44} height={44} /></div>
          <div className="blog-ds__byline-author"><strong>{author}</strong><span>{authorRole}</span></div>
          <div className="blog-ds__byline-metadata">{publishedAt ? <time dateTime={publishedAt}>{publishedLabel}</time> : <span>{publishedLabel}</span>}<span>{readingLabel}</span></div>
        </div>
        <a href={`#${ctaTarget}`} className="blog-ds__button blog-ds__button--primary">
          {ctaLabel}<ArrowDown aria-hidden="true" size={16} />
        </a>
      </div>
      {illustration ? <div className="blog-ds__hero-visual">{illustration}</div> : null}
    </header>
  );
}

export function BlogSection({
  id,
  eyebrow,
  title,
  number,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  number?: string;
  children: ReactNode;
}) {
  return (
    <section className="blog-ds__section" id={id} aria-labelledby={`${id}-heading`}>
      <div className="blog-ds__section-header">
        {number ? <span className="blog-ds__section-number" aria-hidden="true">{number}</span> : null}
        {eyebrow ? <p className="blog-ds__section-eyebrow">{eyebrow}</p> : null}
        <h2 id={`${id}-heading`}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function BlogBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: BlogTone }) {
  return <span className="blog-ds__badge" data-tone={tone}>{children}</span>;
}

export function BlogButton({
  children,
  href,
  variant = "secondary",
  external = false,
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "text";
  external?: boolean;
}) {
  const cls = `blog-ds__button blog-ds__button--${variant}`;
  return external ? (
    <a className={cls} href={href} rel="noopener noreferrer" target="_blank">{children}<ArrowUpRight size={16} aria-hidden="true" /></a>
  ) : (
    <Link className={cls} href={href}>{children}<ArrowRight size={16} aria-hidden="true" /></Link>
  );
}

export function BlogCallout({ title, tone = "info", children }: { title: string; tone?: BlogTone; children: ReactNode }) {
  return <aside className="blog-ds__callout" data-tone={tone}><strong>{title}</strong><div>{children}</div></aside>;
}

export function BlogAccordion({ items }: { items: ReadonlyArray<{ title: string; content: string }> }) {
  return <div className="blog-ds__accordion">{items.map((item, index) => (
    <details key={`${index}-${item.title}`}><summary>{item.title}</summary><p>{item.content}</p></details>
  ))}</div>;
}

export function BlogIconList({ items, tone = "accent" }: { items: ReadonlyArray<string>; tone?: BlogTone }) {
  return <ul className="blog-ds__icon-list" data-tone={tone}>{items.map((item, i) => (
    <li key={`${i}-${item}`}><span aria-hidden="true">×</span>{item}</li>
  ))}</ul>;
}

export function BlogQuote({ children, attribution }: { children: ReactNode; attribution?: string }) {
  return <figure className="blog-ds__quote"><blockquote>{children}</blockquote>{attribution ? <figcaption>{attribution}</figcaption> : null}</figure>;
}

export function BlogInfoCard({
  number,
  title,
  description,
  children,
}: {
  number?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="blog-ds__info-card">
      {number ? <span className="blog-ds__card-index">{number}</span> : null}
      <h3>{title}</h3>{description ? <p>{description}</p> : null}
      {children ? <div className="blog-ds__card-action">{children}</div> : null}
    </div>
  );
}

export function BlogModuleFrame({
  eyebrow,
  title,
  description,
  note,
  tone = "neutral",
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  note?: string;
  tone?: BlogTone;
  children: ReactNode;
}) {
  return (
    <section className="blog-ds__module" data-tone={tone} aria-label={title}>
      <div className="blog-ds__module-head">
        {eyebrow ? <p className="blog-ds__module-eyebrow">{eyebrow}</p> : null}
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="blog-ds__module-content">{children}</div>
      {note ? <p className="blog-ds__module-note">{note}</p> : null}
    </section>
  );
}

export function BlogFigure({ children, caption, label }: { children: ReactNode; caption?: string; label: string }) {
  return <figure className="blog-ds__figure"><div className="blog-ds__figure-media" role="img" aria-label={label}>{children}</div>{caption ? <figcaption>{caption}</figcaption> : null}</figure>;
}

export function BlogCodeSample({ label, code }: { label: string; code: string }) {
  return <div className="blog-ds__code"><div className="blog-ds__code-toolbar"><span>{label}</span><CopyButton code={code} /></div><pre><code>{code}</code></pre></div>;
}

export function BlogAuthorCard({
  description = "Développeur Fullstack. Je partage mes expériences et mes réflexions autour du web, du produit et de la création de logiciels.",
  locale = "fr",
}: {
  description?: string;
  locale?: "fr" | "en";
}) {
  return <aside className="blog-ds__author-card" aria-label={locale === "fr" ? "À propos de l’auteur" : "About the author"}>
    <div className="blog-ds__author-avatar"><Image src="/pp.jpg" alt="" width={75} height={75} /></div>
    <div><p className="blog-ds__module-eyebrow">{locale === "fr" ? "Derrière ces articles" : "About the author"}</p><h3>Vincent DESBROSSES</h3><p>{description}</p>
      <Link href={`/${locale}`}>{locale === "fr" ? "Découvrir mes projets" : "View my projects"} <ArrowUpRight size={15} aria-hidden="true" /></Link>
    </div>
  </aside>;
}

export function BlogNextArticle({ eyebrow = "Pour continuer la lecture", title, href }: { eyebrow?: string; title: string; href: string }) {
  return <Link href={href} className="blog-ds__next-article"><div><span className="blog-ds__next-label"><BookOpen size={15} aria-hidden="true" />{eyebrow}</span><strong>{title}</strong></div><ArrowRight size={24} aria-hidden="true" /></Link>;
}

export function BlogPageFooter({ locale = "fr" }: { locale?: "fr" | "en" }) {
  return <footer className="blog-ds__footer"><Link href={`/${locale}`} className="blog-ds__wordmark">Vincent DESBROSSES<span aria-hidden="true">.</span></Link><Link href={`/${locale}/blog`}>{locale === "fr" ? "Tous les articles" : "All articles"} <ArrowUpRight aria-hidden="true" size={15} /></Link></footer>;
}

export function BlogReadingLayout({ navigation, children }: { navigation: ReactNode; children: ReactNode }) {
  return <div className="blog-ds__reading-layout"><div className="blog-ds__reading-sidebar">{navigation}</div><div className="blog-ds__reading-main">{children}</div></div>;
}
