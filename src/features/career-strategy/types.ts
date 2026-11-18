export type Locale = "fr" | "en";
export type Mode = "court" | "complet";
export type Answers = Record<string, string | string[]>;
export type Phase = "welcome" | "questions" | "review" | "portrait" | "results";
export type Question = {
  id: string;
  tier: "court" | "approfondi";
  type: "echelle" | "choix_multiple";
  answerSetId?: string;
  scoring?: { dimension: string; direction: 1 | -1; weight: number };
  minSelections?: number;
  maxSelections?: number;
  options?: { id: string }[];
};
export type Questionnaire = {
  schemaVersion: string;
  version: string;
  id: string;
  modes: { id: Mode; questionCount: number }[];
  dimensions: { id: string; group: string }[];
  sections: { id: string; questions: Question[] }[];
  answerSets: Record<string, { id: string; value: number | null }[]>;
};
export type Strategy = {
  id: string;
  family: string;
  signals: {
    id: string;
    dimension: string;
    direction: 1 | -1;
    weight: number;
  }[];
  bonuses: Record<string, Record<string, number>>;
  cautions: {
    id: string;
    dimension: string;
    operator: "gte" | "lte";
    threshold: number;
  }[];
};
export type Catalog = {
  schemaVersion: string;
  version: string;
  foundation: { id: string; family: string };
  families: Record<string, string>;
  fallback: string[];
  strategies: Strategy[];
};
export type StrategyText = {
  title: string;
  summary: string;
  horizon: string;
  steps: string[];
  caveat: string;
  reasons: Record<string, string>;
  cautions: Record<string, string>;
};
export type Content = {
  locale: Locale;
  title: string;
  scenario: string;
  notice: string;
  groups: Record<string, string>;
  answerLabels: Record<string, string>;
  sections: Record<string, { title: string; description: string }>;
  questions: Record<
    string,
    { prompt: string; options?: Record<string, string> }
  >;
  dimensions: Record<
    string,
    { label: string; positive: string; negative: string; neutral: string }
  >;
  families: Record<string, string>;
  strategies: Record<string, StrategyText>;
};
export type Bundle = {
  schemaVersion: 1;
  questionnaireVersion: string;
  catalogVersion: string;
  engineVersion: string;
  contentVersion: string;
  questionnaire: Questionnaire;
  catalog: Catalog;
  content: Content;
};
export type Dimension = {
  value: number;
  count: number;
  contradictory: boolean;
  questionIds: string[];
};
export type Recommendation = {
  id: string;
  family: string;
  score: number | null;
  reasons: string[];
  conflicts: string[];
  cautions: string[];
  kind: "foundation" | "general" | "exploratory" | "matched";
};
export type Result = {
  dimensions: Record<string, Dimension>;
  recommendations: Recommendation[];
  generic: boolean;
};
export type Draft = {
  mode: Mode | null;
  answers: Answers;
  phase: Phase;
  section: number;
  returnToReview: boolean;
};
