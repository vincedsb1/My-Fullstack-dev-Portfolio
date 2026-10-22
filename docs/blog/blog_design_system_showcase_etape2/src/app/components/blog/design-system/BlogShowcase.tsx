import type { ReactNode } from "react";
import { CheckCircle2, Globe2, Layers, Sparkles } from "lucide-react";
import {
  BlogAccordion, BlogArticleHero, BlogAuthorCard, BlogBadge, BlogBreadcrumbs, BlogButton,
  BlogCallout, BlogCodeSample, BlogFigure, BlogIconList, BlogInfoCard,
  BlogModuleFrame, BlogNextArticle, BlogPageFooter, BlogQuote,
  BlogReadingLayout, BlogSection, BlogSiteHeader,
} from "./BlogUI";
import { BlogBackToTop, BlogPrintButton, BlogReadingNavigation, type BlogTocItem } from "./BlogReadingControls";
import { BlogChecklistDemo, BlogDecisionDemo } from "./BlogShowcaseInteractive";

const toc: ReadonlyArray<BlogTocItem> = [
  { id: "fondations", label: "Fondations & couleurs" },
  { id: "typographie", label: "Typographie éditoriale" },
  { id: "composants", label: "Cartes & actions" },
  { id: "contenu", label: "Contenu structuré" },
  { id: "medias", label: "Figures & code" },
  { id: "interactions", label: "Modules interactifs" },
  { id: "modules", label: "Composants personnalisés" },
  { id: "navigation", label: "Fin d’article" },
];

function PreviewPanel({ theme, children }: { theme: "light" | "dark"; children: ReactNode }) {
  return <div className="blog-ds__theme-example" data-preview-theme={theme}>
    <p>{theme === "light" ? "Light / surface papier" : "Dark / surface profonde"}</p>
    <div className="blog-ds__theme-chip-row" aria-label="Échantillons : fond, surface, texte, accent, succès, avertissement">
      {Array.from({ length: 6 }, (_, i) => <span key={i} aria-hidden="true" />)}
    </div><small>{children}</small>
  </div>;
}

function HeroArt() {
  return <div className="blog-ds__hero-art" role="img" aria-label="Illustration éditoriale : 6 fois 6 combinaisons et une grille de 36 cellules">
    <p><Globe2 size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} aria-hidden="true" />L’art de structurer</p>
    <div className="blog-ds__hero-art-metric">6 <span>×</span> 6</div>
    <div className="blog-ds__hero-art-grid">{Array.from({ length: 36 }, (_, index) => <span key={index} />)}</div>
    <p className="blog-ds__hero-art-caption">Une grille cohérente. Des contenus singuliers.</p>
  </div>;
}

export default function BlogShowcase() {
  return (
    <div className="blog-ds" id="blog-showcase-top">
      <BlogSiteHeader locale="fr" progressTargetId="blog-showcase-body" shareTitle="Blog Showcase — Vincent DESBROSSES"><BlogPrintButton /></BlogSiteHeader>
      <main className="blog-ds__main">
        <BlogBreadcrumbs items={[{ label: "Portfolio", href: "/fr" }, { label: "Blog", href: "/fr/blog" }, { label: "Showcase éditorial" }]} />
        <div style={{ marginBottom: 18 }}><span className="blog-ds__showcase-label">Page de référence · v1 · non indexée</span></div>
        <BlogArticleHero
          category="Système éditorial / Portfolio"
          title="Un seul langage visuel. Des articles uniques."
          excerpt="La bibliothèque vivante du blog : couleurs, typographie, composants, médias et interactions. Une base commune qui laisse la place aux idées particulières de chaque article."
          publishedLabel="22 octobre 2026"
          publishedAt="2026-10-22"
          readingLabel="Showcase de conception"
          headingLevel={1}
          ctaTarget="blog-showcase-body"
          ctaLabel="Explorer les composants"
          illustration={<HeroArt />}
        />
        <BlogReadingLayout navigation={<BlogReadingNavigation items={toc} />}>
          <div id="blog-showcase-body" className="blog-ds__prose">
            <p className="blog-ds__lead">Le blog ne doit pas être une collection de pages dessinées indépendamment. Cette page sert de référence pour les futures pages et met à l’épreuve les composants dans un véritable contexte de lecture.</p>
            <p>Elle ne remplace <strong>aucun des deux articles publiés</strong> à cette étape. Elle propose une direction éditoriale inspirée de l’article consacré à l’internationalisation, tout en préparant l’intégration des interactions du guide.</p>

            <BlogSection id="fondations" number="01" title="Fondations & couleurs" eyebrow="Identité visuelle">
              <p>Une palette sémantique réduit les différences entre articles. Les thèmes clair et sombre restent liés au thème global du portfolio ; les couleurs vertes, ambre et bleues restent réservées à des fonctions éditoriales identifiées.</p>
              <div className="blog-ds__swatches">
                <PreviewPanel theme="light">Fond · surface · texte · accent · succès · avertissement</PreviewPanel>
                <PreviewPanel theme="dark">Mêmes rôles, tonalités adaptées à la lecture nocturne</PreviewPanel>
              </div>
              <p className="blog-ds__token-details">Inter · accent rouge · papier neutre · vert sauge réservé aux modules explicatifs · conteneur 1 248 px · lecture 720 px · rayon principal 16 px.</p>
              <div className="blog-ds__badge-row">
                <BlogBadge>Standard</BlogBadge><BlogBadge tone="accent">Accent</BlogBadge><BlogBadge tone="success">Confirmé</BlogBadge><BlogBadge tone="warning">Attention</BlogBadge><BlogBadge tone="info">Information</BlogBadge>
              </div>
              <BlogCallout tone="info" title="Règle de conception">L’identité générale vient du design system. Un article choisit son contenu, pas sa propre palette ou ses propres marges.</BlogCallout>
            </BlogSection>

            <BlogSection id="typographie" number="02" title="Typographie éditoriale" eyebrow="Hiérarchie et lisibilité">
              <p>Le titre d’article est l’unique H1. Les sections sont des H2 et les sous-sections des H3 ; une couleur ou une taille ne doit jamais remplacer la sémantique.</p>
              <div className="blog-ds__font-examples">
                <div><span>Display</span><p className="blog-ds__type-display">Construire avec intention.</p></div>
                <div><span>Section</span><p className="blog-ds__type-heading">Des titres qui donnent le rythme.</p></div>
                <div><span>Texte</span><p className="blog-ds__type-body">Un corps de texte confortable, même lorsque l’article est long et technique.</p></div>
                <div><span>Méta</span><p className="blog-ds__type-meta">DÉVELOPPEMENT · 7 MIN DE LECTURE</p></div>
              </div>
              <BlogQuote attribution="Exemple de citation éditoriale">Un composant n’a pas besoin d’être spectaculaire pour rendre une idée plus lisible.</BlogQuote>
            </BlogSection>

            <BlogSection id="composants" number="03" title="Cartes, badges et actions" eyebrow="Composants réutilisables">
              <p>Les cartes partagent un cadre, une bordure et une typographie. L’article peut cependant décider combien de cartes montrer, dans quel ordre et avec quel contenu.</p>
              <div className="blog-ds__card-grid">
                <BlogInfoCard number="01" title="Comprendre" description="Présenter un principe, expliquer sa portée et clarifier les choix."><span>Une information prioritaire</span></BlogInfoCard>
                <BlogInfoCard number="02" title="Agir" description="Décrire un conseil concret et proposer une étape immédiatement applicable."><span>Une action identifiable</span></BlogInfoCard>
              </div>
              <div className="blog-ds__button-row"><BlogButton href="/fr/blog" variant="primary">Consulter le blog</BlogButton><BlogButton href="/fr" variant="secondary">Voir le portfolio</BlogButton><BlogButton href="#interactions" variant="text">Voir les interactions</BlogButton></div>
              <BlogCallout title="À retenir" tone="success">Les composantes répétitives ont des variantes limitées et nommées, pas des classes CSS libres dans les données JSON.</BlogCallout>
              <BlogCallout title="Point d’attention" tone="warning">L’information importante ne dépend jamais de la couleur seule. L’intitulé et la structure doivent également être explicites.</BlogCallout>
            </BlogSection>

            <BlogSection id="contenu" number="04" title="Un contenu structuré, pas figé" eyebrow="Blocs rédactionnels">
              <p>Le texte ordinaire conserve ses fonctionnalités : <strong>gras</strong>, <em>italique</em>, <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">liens externes</a>, listes, tableaux et paragraphes.</p>
              <ul className="blog-ds__text-list"><li>H2 et H3 avec ancres stables.</li><li>Listes ordonnées, non ordonnées et listes de vérification.</li><li>Paragraphes, encadrés, citations et liens contextualisés.</li></ul>
              <BlogIconList items={["Ne pas multiplier les couleurs selon l’article.", "Ne pas mélanger le rendu métier et l’enveloppe de page.", "Ne pas masquer les informations essentielles derrière une animation."]} />
              <BlogAccordion items={[{ title: "Peut-on ajouter des sections particulières ?", content: "Oui. Les modules custom restent possibles, mais utilisent les mêmes règles d’espacement et de contraste." }, { title: "Le contenu devra-t-il être du JSX ?", content: "Non pour le contenu courant : il sera décrit dans les fichiers JSON, puis rendu à travers les composants typés." }]} />
              <div className="blog-ds__table-scroll"><table className="blog-ds__table"><caption className="sr-only">Statut des familles de blocs dans le catalogue</caption><thead><tr><th scope="col">Famille</th><th scope="col">Présentation</th><th scope="col">Statut</th></tr></thead><tbody><tr><td>Prose et citations</td><td>Style commun</td><td>Standard</td></tr><tr><td>Cartes et callouts</td><td>Variantes sémantiques</td><td>Standard</td></tr><tr><td>Questionnaire</td><td>Module client isolé</td><td>Interactif</td></tr><tr><td>Démo métier</td><td>Cadre + composant React</td><td>Custom</td></tr></tbody></table></div>
            </BlogSection>

            <BlogSection id="medias" number="05" title="Figures, schémas et code" eyebrow="Médias éditoriaux">
              <p>Les contenus visuels prennent place dans un cadre commun, avec description accessible et légende facultative. Les schémas spécifiques restent libres dans leur composition interne.</p>
              <BlogFigure label="Schéma en trois étapes : données JSON, blocs typés, rendu React" caption="Figure de démonstration — exemple de diagramme intégré dans le corps d’un article.">
                <div className="blog-ds__flow-diagram"><span>Données JSON</span><i aria-hidden="true">→</i><span>Blocs typés</span><i aria-hidden="true">→</i><span>Composants React</span></div>
              </BlogFigure>
              <BlogCodeSample label="TypeScript · exemple pédagogique" code={'type ArticleBlock =\n  | { type: "paragraph"; text: string }\n  | { type: "callout"; tone: "info" | "warning"; text: string }\n  | { type: "custom"; component: string; props: Record<string, unknown> };'} />
            </BlogSection>

            <BlogSection id="interactions" number="06" title="Des interactions prévisibles" eyebrow="Comportements UI">
              <p>Les éléments interactifs respectent la même charte que le texte, tout en restant des Client Components indépendants. Les démonstrations ci-dessous sont réellement utilisables.</p>
              <BlogModuleFrame eyebrow="Checklist" title="Avancer étape par étape" description="Cases, compteur, barre de progression et action de remise à zéro."><BlogChecklistDemo /></BlogModuleFrame>
              <BlogModuleFrame eyebrow="Questionnaire" title="Une décision en trois questions" description="État, sélection explicite et résultat accessible."><BlogDecisionDemo /></BlogModuleFrame>
            </BlogSection>

            <BlogSection id="modules" number="07" title="Liberté pour les composants custom" eyebrow="Cadre commun, contenu libre">
              <p>Les modules très spécialisés — matrice de langues, démo produit, entonnoir de conversion — ne deviennent pas de simples cartes génériques. Ils gardent leur logique, mais héritent du langage visuel.</p>
              <BlogModuleFrame eyebrow="Exemple d’illustration métier" title="Un composant métier dans un cadre stable" description="Une illustration propre à un article sans recréer un layout pour toute la page." note="La démonstration est illustrative ; elle ne mesure pas de conversion réelle." tone="success">
                <div className="blog-ds__flow-diagram"><span><Layers size={20} aria-hidden="true" /><br />Découverte</span><i aria-hidden="true">→</i><span><Sparkles size={20} aria-hidden="true" /><br />Usage</span><i aria-hidden="true">→</i><span><CheckCircle2 size={20} aria-hidden="true" /><br />Valeur</span></div>
              </BlogModuleFrame>
              <BlogCallout title="Ne pas sur-généraliser" tone="accent">Le design system standardise le cadre, l’espacement, les états et le responsive ; il ne dicte pas les détails internes des visualisations complexes.</BlogCallout>
            </BlogSection>

            <BlogSection id="navigation" number="08" title="Une fin d’article reconnaissable" eyebrow="Auteur et navigation">
              <p>La conclusion, la carte auteur, le partage et les liens de poursuite composent un footer éditorial constant. Les destinations, elles, proviendront des métadonnées JSON.</p>
              <div className="blog-ds__button-row"><BlogButton href="#blog-showcase-top" variant="text">Retour en haut</BlogButton><BlogButton href="/fr/blog" variant="secondary">Tous les articles</BlogButton></div>
              <BlogAuthorCard />
              <BlogNextArticle title="Faut-il internationaliser son SaaS dès le lancement ?" href="/fr/blog/internationaliser-saas-lancement" />
            </BlogSection>
          </div>
        </BlogReadingLayout>
        <BlogPageFooter />
      </main>
      <BlogBackToTop targetId="blog-showcase-top" />
    </div>
  );
}
