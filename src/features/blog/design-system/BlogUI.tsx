import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import type { BlogTone } from "@/lib/blog/json-types";
export { default as BlogCodeSample } from "./BlogCodeSample";
export type { BlogTone } from "@/lib/blog/json-types";

export function BlogBreadcrumbs({
  items,
  locale = "fr",
}: {
  items: ReadonlyArray<{ label: string; href?: string }>;
  locale?: "fr" | "en";
}) {
  return (
    <nav
      className="blog-ds__breadcrumb"
      aria-label={locale === "fr" ? "Fil d’Ariane" : "Breadcrumb"}
    >
      <ol>
        {items.map((item, index) => (
          <li key={`${index}-${item.label}`}>
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="blog-ds__breadcrumb-separator"
              >
                /
              </span>
            ) : null}
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
  return (
    <p className="blog-ds__eyebrow">
      <span aria-hidden="true" />
      {children}
    </p>
  );
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
  const heading =
    headingLevel === 1 ? (
      <h1 className="blog-ds__hero-title">{title}</h1>
    ) : (
      <h2 className="blog-ds__hero-title">{title}</h2>
    );

  return (
    <header
      className={`blog-ds__hero${
        illustration ? " blog-ds__hero--illustrated" : ""
      }`}
    >
      <div className="blog-ds__hero-copy">
        <BlogEyebrow>{category}</BlogEyebrow>
        {heading}
        <p className="blog-ds__hero-dek">{excerpt}</p>
        <div className="blog-ds__byline">
          <div className="blog-ds__avatar">
            <Image src="/pp.jpg" alt="" width={44} height={44} />
          </div>
          <div className="blog-ds__byline-author">
            <strong>{author}</strong>
            <span>{authorRole}</span>
          </div>
          <div className="blog-ds__byline-metadata">
            {publishedAt ? (
              <time dateTime={publishedAt}>{publishedLabel}</time>
            ) : (
              <span>{publishedLabel}</span>
            )}
            <span>{readingLabel}</span>
          </div>
        </div>
        <ButtonLink
          href={`#${ctaTarget}`}
          className="blog-ds__button blog-ds__button--primary"
          variant="accent"
        >
          {ctaLabel}
          <ArrowDown aria-hidden="true" size={16} />
        </ButtonLink>
      </div>
      {illustration ? (
        <div className="blog-ds__hero-visual">{illustration}</div>
      ) : null}
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
    <section
      className="blog-ds__section"
      id={id}
      aria-labelledby={`${id}-heading`}
      tabIndex={-1}
    >
      <div className="blog-ds__section-header">
        {number ? (
          <span className="blog-ds__section-number" aria-hidden="true">
            {number}
          </span>
        ) : null}
        {eyebrow ? <p className="blog-ds__section-eyebrow">{eyebrow}</p> : null}
        <h2 id={`${id}-heading`} tabIndex={-1}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function BlogBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: BlogTone;
}) {
  return (
    <span className="blog-ds__badge" data-tone={tone}>
      {children}
    </span>
  );
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
    <ButtonLink
      className={cls}
      href={href}
      variant="ghost"
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </ButtonLink>
  ) : (
    <ButtonLink className={cls} href={href} variant="ghost">
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </ButtonLink>
  );
}

export function BlogCallout({
  title,
  tone = "info",
  children,
}: {
  title: string;
  tone?: BlogTone;
  children: ReactNode;
}) {
  return (
    <aside className="blog-ds__callout" data-tone={tone}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}

export function BlogAccordion({
  items,
}: {
  items: ReadonlyArray<{ title: string; content: ReactNode }>;
}) {
  return (
    <div className="blog-ds__accordion">
      {items.map((item, index) => (
        <details key={`${index}-${item.title}`}>
          <summary>{item.title}</summary>
          <div className="blog-ds__accordion-content">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

export function BlogIconList({
  items,
  tone = "accent",
}: {
  items: ReadonlyArray<string>;
  tone?: BlogTone;
}) {
  return (
    <ul className="blog-ds__icon-list" data-tone={tone}>
      {items.map((item, i) => (
        <li key={`${i}-${item}`}>
          <span aria-hidden="true">
            {tone === "success"
              ? "✓"
              : tone === "info"
              ? "i"
              : tone === "warning"
              ? "!"
              : "×"}
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function BlogQuote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <figure className="blog-ds__quote">
      <blockquote>{children}</blockquote>
      {attribution ? <figcaption>{attribution}</figcaption> : null}
    </figure>
  );
}

export function BlogInfoCard({
  number,
  title,
  description,
  variant = "info",
  action,
  children,
}: {
  number?: string;
  title: string;
  description?: ReactNode;
  variant?: "info" | "action";
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="blog-ds__info-card" data-variant={variant}>
      {number ? <span className="blog-ds__card-index">{number}</span> : null}
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {children ? (
        <div className="blog-ds__card-content">{children}</div>
      ) : null}
      {action ? <div className="blog-ds__card-action">{action}</div> : null}
    </div>
  );
}

export function BlogModuleFrame({
  eyebrow,
  title,
  description,
  note,
  tone = "neutral",
  titleAs: Title = "h3",
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  note?: string;
  tone?: BlogTone;
  titleAs?: "h3" | "p";
  children: ReactNode;
}) {
  return (
    <section className="blog-ds__module" data-tone={tone} aria-label={title}>
      <div className="blog-ds__module-head">
        {eyebrow ? <p className="blog-ds__module-eyebrow">{eyebrow}</p> : null}
        <Title className="blog-ds__module-title">{title}</Title>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="blog-ds__module-content">{children}</div>
      {note ? <p className="blog-ds__module-note">{note}</p> : null}
    </section>
  );
}

export function BlogFigure({
  children,
  caption,
  label,
}: {
  children: ReactNode;
  caption?: string;
  label?: string;
}) {
  return (
    <figure className="blog-ds__figure">
      {label ? (
        <div className="blog-ds__figure-media" role="img" aria-label={label}>
          {children}
        </div>
      ) : (
        children
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function BlogAuthorCard({
  description,
  locale = "fr",
  headingLevel = 2,
}: {
  description?: string;
  locale?: "fr" | "en";
  headingLevel?: 2 | 3;
}) {
  const Title = headingLevel === 2 ? "h2" : "h3";
  return (
    <aside
      className="blog-ds__author-card"
      aria-label={locale === "fr" ? "À propos de l’auteur" : "About the author"}
    >
      <div className="blog-ds__author-avatar">
        <Image src="/pp.jpg" alt="" width={75} height={75} />
      </div>
      <div>
        <p className="blog-ds__module-eyebrow">
          {locale === "fr" ? "Derrière ces articles" : "About the author"}
        </p>
        <Title className="blog-ds__author-name">Vincent DESBROSSES</Title>
        {description ? <p>{description}</p> : null}
        <Link href={`/${locale}`}>
          {locale === "fr" ? "Découvrir mes projets" : "View my projects"}{" "}
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}

export function BlogNextArticle({
  eyebrow = "Pour continuer la lecture",
  title,
  href,
}: {
  eyebrow?: string;
  title: string;
  href: string;
}) {
  return (
    <Link href={href} className="blog-ds__next-article">
      <div>
        <span className="blog-ds__next-label">
          <BookOpen size={15} aria-hidden="true" />
          {eyebrow}
        </span>
        <strong>{title}</strong>
      </div>
      <ArrowRight size={24} aria-hidden="true" />
    </Link>
  );
}

export function BlogReadingLayout({
  navigation,
  children,
}: {
  navigation: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="blog-ds__reading-layout">
      <div className="blog-ds__reading-sidebar">{navigation}</div>
      <div className="blog-ds__reading-main">{children}</div>
    </div>
  );
}
