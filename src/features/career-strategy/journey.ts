import {
  Building2,
  Check,
  CheckCheck,
  Circle,
  CircleHelp,
  Gem,
  Hand,
  Megaphone,
  Minus,
  Network,
  Package,
  PartyPopper,
  PiggyBank,
  Search,
  X,
} from "lucide-react";

/**
 * Parcours narratif : deux vraies questions, un retournement, cinq pistes et une
 * conclusion. Ce fichier ne porte que la structure et les icônes ; tous les textes
 * vivent dans le namespace next-intl `careerStrategy`.
 */

/** Taille annoncée du questionnaire, maintenue pour l’effet de surprise. */
export const ANNOUNCED_QUESTIONS = 30;
export const ANNOUNCED_MINUTES = 3;

/** Chapitres annoncés : seul le premier est réellement parcouru. */
export const CHAPTERS = [
  { id: "raisonnement", size: 2 },
  { id: "creation", size: 5 },
  { id: "apprentissage", size: 5 },
  { id: "organisation", size: 2 },
  { id: "relations", size: 4 },
  { id: "management", size: 1 },
  { id: "commerce", size: 4 },
  { id: "aspirations", size: 7 },
] as const;

export const QUESTIONS = [
  { id: "q001", icon: Search },
  { id: "q002", icon: Network },
] as const;

export const SCALE = [
  { id: "pas_du_tout", icon: X },
  { id: "plutot_non", icon: Minus },
  { id: "neutre", icon: Circle },
  { id: "plutot_oui", icon: Check },
  { id: "tout_a_fait", icon: CheckCheck },
] as const;

export const UNSURE = { id: "ne_sais_pas", icon: CircleHelp } as const;

export const PILLARS = [
  { id: "skills", icon: Gem },
  { id: "wealth", icon: PiggyBank },
  { id: "business", icon: Building2 },
  { id: "products", icon: Package },
  { id: "audience", icon: Megaphone },
] as const;

export const TWIST_ICON = Hand;
export const CONCLUSION_ICON = PartyPopper;

export type QuestionId = (typeof QUESTIONS)[number]["id"];
export type AnswerId = (typeof SCALE)[number]["id"] | typeof UNSURE.id;
export type PillarId = (typeof PILLARS)[number]["id"];

/** Étapes successives : accueil, questions, retournement, pistes, conclusion. */
export type Step =
  | { kind: "welcome" }
  | { kind: "question"; index: number }
  | { kind: "twist" }
  | { kind: "pillar"; index: number }
  | { kind: "conclusion" };

export const STEPS: readonly Step[] = [
  { kind: "welcome" },
  ...QUESTIONS.map((_, index) => ({ kind: "question" as const, index })),
  { kind: "twist" },
  ...PILLARS.map((_, index) => ({ kind: "pillar" as const, index })),
  { kind: "conclusion" },
];

/** Index de l’écran de retournement, à partir duquel la modale peut se fermer au clic extérieur. */
export const TWIST_STEP = STEPS.findIndex((step) => step.kind === "twist");
