import type {
  ProjectCaseStudyManifest,
  ProjectChallengeContent,
  ProjectLocale,
  ProjectWorkflowStep,
  TechnologyId,
} from "./types.ts";

const fixtureCopy = {
  fr: {
    rich: {
      title: "Fixture RICH — étude de cas",
      category: "Démonstration interne",
      hook: "Une page éditoriale riche, utilisée uniquement pour valider le template.",
      description:
        "Cette fixture ne décrit aucune réalisation réelle. Elle sert à vérifier la composition immersive, le workflow, l’architecture, la galerie et les défis.",
    },
    standard: {
      title: "Fixture STANDARD — étude de cas",
      category: "Démonstration interne",
      hook: "Une structure équilibrée pour un projet disposant de plusieurs preuves visuelles.",
      description:
        "Contenu synthétique de validation. Il ne doit jamais être indexé ni présenté comme une réalisation publiée.",
    },
    light: {
      title: "Fixture LIGHT — étude de cas",
      category: "Démonstration interne",
      hook: "Un format court qui reste élégant lorsque les informations disponibles sont limitées.",
      description:
        "Cette version vérifie la suppression propre des sections facultatives et l’absence d’espaces résiduels.",
    },
  },
  en: {
    rich: {
      title: "RICH fixture — case study",
      category: "Internal demonstration",
      hook: "A rich editorial page used only to validate the template.",
      description:
        "This fixture does not describe a real project. It validates the immersive composition, workflow, architecture, gallery and challenges.",
    },
    standard: {
      title: "STANDARD fixture — case study",
      category: "Internal demonstration",
      hook: "A balanced structure for a project with several visual proofs.",
      description:
        "Synthetic validation content. It must never be indexed or presented as a published achievement.",
    },
    light: {
      title: "LIGHT fixture — case study",
      category: "Internal demonstration",
      hook: "A concise format that remains elegant when only limited information is available.",
      description:
        "This version verifies clean omission of optional sections and the absence of residual whitespace.",
    },
  },
} as const;

function makeFixture(
  locale: "fr" | "en",
  variant: "rich" | "standard" | "light",
): ProjectCaseStudyManifest {
  const copy = fixtureCopy[locale][variant];
  const common = {
    schemaVersion: 1 as const,
    status: "fixture" as const,
    projectId: "fixture" as const,
    slug: `__fixture-${variant}`,
    locale,
    variant,
    meta: {
      title: copy.title,
      category: copy.category,
      year: "fixture",
      role: locale === "fr" ? "Validation visuelle" : "Visual validation",
    },
    seo: {
      title: copy.title,
      description: copy.description,
      noindex: true,
    },
    hero: {
      hook: copy.hook,
      description: copy.description,
      category: copy.category,
      year: "fixture",
      role: locale === "fr" ? "Validation visuelle" : "Visual validation",
      visual: {
        type: "mockup" as const,
        label: locale === "fr" ? "Aperçu de fixture" : "Fixture preview",
      },
    },
    overview: {
      problem:
        locale === "fr"
          ? "Les pages d’étude de cas doivent rester lisibles lorsque le contenu est riche, moyen ou très court."
          : "Case-study pages must remain readable when content is rich, medium-sized or very short.",
      audience:
        locale === "fr"
          ? "Recruteurs, développeurs et responsables produit"
          : "Recruiters, developers and product leaders",
      scope:
        locale === "fr"
          ? "Fixture de validation du système de composition"
          : "Composition-system validation fixture",
      role: locale === "fr" ? "Validation du template" : "Template validation",
      solution:
        locale === "fr"
          ? "Un rendu piloté par les données rend les sections optionnelles, les médias et les variations de densité indépendants."
          : "A data-driven renderer keeps optional sections, media and density variations independent.",
    },
    stack: ["nextjs", "typescript", "tailwind"] as TechnologyId[],
  };

  if (variant === "light") {
    return {
      ...common,
      workflow: undefined,
      architecture: undefined,
      gallery: [
        {
          id: "light-single-media",
          visual: {
            type: "placeholder",
            label: locale === "fr" ? "Capture unique" : "Single capture",
          },
          alt: locale === "fr" ? "Capture de fixture" : "Fixture capture",
          caption:
            locale === "fr"
              ? "Un média unique est affiché en grand format."
              : "A single media item is displayed at a large scale.",
        },
      ],
      challenges: [
        {
          id: "light-challenge",
          title: locale === "fr" ? "Densité éditoriale" : "Editorial density",
          problem:
            locale === "fr"
              ? "Peu de contenu disponible."
              : "Only a small amount of content is available.",
          solution:
            locale === "fr"
              ? "Supprimer les sections absentes sans laisser de trous visuels."
              : "Omit absent sections without leaving visual gaps.",
        },
      ],
      decisions: undefined,
      outcomes: undefined,
    };
  }

  const richFixture: ProjectCaseStudyManifest = {
    ...common,
    workflow: [
      {
        id: "fixture-step-1",
        title: locale === "fr" ? "Cadrage" : "Framing",
        description:
          locale === "fr"
            ? "Une étape courte présente le contexte et prépare la lecture."
            : "A short step introduces the context and prepares the reader.",
        visual: {
          type: "icon",
          icon: "sparkles",
          title: locale === "fr" ? "Contexte" : "Context",
          description:
            locale === "fr"
              ? "Visualisation icône, titre et description."
              : "Icon, title and description visual.",
        },
      },
      {
        id: "fixture-step-2",
        title: locale === "fr" ? "Exploration" : "Exploration",
        description:
          locale === "fr"
            ? "Une capture intégrée à un mockup vérifie le changement de panneau."
            : "A capture inside a mockup validates panel switching.",
        visual: {
          type: "mockup",
          title: locale === "fr" ? "Vue d’interface" : "Interface view",
          description:
            locale === "fr"
              ? "Visualisation média dans un cadre navigateur."
              : "Media visual inside a browser frame.",
          visual: {
            type: "placeholder",
            label: locale === "fr" ? "Mockup de fixture" : "Fixture mockup",
          },
        },
      },
      {
        id: "fixture-step-3",
        title: locale === "fr" ? "Flux" : "Flow",
        description:
          locale === "fr"
            ? "Une séquence de nœuds vérifie la lecture d’un parcours."
            : "A sequence of nodes validates flow comprehension.",
        visual: {
          type: "flow",
          title: locale === "fr" ? "Parcours principal" : "Main flow",
          description:
            locale === "fr"
              ? "Visualisation de flux réutilisable."
              : "Reusable flow visualisation.",
          steps: ["Input", "Process", "Output"],
        },
      },
      {
        id: "fixture-step-4",
        title: locale === "fr" ? "Résultat" : "Result",
        description:
          locale === "fr"
            ? "La dernière étape ferme le récit avec une illustration finale."
            : "The last step closes the story with a final illustration.",
        visual: {
          type: "result",
          title: locale === "fr" ? "Sortie" : "Output",
          description:
            locale === "fr"
              ? "Visualisation de résultat."
              : "Result visualisation.",
          visual: {
            type: "placeholder",
            label: locale === "fr" ? "Résultat de fixture" : "Fixture result",
          },
        },
      },
    ],
    architecture: {
      description:
        locale === "fr"
          ? "Un graphe non linéaire réservé à la validation des relations explicites."
          : "A non-linear graph used to validate explicit relationships.",
      nodes: [
        {
          id: "browser",
          label: "Browser",
          type: "client",
          role: "Entry point",
          icon: "monitor",
          position: { x: 8, y: 34 },
        },
        {
          id: "api",
          label: "API",
          type: "service",
          role: "Orchestration",
          icon: "server",
          highlight: true,
          position: { x: 50, y: 18 },
        },
        {
          id: "worker",
          label: "Worker",
          type: "async",
          role: "Background task",
          icon: "cpu",
          position: { x: 50, y: 72 },
        },
        {
          id: "database",
          label: "Database",
          type: "storage",
          role: "Persistence",
          icon: "database",
          position: { x: 91, y: 34 },
        },
      ],
      edges: [
        { id: "browser-api", from: "browser", to: "api", label: "request" },
        { id: "api-worker", from: "api", to: "worker", label: "queue" },
        { id: "worker-api", from: "worker", to: "api", label: "status" },
        { id: "api-db", from: "api", to: "database", label: "read/write" },
      ],
    },
    gallery: [
      {
        id: "gallery-1",
        visual: { type: "placeholder", label: "Desktop capture" },
        alt:
          locale === "fr"
            ? "Capture desktop de fixture"
            : "Fixture desktop capture",
        caption: locale === "fr" ? "Vue desktop." : "Desktop view.",
      },
      {
        id: "gallery-2",
        visual: { type: "placeholder", label: "Mobile capture" },
        alt:
          locale === "fr"
            ? "Capture mobile de fixture"
            : "Fixture mobile capture",
        caption: locale === "fr" ? "Vue mobile." : "Mobile view.",
      },
      {
        id: "gallery-3",
        visual: { type: "placeholder", label: "Comparison" },
        alt:
          locale === "fr"
            ? "Vue comparative de fixture"
            : "Fixture comparison view",
        caption: locale === "fr" ? "Vue comparative." : "Comparison view.",
      },
    ],
    challenges: [
      {
        id: "challenge-1",
        title:
          locale === "fr" ? "Relation non linéaire" : "Non-linear relationship",
        problem:
          locale === "fr"
            ? "Une simple succession de cartes ne suffit pas à représenter le flux."
            : "A simple sequence of cards cannot represent the flow.",
        constraint:
          locale === "fr"
            ? "Le diagramme doit rester lisible sur mobile."
            : "The diagram must remain readable on mobile.",
        decision:
          locale === "fr"
            ? "Déclarer les nœuds et les arêtes séparément."
            : "Declare nodes and edges separately.",
        solution:
          locale === "fr"
            ? "Rendre un SVG léger avec une alternative textuelle."
            : "Render a lightweight SVG with a text alternative.",
        result:
          locale === "fr"
            ? "Les relations restent explicites."
            : "Relationships remain explicit.",
      },
      {
        id: "challenge-2",
        title: locale === "fr" ? "Contenu variable" : "Variable content",
        problem:
          locale === "fr"
            ? "Toutes les études ne disposent pas des mêmes médias."
            : "Every case study does not have the same media.",
        solution:
          locale === "fr"
            ? "Chaque section est facultative et supprimée au niveau du rendu."
            : "Every section is optional and omitted at render time.",
      },
      {
        id: "challenge-3",
        title: locale === "fr" ? "Lecture progressive" : "Progressive reading",
        problem:
          locale === "fr"
            ? "Un mur de texte ralentit la compréhension."
            : "A wall of text slows comprehension.",
        solution:
          locale === "fr"
            ? "Alterner synthèse, preuves visuelles et décisions."
            : "Alternate summary, visual evidence and decisions.",
      },
    ],
    decisions: [
      {
        id: "decision-1",
        title: locale === "fr" ? "Rendu serveur" : "Server rendering",
        choice:
          locale === "fr"
            ? "Contenu initial en HTML indexable."
            : "Initial content in indexable HTML.",
        rationale:
          locale === "fr"
            ? "Le contenu principal doit rester utile sans JavaScript."
            : "The main content must remain useful without JavaScript.",
      },
    ],
    outcomes: [
      {
        id: "outcome-1",
        title: locale === "fr" ? "Validation obtenue" : "Validation obtained",
        description:
          locale === "fr"
            ? "La fixture couvre les variantes attendues sans prétendre mesurer un résultat produit."
            : "The fixture covers the expected variants without claiming a product outcome.",
      },
    ],
  };

  if (variant === "standard") {
    return {
      ...richFixture,
      workflow: richFixture.workflow?.slice(0, 3),
      architecture: undefined,
      gallery: richFixture.gallery?.slice(0, 2),
      challenges: richFixture.challenges?.slice(0, 2),
      decisions: undefined,
      outcomes: undefined,
    };
  }

  return richFixture;
}

export const projectFixtures = {
  fr: {
    rich: makeFixture("fr", "rich"),
    standard: makeFixture("fr", "standard"),
    light: makeFixture("fr", "light"),
  },
  en: {
    rich: makeFixture("en", "rich"),
    standard: makeFixture("en", "standard"),
    light: makeFixture("en", "light"),
  },
} as const;

export type FixtureVariant = keyof typeof projectFixtures.fr;

function makeCoverageChallenge(
  locale: ProjectLocale,
  index: number,
): ProjectChallengeContent {
  return {
    id: `coverage-challenge-${index}`,
    title:
      locale === "fr"
        ? `Défi complémentaire ${index}`
        : `Additional challenge ${index}`,
    problem:
      locale === "fr"
        ? "Le template doit conserver un rythme lisible lorsque le nombre de défis augmente."
        : "The template must keep a readable rhythm as the number of challenges grows.",
    solution:
      locale === "fr"
        ? "La grille responsive adapte la composition sans laisser de carte isolée problématique."
        : "The responsive grid adapts the composition without creating awkward isolated cards.",
  };
}

function makeCoverageWorkflowStep(
  locale: ProjectLocale,
  index: number,
): ProjectWorkflowStep {
  return {
    id: `coverage-step-${index}`,
    title:
      locale === "fr"
        ? `Étape complémentaire ${index}`
        : `Additional step ${index}`,
    description:
      locale === "fr"
        ? "Une étape supplémentaire vérifie la composition des workflows plus longs."
        : "An additional step verifies the composition of longer workflows.",
    visual: {
      type: "icon",
      icon: "layers",
      title: locale === "fr" ? "Variation" : "Variation",
      description:
        locale === "fr"
          ? "Visualisation générique réservée à la validation."
          : "Generic visualisation reserved for validation.",
    },
  };
}

export const projectFixtureCoverage = {
  oneChallenge: projectFixtures.fr.light,
  twoChallenges: projectFixtures.fr.standard,
  threeChallenges: projectFixtures.fr.rich,
  fourChallenges: {
    ...projectFixtures.fr.rich,
    slug: "__fixture-four-challenges",
    challenges: [
      ...(projectFixtures.fr.rich.challenges ?? []),
      makeCoverageChallenge("fr", 4),
    ],
  },
  fiveChallenges: {
    ...projectFixtures.fr.rich,
    slug: "__fixture-five-challenges",
    challenges: [
      ...(projectFixtures.fr.rich.challenges ?? []),
      makeCoverageChallenge("fr", 4),
      makeCoverageChallenge("fr", 5),
    ],
  },
  twoStepWorkflow: {
    ...projectFixtures.fr.rich,
    slug: "__fixture-two-step-workflow",
    workflow: projectFixtures.fr.rich.workflow?.slice(0, 2),
  },
  fiveStepWorkflow: {
    ...projectFixtures.fr.rich,
    slug: "__fixture-five-step-workflow",
    workflow: [
      ...(projectFixtures.fr.rich.workflow ?? []),
      makeCoverageWorkflowStep("fr", 5),
    ],
  },
  withoutWorkflow: {
    ...projectFixtures.fr.rich,
    slug: "__fixture-without-workflow",
    workflow: undefined,
  },
  withoutArchitecture: {
    ...projectFixtures.fr.rich,
    slug: "__fixture-without-architecture",
    architecture: undefined,
  },
} satisfies Record<string, ProjectCaseStudyManifest>;

export function getProjectFixture(
  locale: string,
  variant: string,
): ProjectCaseStudyManifest | undefined {
  if (locale !== "fr" && locale !== "en") return undefined;
  if (variant !== "rich" && variant !== "standard" && variant !== "light") {
    return undefined;
  }
  return projectFixtures[locale][variant];
}
