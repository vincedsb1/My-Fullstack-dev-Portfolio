import type { ProjectCaseStudyManifest } from "../types.ts";

const frenchHeroVisual = {
  type: "illustration" as const,
  imageId: "iconise-product-figure",
  label: "Iconise — workflow visuel",
};

const englishHeroVisual = {
  type: "illustration" as const,
  imageId: "iconise-product-figure",
  label: "Iconise — visual workflow",
};

const architectureFr = {
  description:
    "Une chaîne courte qui relie l’interface, les services métier, la persistance et les fournisseurs de génération.",
  featuredNodeIds: ["browser", "next", "postgres", "ai"],
  featuredEdgeLabels: [
    "RSC / Server Actions",
    "Repositories Drizzle",
    "Ports IA",
  ],
  nodes: [
    {
      id: "browser",
      label: "Interface React",
      type: "frontend",
      technology: "React 19 / Next.js Client Components",
      role: "Parcours de conception, import et rendu visuel",
      icon: "browser",
      highlight: true,
      position: { x: 12, y: 28 },
    },
    {
      id: "next",
      label: "Serveur Next.js",
      type: "server",
      technology: "Next.js 16 App Router",
      role: "Pages, actions et API",
      icon: "service",
      position: { x: 37, y: 28 },
    },
    {
      id: "auth",
      label: "Sessions et workspaces",
      type: "service",
      technology: "Better Auth",
      role: "Identité et périmètre de données",
      icon: "service",
      position: { x: 63, y: 28 },
    },
    {
      id: "domain",
      label: "Domaine et services",
      type: "service",
      technology: "TypeScript",
      role: "Règles du parcours, compilation, génération et crédits",
      icon: "service",
      highlight: true,
      position: { x: 88, y: 28 },
    },
    {
      id: "postgres",
      label: "Persistance",
      type: "database",
      technology: "PostgreSQL / Drizzle",
      role: "Projets, itérations, images, abonnements et crédits",
      icon: "database",
      position: { x: 37, y: 74 },
    },
    {
      id: "ai",
      label: "Génération externe",
      type: "integration",
      technology: "Gemini + OpenAI",
      role: "Image Gemini et texte créatif OpenAI, selon les flags",
      icon: "cloud",
      position: { x: 63, y: 74 },
    },
    {
      id: "stripe",
      label: "Facturation",
      type: "integration",
      technology: "Stripe",
      role: "Checkout, portail et événements signés",
      icon: "cloud",
      position: { x: 88, y: 74 },
    },
    {
      id: "ses",
      label: "E-mails",
      type: "integration",
      technology: "Amazon SES",
      role: "Courriels d’authentification et waitlist",
      icon: "cloud",
      position: { x: 12, y: 74 },
    },
  ],
  edges: [
    {
      id: "edge-01",
      from: "browser",
      to: "next",
      label: "HTTP / RSC / Server Actions",
    },
    {
      id: "edge-02",
      from: "next",
      to: "auth",
      label: "validation session / workspace",
    },
    { id: "edge-03", from: "next", to: "domain", label: "services métier" },
    {
      id: "edge-04",
      from: "domain",
      to: "postgres",
      label: "repositories Drizzle",
    },
    {
      id: "edge-05",
      from: "auth",
      to: "postgres",
      label: "compte / workspace",
    },
    {
      id: "edge-06",
      from: "domain",
      to: "ai",
      label: "port fournisseur text/image",
    },
    {
      id: "edge-07",
      from: "next",
      to: "stripe",
      label: "webhook signé / gateway",
    },
    {
      id: "edge-08",
      from: "domain",
      to: "ses",
      label: "courriers via adaptateur",
    },
  ],
  asyncFlows: [
    {
      id: "async-generation",
      description:
        "POST de création 202 → after(execute) → suivi de statut par le client",
    },
    {
      id: "async-webhook",
      description:
        "Stripe → signature webhook → relecture Stripe → synchronisation état et crédits",
    },
    {
      id: "async-email",
      description:
        "Action waitlist → jobs persistés → worker mail SES → confirmation",
    },
  ],
} satisfies NonNullable<ProjectCaseStudyManifest["architecture"]>;

const architectureEn = {
  description:
    "A short chain connecting the interface, domain services, persistence and generation providers.",
  featuredNodeIds: ["browser", "next", "postgres", "ai"],
  featuredEdgeLabels: [
    "RSC / Server Actions",
    "Drizzle repositories",
    "AI ports",
  ],
  nodes: [
    {
      id: "browser",
      label: "React interface",
      type: "frontend",
      technology: "React 19 / Next.js Client Components",
      role: "Design flow, import and visual rendering",
      icon: "browser",
      highlight: true,
      position: { x: 12, y: 28 },
    },
    {
      id: "next",
      label: "Next.js server",
      type: "server",
      technology: "Next.js 16 App Router",
      role: "Pages, actions and API",
      icon: "service",
      position: { x: 37, y: 28 },
    },
    {
      id: "auth",
      label: "Sessions and workspaces",
      type: "service",
      technology: "Better Auth",
      role: "Identity and data boundary",
      icon: "service",
      position: { x: 63, y: 28 },
    },
    {
      id: "domain",
      label: "Domain and services",
      type: "service",
      technology: "TypeScript",
      role: "Workflow rules, compilation, generation and credits",
      icon: "service",
      highlight: true,
      position: { x: 88, y: 28 },
    },
    {
      id: "postgres",
      label: "Persistence",
      type: "database",
      technology: "PostgreSQL / Drizzle",
      role: "Projects, iterations, images, subscriptions and credits",
      icon: "database",
      position: { x: 37, y: 74 },
    },
    {
      id: "ai",
      label: "External generation",
      type: "integration",
      technology: "Gemini + OpenAI",
      role: "Gemini images and OpenAI creative text, flag-dependent",
      icon: "cloud",
      position: { x: 63, y: 74 },
    },
    {
      id: "stripe",
      label: "Billing",
      type: "integration",
      technology: "Stripe",
      role: "Checkout, portal and signed events",
      icon: "cloud",
      position: { x: 88, y: 74 },
    },
    {
      id: "ses",
      label: "Email",
      type: "integration",
      technology: "Amazon SES",
      role: "Authentication and waitlist emails",
      icon: "cloud",
      position: { x: 12, y: 74 },
    },
  ],
  edges: [
    {
      id: "edge-01",
      from: "browser",
      to: "next",
      label: "HTTP / RSC / Server Actions",
    },
    {
      id: "edge-02",
      from: "next",
      to: "auth",
      label: "session / workspace validation",
    },
    {
      id: "edge-03",
      from: "next",
      to: "domain",
      label: "domain service calls",
    },
    {
      id: "edge-04",
      from: "domain",
      to: "postgres",
      label: "Drizzle repositories",
    },
    {
      id: "edge-05",
      from: "auth",
      to: "postgres",
      label: "account / workspace data",
    },
    {
      id: "edge-06",
      from: "domain",
      to: "ai",
      label: "text/image provider port",
    },
    {
      id: "edge-07",
      from: "next",
      to: "stripe",
      label: "signed webhook / gateway",
    },
    { id: "edge-08", from: "domain", to: "ses", label: "adapter-based email" },
  ],
  asyncFlows: [
    {
      id: "async-generation",
      description: "Creation POST 202 → after(execute) → client status polling",
    },
    {
      id: "async-webhook",
      description:
        "Stripe → signed webhook → Stripe object replay → state and credit sync",
    },
    {
      id: "async-email",
      description:
        "Waitlist action → persisted jobs → SES mail worker → confirmation",
    },
  ],
} satisfies NonNullable<ProjectCaseStudyManifest["architecture"]>;

const challengesFr = [
  {
    id: "ch-01",
    title: "Conserver la cohérence d’un workflow révisable",
    problem:
      "Une décision modifiée peut rendre les raffinements successifs caducs.",
    decision:
      "Réouvrir l’étape via des transitions de statut, marquer l’aval stale et conserver les itérations.",
    solution:
      "Le service de workflow invalide explicitement les décisions dépendantes sans supprimer l’historique.",
    tradeoff:
      "La complexité accrue nécessite des tests et une recette sur des environnements isolés.",
    result:
      "Évite de réutiliser des sélections devenues incohérentes ; aucun impact chiffré n’est documenté.",
  },
  {
    id: "ch-02",
    title: "Fiabiliser la génération payante asynchrone",
    problem:
      "Les appels fournisseurs peuvent durer et une réponse réseau perdue peut provoquer des doublons ou des crédits erronés.",
    decision:
      "Combiner une clé d’idempotence, une réponse HTTP 202, after() et un ledger revalidé par les webhooks.",
    solution:
      "La génération est réservée côté serveur puis suivie par statut, tandis que la facturation est confirmée par des événements signés.",
    tradeoff: "La fiabilité en production n’a pas été mesurée dans l’audit.",
    result:
      "Une tolérance architecturale aux appels longs et aux réponses perdues est présente dans le code vérifié.",
  },
  {
    id: "ch-03",
    title: "Normaliser une sortie IA imparfaite",
    problem:
      "Une grille incorrecte, une image vide ou un master mal cadré rend les découpes inutilisables.",
    decision:
      "Contrôler le ratio, les dimensions, les bordures et la géométrie de chaque case derrière un port fournisseur.",
    solution:
      "Les images sont validées avant d’entrer dans les étapes suivantes du workflow.",
    tradeoff: "Le taux de réussite des fournisseurs n’est pas documenté.",
    result:
      "Plusieurs classes d’images inutilisables peuvent être détectées avant intégration.",
  },
  {
    id: "ch-04",
    title: "Isoler les données multi-comptes",
    problem:
      "Un identifiant de projet envoyé par le navigateur ne constitue pas une preuve de possession.",
    decision:
      "Résoudre la session et le workspace côté serveur, puis appliquer les contraintes relationnelles adaptées.",
    solution:
      "Les lectures et mutations passent par un périmètre d’autorisation centralisé avant l’accès aux repositories.",
    tradeoff:
      "La présence de ces contrôles ne constitue pas un audit de pénétration complet.",
    result:
      "Une frontière d’autorisation workspace est observable dans le code audité.",
  },
  {
    id: "ch-05",
    title: "Maintenir deux langues distinctes",
    problem:
      "La langue de l’interface ne doit pas imposer la langue du contenu généré pour un projet.",
    decision:
      "Séparer user.locale et projects.content_locale avec un fallback anglais et des routes localisées.",
    solution:
      "L’interface, le contenu de projet et les URL SEO peuvent évoluer indépendamment.",
    tradeoff: "L’expérience réelle et son adoption n’ont pas été mesurées.",
    result:
      "Six catalogues et leur stratégie de locale sont définis dans le projet audité.",
  },
  {
    id: "ch-06",
    title: "Exporter une icône réduite et vectorisable",
    problem:
      "Un master bitmap n’est pas un SVG natif et peut perdre des détails à très petite taille.",
    decision:
      "Produire un tracé SVG dérivé et réduire progressivement les images pour les formats favicon.",
    solution:
      "Le pipeline distingue le master, le tracé dérivé et les différentes résolutions de livraison.",
    tradeoff: "La fidélité systématique des exports n’est pas mesurée.",
    result:
      "Un SVG dérivé et un pack favicon sont prévus par l’implémentation vérifiée.",
  },
  {
    id: "ch-07",
    title: "Lancer une waitlist avec garde-fous",
    problem:
      "Une inscription publique et des emails différés exposent à des doublons, du spam et des retraits incohérents.",
    decision:
      "Utiliser des tokens d’action, une persistance transactionnelle, des leases, des limites et des retries.",
    solution:
      "Le flux de waitlist est traité comme une opération durable plutôt qu’une simple soumission de formulaire.",
    tradeoff: "L’exploitation effective et le go externe restent inconnus.",
    result:
      "Les mécanismes sont présents dans les sources auditées, sans preuve d’activité publique.",
  },
] satisfies NonNullable<ProjectCaseStudyManifest["challenges"]>;

const challengesEn = [
  {
    id: "ch-01",
    title: "Keeping a revisable workflow coherent",
    problem: "Changing an earlier decision can invalidate later refinements.",
    decision:
      "Reopen steps through status transitions, mark downstream decisions stale and preserve iterations.",
    solution:
      "The workflow service explicitly invalidates dependent decisions without deleting history.",
    tradeoff: "The added complexity requires isolated tests and review.",
    result:
      "It prevents stale selections from being reused; no quantified impact is documented.",
  },
  {
    id: "ch-02",
    title: "Making paid asynchronous generation reliable",
    problem:
      "Provider calls can take time, and a lost network response can cause duplicate operations or incorrect credits.",
    decision:
      "Combine an idempotency key, an HTTP 202 response, after() and a ledger revalidated by webhooks.",
    solution:
      "Generation is reserved on the server and followed by status, while billing is confirmed through signed events.",
    tradeoff: "Production reliability was not measured in the audit.",
    result:
      "The verified code contains architectural tolerance for long calls and lost responses.",
  },
  {
    id: "ch-03",
    title: "Normalizing imperfect AI output",
    problem:
      "An invalid grid, empty image or badly cropped master makes downstream extraction unusable.",
    decision:
      "Validate ratios, dimensions, borders and cell geometry behind a provider port.",
    solution: "Images are validated before they enter the next workflow steps.",
    tradeoff: "Provider success rates are not documented.",
    result:
      "Several classes of unusable images can be detected before integration.",
  },
  {
    id: "ch-04",
    title: "Isolating multi-account data",
    problem:
      "A project identifier sent by the browser is not proof of ownership.",
    decision:
      "Resolve the session and workspace on the server, then apply relational constraints.",
    solution:
      "Reads and mutations cross a central authorization boundary before repository access.",
    tradeoff: "These controls are not a complete penetration test.",
    result:
      "A workspace authorization boundary is observable in the audited code.",
  },
  {
    id: "ch-05",
    title: "Keeping two languages independent",
    problem:
      "The interface language should not force the generated content language for a project.",
    decision:
      "Separate user.locale and projects.content_locale with an English fallback and localized routes.",
    solution:
      "Interface, project content and SEO URLs can evolve independently.",
    tradeoff: "Real-world experience and adoption were not measured.",
    result:
      "Six locale catalogs and their URL strategy are defined in the audited project.",
  },
  {
    id: "ch-06",
    title: "Exporting artwork that works at small sizes",
    problem:
      "A raster master is not a native SVG and can lose detail at favicon sizes.",
    decision:
      "Produce a derived SVG trace and downscale progressively for favicon formats.",
    solution:
      "The pipeline distinguishes the master, the derived trace and delivery resolutions.",
    tradeoff: "Systematic export fidelity is not measured.",
    result:
      "A derived SVG and favicon pack are provided for by the verified implementation.",
  },
  {
    id: "ch-07",
    title: "Launching a guarded waitlist",
    problem:
      "Public signup and deferred emails create duplicate, spam and unsubscribe risks.",
    decision:
      "Use action tokens, transactional persistence, leases, limits and retries.",
    solution:
      "The waitlist is treated as a durable operation rather than a simple form submission.",
    tradeoff: "Actual operation and external go-live status remain unknown.",
    result:
      "The mechanisms are present in the audited sources, without evidence of public activity.",
  },
] satisfies NonNullable<ProjectCaseStudyManifest["challenges"]>;

const decisionsFr = [
  {
    id: "td-01",
    title: "Monolithe Next.js à domaine isolé",
    choice: "Séparer UI, services métier, dépôts et accès SQL.",
    rationale:
      "Cette frontière évite de placer le SQL dans les composants ou le navigateur et concentre les contrôles serveur.",
    alternative: "ADR-001 documenté dans le dépôt Iconise.",
    constraint: "Décision documentée dans l’audit.",
  },
  {
    id: "td-02",
    title: "Mode manuel et mode intégré dans un parcours unique",
    choice:
      "Faire de l’itération l’unité commune aux deux voies de génération.",
    rationale:
      "Le fournisseur ne devient pas une nouvelle architecture de workflow.",
    alternative: "ADR-002 documenté dans le dépôt Iconise.",
    constraint:
      "L’activation réelle des fournisseurs dépend de flags externes.",
  },
  {
    id: "td-03",
    title: "Webhooks Stripe et crédits append-only",
    choice: "Attribuer les crédits après preuve de paiement relue.",
    rationale:
      "Cette décision évite de faire confiance à une simple redirection Checkout.",
    alternative: "ADR-002 documenté dans le dépôt Iconise.",
    constraint: "L’activité commerciale réelle n’a pas été vérifiée.",
  },
  {
    id: "td-04",
    title: "Ports fournisseurs IA et simulateurs",
    choice:
      "Rendre les fournisseurs substituables sans reconstruire le domaine.",
    rationale:
      "Le domaine peut être testé sans appels payants à un service externe.",
    alternative: "Simulateurs et ports observés dans l’implémentation.",
    constraint: "Les tests n’ont pas été exécutés pendant l’audit.",
  },
  {
    id: "td-05",
    title: "Internationalisation découplée du contenu",
    choice: "Séparer la langue de l’interface de celle du projet.",
    rationale:
      "Ce choix conserve la compatibilité avec des projets dont la langue de contenu est différente.",
    alternative: "ADR-003 documenté dans le dépôt Iconise.",
    constraint:
      "L’audit décrit six locales ; leur usage public reste à confirmer.",
  },
  {
    id: "td-06",
    title: "Conservation des itérations sur retour arrière",
    choice: "Invalider l’aval sans suppression irréversible.",
    rationale:
      "Choix déduit de l’implémentation auditée : les itérations restent disponibles avec un statut différent.",
    constraint: "Rationale personnelle non explicitement documentée.",
  },
  {
    id: "td-07",
    title: "Exports iconographiques multi-formats",
    choice: "Produire un SVG dérivé et plusieurs résolutions de livraison.",
    rationale:
      "Choix déduit de l’implémentation auditée pour servir les usages favicon et web.",
    constraint: "La fidélité systématique n’est pas mesurée.",
  },
  {
    id: "td-08",
    title: "Waitlist et ouverture contrôlées par flags",
    choice: "Ne pas déduire une ouverture publique d’un simple déploiement.",
    rationale: "Choix déduit de la configuration d’accès observée.",
    constraint: "Le mode de lancement effectif reste inconnu.",
  },
] satisfies NonNullable<ProjectCaseStudyManifest["decisions"]>;

const decisionsEn = [
  {
    id: "td-01",
    title: "Next.js monolith with an isolated domain",
    choice: "Separate UI, domain services, repositories and SQL access.",
    rationale:
      "This boundary keeps SQL out of components and the browser while concentrating server controls.",
    alternative: "ADR-001 documented in the Iconise repository.",
    constraint: "Documented decision in the audit.",
  },
  {
    id: "td-02",
    title: "Manual and integrated modes in one workflow",
    choice: "Make the iteration the shared unit for both generation paths.",
    rationale: "The provider does not become a second workflow architecture.",
    alternative: "ADR-002 documented in the Iconise repository.",
    constraint: "Actual provider availability depends on external flags.",
  },
  {
    id: "td-03",
    title: "Stripe webhooks and append-only credits",
    choice: "Assign credits only after replayed payment proof.",
    rationale: "This avoids trusting a simple Checkout redirect.",
    alternative: "ADR-002 documented in the Iconise repository.",
    constraint: "Actual commercial activity was not verified.",
  },
  {
    id: "td-04",
    title: "AI provider ports and simulators",
    choice: "Make providers replaceable without rebuilding the domain.",
    rationale: "The domain can be tested without paid external calls.",
    alternative: "Ports and simulators are visible in the implementation.",
    constraint: "Tests were not executed during the audit.",
  },
  {
    id: "td-05",
    title: "Internationalization independent from content",
    choice: "Separate interface language from project content language.",
    rationale:
      "This preserves compatibility with projects whose content language differs.",
    alternative: "ADR-003 documented in the Iconise repository.",
    constraint:
      "The audit describes six locales; public usage remains to be confirmed.",
  },
  {
    id: "td-06",
    title: "Preserving iterations when going back",
    choice: "Invalidate downstream state without irreversible deletion.",
    rationale:
      "Inferred from the audited implementation: iterations remain available with a different status.",
    constraint: "Personal rationale is not explicitly documented.",
  },
  {
    id: "td-07",
    title: "Multi-format icon exports",
    choice: "Produce a derived SVG and multiple delivery resolutions.",
    rationale:
      "Inferred from the audited implementation to serve favicon and web use cases.",
    constraint: "Systematic fidelity is not measured.",
  },
  {
    id: "td-08",
    title: "Flags-controlled waitlist and opening",
    choice: "Do not infer public availability from a deployment alone.",
    rationale: "Inferred from the observed access configuration.",
    constraint: "The actual launch mode remains unknown.",
  },
] satisfies NonNullable<ProjectCaseStudyManifest["decisions"]>;

const stack = [
  "nextjs",
  "typescript",
  "postgresql",
  "gemini",
  "stripe",
] as const;

const outcomesFr = [
  {
    id: "result-01",
    title: "Workflow séquencé et révisable",
    description:
      "Le parcours relie le cadrage, l’exploration, les itérations et la préparation des livrables.",
    evidence: "Vérifié dans l’audit : EV-003, EV-005.",
  },
  {
    id: "result-02",
    title: "Adaptateurs de génération",
    description:
      "Des adaptateurs de génération textuelle et image sont intégrés côté serveur.",
    evidence: "Vérifié dans l’audit : EV-010 à EV-012.",
  },
  {
    id: "result-03",
    title: "Facturation et crédits",
    description:
      "Les flux de génération peuvent être conditionnés par un système de crédits et de facturation.",
    evidence: "Vérifié dans l’audit : EV-014 à EV-016.",
  },
  {
    id: "result-04",
    title: "Livrables iconographiques",
    description:
      "Le projet prévoit un pack favicon et un SVG dérivé du master bitmap.",
    evidence: "Vérifié dans l’audit : EV-037 à EV-039.",
  },
  {
    id: "result-05",
    title: "Infrastructure multilingue",
    description:
      "Six locales sont définies avec une stratégie d’URL et de fallback.",
    evidence: "Vérifié dans l’audit : EV-023, EV-024.",
  },
] satisfies NonNullable<ProjectCaseStudyManifest["outcomes"]>;

const outcomesEn = [
  {
    id: "result-01",
    title: "Sequenced, revisable workflow",
    description:
      "The path connects framing, exploration, iteration and delivery preparation.",
    evidence: "Verified in the audit: EV-003, EV-005.",
  },
  {
    id: "result-02",
    title: "Generation adapters",
    description:
      "Server-side text and image generation adapters are implemented.",
    evidence: "Verified in the audit: EV-010 to EV-012.",
  },
  {
    id: "result-03",
    title: "Billing and credits",
    description:
      "Generation flows can be gated by a credit and billing system.",
    evidence: "Verified in the audit: EV-014 to EV-016.",
  },
  {
    id: "result-04",
    title: "Icon deliverables",
    description:
      "The project provides for a favicon pack and a derived SVG from the bitmap master.",
    evidence: "Verified in the audit: EV-037 to EV-039.",
  },
  {
    id: "result-05",
    title: "Multilingual infrastructure",
    description: "Six locales are defined with a URL and fallback strategy.",
    evidence: "Verified in the audit: EV-023, EV-024.",
  },
] satisfies NonNullable<ProjectCaseStudyManifest["outcomes"]>;

const limitationsFr = [
  "Dépôt privé : aucun CTA GitHub public ne doit être affiché.",
  "Le mode de production, les intégrations activées et les résultats commerciaux ne sont pas établis.",
  "Aucune capture actuelle d’écran authentifié n’est disponible ; l’illustration de cette page est une composition de portfolio, pas une capture produit.",
  "Des ADR historiques parlent de grilles 4×2 alors que le code courant utilise une grille 3×3 et une cible 4:3.",
  "Les tests n’ont pas été exécutés pendant l’audit ; aucun badge de CI verte ou chiffre de couverture n’est publié.",
  "Les prix codés ne doivent pas être présentés comme une offre commerciale actuelle sans validation.",
];

const limitationsEn = [
  "The repository is private: no public GitHub CTA should be displayed.",
  "Production mode, enabled integrations and commercial outcomes are not established.",
  "No current authenticated product screenshot is available; this page illustration is a portfolio composition, not a product capture.",
  "Historical ADRs mention 4×2 boards while current code uses a 3×3 board and a 4:3 target.",
  "Tests were not executed during the audit; no green CI badge or coverage figure is published.",
  "Coded prices must not be presented as a current commercial offer without validation.",
];

const frenchWorkflow = [
  {
    id: "frame",
    title: "Définir le projet",
    description: "Usage, contraintes et direction visuelle.",
    visual: {
      type: "icon" as const,
      icon: "monitor",
      title: "Un brief exploitable",
      description:
        "Le projet commence par un contexte structuré plutôt qu’un prompt isolé.",
    },
  },
  {
    id: "explore",
    title: "Explorer neuf pistes",
    description:
      "Générer ou importer une planche, puis sélectionner une case A–I.",
    visual: {
      type: "flow" as const,
      title: "Une planche, plusieurs options",
      description:
        "Une grille 3 × 3 conserve le contexte de l’exploration avant la sélection.",
      steps: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    },
  },
  {
    id: "refine",
    title: "Raffiner progressivement",
    description:
      "Ajuster géométrie, perception optique et fond ; certaines étapes peuvent être sautées.",
    visual: {
      type: "flow" as const,
      title: "Réviser sans effacer",
      description:
        "Les décisions dépendantes peuvent devenir stale sans supprimer l’historique.",
      steps: ["Choix", "Géométrie", "Optique", "Fond"],
    },
  },
  {
    id: "deliver",
    title: "Finaliser et exporter",
    description: "Obtenir le master, le SVG dérivé ou un pack favicon.",
    visual: {
      type: "result" as const,
      title: "Des livrables prêts à sortir du workflow",
      description:
        "Le master et ses dérivés sont traités comme des sorties distinctes.",
    },
  },
] satisfies NonNullable<ProjectCaseStudyManifest["workflow"]>;

const englishWorkflow = [
  {
    id: "frame",
    title: "Define the project",
    description: "Use case, constraints and visual direction.",
    visual: {
      type: "icon" as const,
      icon: "monitor",
      title: "A usable brief",
      description:
        "The project starts with structured context rather than an isolated prompt.",
    },
  },
  {
    id: "explore",
    title: "Explore nine paths",
    description: "Generate or import a board, then select an A–I cell.",
    visual: {
      type: "flow" as const,
      title: "One board, several options",
      description:
        "A 3 × 3 grid preserves exploration context before selection.",
      steps: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    },
  },
  {
    id: "refine",
    title: "Refine progressively",
    description:
      "Adjust geometry, optical perception and background; some steps can be skipped.",
    visual: {
      type: "flow" as const,
      title: "Revise without deleting",
      description:
        "Dependent decisions can become stale without deleting history.",
      steps: ["Choice", "Geometry", "Optics", "Background"],
    },
  },
  {
    id: "deliver",
    title: "Finalize and export",
    description: "Obtain the master, derived SVG or a favicon pack.",
    visual: {
      type: "result" as const,
      title: "Deliverables ready to leave the workflow",
      description:
        "The master and its derivatives are treated as separate outputs.",
    },
  },
] satisfies NonNullable<ProjectCaseStudyManifest["workflow"]>;

export const iconiseDraftFr: ProjectCaseStudyManifest = {
  schemaVersion: 1,
  status: "draft",
  projectId: "iconise",
  slug: "iconise",
  locale: "fr",
  variant: "standard",
  meta: {
    title: "Iconise — étude de cas",
    category: "SaaS de conception d’icônes",
  },
  seo: {
    title: "Iconise — workflow SaaS de création d’icônes",
    description:
      "Brouillon non indexable d’une étude de cas sur Iconise : workflow de conception, génération, itérations, facturation et exports vérifiés dans le dépôt.",
    noindex: true,
  },
  hero: {
    hook: "De l’idée à l’icône : un workflow de création structuré",
    description:
      "Conception d’une application web qui guide les décisions visuelles, conserve les itérations et relie génération d’images, facturation et export de livrables.",
    pill: "SaaS IA / 2026",
    category: "SaaS de conception d’icônes",
    visual: frenchHeroVisual,
  },
  overview: {
    problem:
      "Les décisions, prompts et itérations d’une icône peuvent se disperser entre outils et devenir incohérents lors des changements de direction.",
    audience: "Hypothèse : développeurs indépendants sans designer dédié.",
    context:
      "Application web mono-projet dont les parcours de génération manuelle et intégrée partagent le même workflow.",
    scope: "Conception, génération et exports d’assets.",
    solution:
      "Une séquence d’étapes dépendantes avec décisions retenues, suivi de génération et production d’assets livrables.",
  },
  stack: [...stack],
  video: {
    provider: "youtube",
    url: "https://www.youtube-nocookie.com/embed/9y7g2G8TBMI?si=GkUUZ76QACd-tixR&rel=0&modestbranding=1",
    verified: true,
  },
  workflow: frenchWorkflow,
  architecture: architectureFr,
  decisions: decisionsFr,
  challenges: challengesFr,
  outcomes: outcomesFr,
  limitations: limitationsFr,
};

export const iconiseDraftEn: ProjectCaseStudyManifest = {
  schemaVersion: 1,
  status: "draft",
  projectId: "iconise",
  slug: "iconise",
  locale: "en",
  variant: "standard",
  meta: { title: "Iconise — case study", category: "Icon design SaaS" },
  seo: {
    title: "Iconise — SaaS icon design workflow",
    description:
      "Non-indexable draft case study for Iconise: a verified workflow for design decisions, generation, iterations, billing and asset exports.",
    noindex: true,
  },
  hero: {
    hook: "From idea to icon: a structured creative workflow",
    description:
      "A web application that guides visual decisions, preserves iterations and connects image generation, billing and asset export.",
    pill: "AI SaaS / 2026",
    category: "Icon design SaaS",
    visual: englishHeroVisual,
  },
  overview: {
    problem:
      "Icon decisions, prompts and iterations can become scattered across tools and inconsistent when a direction changes.",
    audience:
      "Hypothesis: independent developers without a dedicated designer.",
    context:
      "A single-project web application where manual and integrated generation paths share the same workflow.",
    scope: "Design flow, generation and asset exports.",
    solution:
      "A sequence of dependent steps with retained decisions, generation status and deliverable assets.",
  },
  stack: [...stack],
  video: {
    provider: "youtube",
    url: "https://www.youtube-nocookie.com/embed/9y7g2G8TBMI?si=GkUUZ76QACd-tixR&rel=0&modestbranding=1",
    verified: true,
  },
  workflow: englishWorkflow,
  architecture: architectureEn,
  decisions: decisionsEn,
  challenges: challengesEn,
  outcomes: outcomesEn,
  limitations: limitationsEn,
};
