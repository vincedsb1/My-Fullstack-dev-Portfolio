export type ProjectLocale = "fr" | "en";

export type ProjectId =
  | "allaw"
  | "iconise"
  | "suggst"
  | "smartflow"
  | "aiSystem"
  | "aimoto"
  | "truthify"
  | "codeMaster"
  | "decorNature"
  | "teslaApp"
  | "liic"
  | "wilderGame"
  | "legalDirectory"
  | "legalConstat"
  | "emmausConnect";

export const technologyIds = [
  "nextjs",
  "react",
  "vue",
  "typescript",
  "javascript",
  "tailwind",
  "nodejs",
  "drizzle",
  "prisma",
  "better-auth",
  "mongodb",
  "postgresql",
  "mysql",
  "json",
  "python",
  "swift",
  "swiftui",
  "whisperkit",
  "screencapturekit",
  "xcode",
  "bash",
  "symfony",
  "css",
  "recharts",
  "gemini",
  "openai",
  "stripe",
  "ses",
  "next-intl",
  "sharp",
  "vectorizer",
  "umami",
  "playwright",
  "node-test",
  "vercel",
] as const;

export type TechnologyId = (typeof technologyIds)[number];

export type ProjectPlacement = "featured" | "other" | "archive";

export type ProjectKind =
  | "platform"
  | "saas"
  | "web-app"
  | "native-app"
  | "extension"
  | "tool"
  | "showcase";

export type ProjectMaturity =
  | "not-audited"
  | "active"
  | "implementation-verified"
  | "prototype"
  | "archived";

export type PortfolioVisibility = "visible" | "hidden";

export type CaseStudyPublicationStatus =
  | "not-started"
  | "draft"
  | "in-review"
  | "validated"
  | "published";

export interface ProjectExternalLink {
  url: string;
  verified: boolean;
  lastCheckedAt?: string;
}

export type ProjectVisualType =
  | "image"
  | "mockup"
  | "illustration"
  | "diagram"
  | "placeholder";

export interface ProjectVisual {
  type: ProjectVisualType;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  label?: string;
  imageId?: string;
}

export interface ProjectMediaReference extends ProjectVisual {
  id: string;
  verified: boolean;
  priority?: boolean;
}

export interface ProjectLocalePublication {
  status: CaseStudyPublicationStatus;
  manifestFile?: string;
  mdxFile?: string;
  lastReviewedAt?: string;
}

export interface ProjectCatalogEntry {
  id: ProjectId;
  slug: string;
  canonicalName: string;
  nameKey: string;
  descriptionKey: string;
  carouselDescriptionKey?: string;
  portfolioVisibility: PortfolioVisibility;
  placement: ProjectPlacement;
  order: number;
  kind: ProjectKind;
  maturity: ProjectMaturity;
  technologies: TechnologyId[];
  links: {
    live?: ProjectExternalLink;
    github?: ProjectExternalLink;
  };
  cardVisual?: ProjectMediaReference;
  illustration?: "iconise" | "suggst" | "smartflow" | "truthify" | "abstract";
  legacyIds?: string[];
  caseStudyByLocale: Partial<Record<ProjectLocale, ProjectLocalePublication>>;
  evidence: {
    sourceFiles: string[];
    notes?: string[];
  };
}

export interface ProjectSeoMetadata {
  title: string;
  description: string;
  socialImage?: ProjectVisual;
  noindex?: boolean;
}

export interface ProjectHeroContent {
  hook: string;
  description: string;
  pill?: string;
  category?: string;
  year?: string;
  role?: string;
  visual?: ProjectVisual;
}

export interface ProjectOverviewContent {
  problem: string;
  audience?: string;
  context?: string;
  scope?: string;
  role?: string;
  solution: string;
}

export type WorkflowVisual =
  | {
      type: "icon";
      icon?: string;
      title: string;
      description: string;
    }
  | {
      type: "mockup";
      title: string;
      description: string;
      visual: ProjectVisual;
    }
  | {
      type: "flow";
      title: string;
      description: string;
      steps: string[];
    }
  | {
      type: "result";
      title: string;
      description: string;
      visual?: ProjectVisual;
    };

export interface ProjectWorkflowStep {
  id: string;
  title: string;
  description: string;
  visual: WorkflowVisual;
}

export interface ProjectArchitectureNode {
  id: string;
  label: string;
  type: string;
  role: string;
  technology?: string;
  icon?: string;
  highlight?: boolean;
  position?: {
    x: number;
    y: number;
  };
}

export interface ProjectArchitectureEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  flow?: string;
}

export interface ProjectArchitectureContent {
  description: string;
  nodes: ProjectArchitectureNode[];
  edges: ProjectArchitectureEdge[];
  featuredNodeIds?: string[];
  featuredEdgeLabels?: string[];
  asyncFlows?: Array<{
    id: string;
    description: string;
  }>;
}

export interface ProjectChallengeContent {
  id: string;
  title: string;
  problem?: string;
  constraint?: string;
  decision?: string;
  solution?: string;
  tradeoff?: string;
  result?: string;
}

export interface ProjectGalleryItem {
  id: string;
  visual: ProjectVisual;
  alt: string;
  caption?: string;
}

export interface ProjectVideoContent {
  playLabel?: string;
  regionLabel?: string;
  url?: string;
  provider?: "file" | "youtube";
  poster?: ProjectVisual;
  caption?: string;
  verified: boolean;
}

export interface ProjectTechnicalDecision {
  id: string;
  title: string;
  choice: string;
  rationale: string;
  alternative?: string;
  constraint?: string;
}

export interface ProjectOutcomeContent {
  id: string;
  title: string;
  description: string;
  evidence?: string;
}

export interface ProjectCaseStudyManifest {
  schemaVersion: 1;
  status: "fixture" | "draft" | "published";
  projectId: ProjectId | "fixture";
  slug: string;
  locale: ProjectLocale;
  variant: "rich" | "standard" | "light";
  meta: {
    title: string;
    category: string;
    year?: string;
    role?: string;
  };
  seo: ProjectSeoMetadata;
  hero: ProjectHeroContent;
  overview: ProjectOverviewContent;
  stack?: TechnologyId[];
  workflow?: ProjectWorkflowStep[];
  architecture?: ProjectArchitectureContent;
  gallery?: ProjectGalleryItem[];
  video?: ProjectVideoContent;
  decisions?: ProjectTechnicalDecision[];
  challenges?: ProjectChallengeContent[];
  outcomes?: ProjectOutcomeContent[];
  limitations?: string[];
  mdxFile?: string;
}

export interface ProjectActionAvailability {
  detail: boolean;
  live: boolean;
  github: boolean;
}
