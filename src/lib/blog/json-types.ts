/** TypeScript v1 — le validateur runtime correspondant est json-source.mjs. */
export type BlogLocale = "fr" | "en";
export type BlogTone = "neutral" | "accent" | "info" | "success" | "warning";
export type RichNode = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  link?: { href: string; external?: boolean };
};
export type RichText = RichNode[];
/** Modules éditoriaux choisis via un registre fermé. Les cinq widgets SaaS restent FR tant que leurs copies EN ne sont pas rédigées. */
export type SaaSModuleName = Exclude<
  keyof typeof import("./json-custom-modules.json"),
  "metric-panel" | "saas-hero"
>;
export type CustomModule =
  | {
      component: "metric-panel";
      props: { value: string; label: string; caption?: string };
    }
  | { component: SaaSModuleName; props?: Record<string, never> }
  | { component: "saas-hero"; props?: Record<string, never> };
export type ArticleBlock =
  | { type: "paragraph" | "lead" | "highlight"; content: RichText }
  | { type: "heading"; level: 3 | 4; text: string; id?: string }
  | { type: "list"; ordered?: boolean; items: RichText[] }
  | { type: "quote"; content: RichText; attribution?: string }
  | { type: "callout"; title?: string; tone?: BlogTone; blocks: ArticleBlock[] }
  | {
      type: "cards";
      variant?: "info" | "action";
      items: Array<{
        title: string;
        description: RichText;
        blocks?: ArticleBlock[];
        number?: string;
        href?: string;
        actionLabel?: string;
      }>;
    }
  | { type: "table"; caption: string; columns: string[]; rows: string[][] }
  | {
      type: "figure";
      src: string;
      alt: string;
      caption?: string;
      width?: number;
      height?: number;
    }
  | {
      type: "code";
      code: string;
      language: string;
      title?: string;
      copyable?: boolean;
      id?: string;
    }
  | { type: "video"; provider: "youtube"; id: string; title: string }
  | {
      type: "checklist";
      storageKey: string;
      printNote?: string;
      items: Array<{ id: string; label: string }>;
    }
  | {
      type: "accordion";
      items: Array<{ title: string; blocks: ArticleBlock[] }>;
    }
  | ({ type: "custom" } & Exclude<CustomModule, { component: "saas-hero" }>);
export type JsonBlogArticle = {
  schemaVersion: 1;
  meta: {
    title: string;
    description: string;
    excerpt: string;
    slug: string;
    locale: BlogLocale;
    category: string;
    publishedAt: string;
    updatedAt?: string;
    status: "published" | "draft";
    cover?: string;
    coverAlt?: string;
    translationKey?: string;
    seoTitle?: string;
    relatedProjects?: string[];
  };
  hero?: {
    eyebrow?: string;
    titleHighlight?: string;
    primaryCta?: { label: string; target: "content" };
    visual?: Extract<CustomModule, { component: "metric-panel" | "saas-hero" }>;
  };
  /** Ancres publiques du rendu précédent, conservées lors d’une migration. */
  legacyAnchors?: { top?: string; content?: string };
  readingNote?: { title: string; content: RichText };
  author?: { description: string };
  introBlocks?: ArticleBlock[];
  sections: Array<{
    id: string;
    title: string;
    number?: boolean;
    eyebrow?: string;
    blocks: ArticleBlock[];
  }>;
  afterBlocks?: ArticleBlock[];
  related?: { slugs: string[] };
};
