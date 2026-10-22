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
export type SaaSModuleName =
  | "saas-mosaic"
  | "saas-language-demo"
  | "saas-language-matrix"
  | "saas-acquisition-funnel"
  | "saas-decision-tree";
export type CustomModule =
  | {
      component: "metric-panel";
      props: { value: string; label: string; caption?: string };
    }
  | { component: SaaSModuleName; props?: Record<string, never> };
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
    }
  | { type: "video"; provider: "youtube"; id: string; title: string }
  | {
      type: "checklist";
      storageKey: string;
      items: Array<{ id: string; label: string }>;
    }
  | {
      type: "accordion";
      items: Array<{ title: string; blocks: ArticleBlock[] }>;
    }
  | ({ type: "custom" } & CustomModule);
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
    primaryCta?: { label: string; target: "content" };
    visual?: CustomModule;
  };
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
