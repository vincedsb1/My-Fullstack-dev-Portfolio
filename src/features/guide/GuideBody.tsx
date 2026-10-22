import GuideLesTroisPiliersSection from "./sections/GuideLesTroisPiliersSection";
import GuideDevelopperReseauSection from "./sections/GuideDevelopperReseauSection";
import GuideTrouverOpportunitesSection from "./sections/GuideTrouverOpportunitesSection";
import GuideCreerContenuSection from "./sections/GuideCreerContenuSection";
import GuidePreparerEntretiensSection from "./sections/GuidePreparerEntretiensSection";
import GuideOrganiserRechercheSection from "./sections/GuideOrganiserRechercheSection";
import GuideRencontrerProfessionnelsSection from "./sections/GuideRencontrerProfessionnelsSection";
import GuideDixConseilsSection from "./sections/GuideDixConseilsSection";
import GuideErreursAEviterSection from "./sections/GuideErreursAEviterSection";
import GuideChecklistFinaleSection from "./sections/GuideChecklistFinaleSection";
import { Button } from "@/components/ui/Button";
import "./guide.css";
import { Avatar } from "@/components/ui/Avatar";
import { GuideIcon } from "./GuideIcon";
export default function GuideBody({
  values,
}: {
  values: Record<string, string>;
}) {
  return (
    <>
      {"\n"}
      {"\n    "}
      <div
        className={
          "fixed top-0 left-0 w-full h-1 z-50 bg-neutral-200 dark:bg-neutral-800 no-print"
        }
      >
        {"\n        "}
        <div id={"reading-progress"} className={"h-full bg-red-500"}></div>
        {"\n    "}
      </div>
      {"\n\n    "}
      {"\n    "}
      <div className={"flex justify-end gap-3 p-4 no-print"}>
        <Button
          variant="secondary"
          data-guide-print={""}
          aria-label={"Enregistrer en PDF"}
        >
          {"PDF"}
        </Button>
        <Button
          variant="secondary"
          id={"share-btn"}
          aria-label={"Partager le lien"}
        >
          {"Partager"}
        </Button>
      </div>
      {"\n\n    "}
      <div
        className={
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative"
        }
      >
        {"\n        \n        "}
        <main id={"main"} className={"w-full min-w-0"}>
          {"\n            "}
          <article className={"max-w-[700px] mx-auto"}>
            {"\n                "}
            <nav
              aria-label={values["ARTICLE_BREADCRUMB_ARIA"]}
              className={"mb-6 text-sm text-neutral-500 dark:text-neutral-400"}
            >
              {"\n                    "}
              <ol className={"flex flex-wrap items-center gap-2"}>
                {"\n                        "}
                <li>
                  <a
                    className={
                      "underline-offset-4 hover:text-red-600 hover:underline dark:hover:text-red-400"
                    }
                    href={values["ARTICLE_HOME_URL"]}
                  >
                    {"Portfolio"}
                  </a>
                </li>
                {"\n                        "}
                <li aria-hidden={"true"}>{"/"}</li>
                {"\n                        "}
                <li>
                  <a
                    className={
                      "underline-offset-4 hover:text-red-600 hover:underline dark:hover:text-red-400"
                    }
                    href={values["ARTICLE_BLOG_URL"]}
                  >
                    {"Blog"}
                  </a>
                </li>
                {"\n                        "}
                <li aria-hidden={"true"}>{"/"}</li>
                {"\n                        "}
                <li
                  aria-current={"page"}
                  className={
                    "min-w-0 truncate text-neutral-700 dark:text-neutral-200"
                  }
                >
                  <span>{values["ARTICLE_TITLE"]}</span>
                </li>
                {"\n                    "}
              </ol>
              {"\n                "}
            </nav>
            {"\n                "}
            <details
              className={
                "guide-toc mb-10 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              }
            >
              {"\n                    "}
              <summary
                className={
                  "cursor-pointer px-5 py-4 font-semibold text-neutral-900     dark:text-white"
                }
              >
                {
                  "\n                        Sommaire du guide\n                    "
                }
              </summary>
              {"\n                    "}
              <nav
                aria-label={"Sommaire"}
                className={
                  "border-t border-neutral-200 px-5 py-4 dark:border-neutral-800"
                }
              >
                {"\n                "}
                <ul
                  className={
                    "space-y-3 text-sm text-neutral-600 dark:text-neutral-400"
                  }
                  id={"toc-list"}
                >
                  {"\n                    "}
                  <li>
                    <a
                      href={"#les-trois-piliers"}
                      className={
                        "toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white"
                      }
                    >
                      {"01. Les trois piliers"}
                    </a>
                  </li>
                  {"\n                    "}
                  <li>
                    <a
                      href={"#developper-reseau"}
                      className={
                        "toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white"
                      }
                    >
                      {"02. Développer son réseau"}
                    </a>
                  </li>
                  {"\n                    "}
                  <li>
                    <a
                      href={"#trouver-opportunites"}
                      className={
                        "toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white"
                      }
                    >
                      {"03. Trouver des opportunités"}
                    </a>
                  </li>
                  {"\n                    "}
                  <li>
                    <a
                      href={"#creer-contenu"}
                      className={
                        "toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white"
                      }
                    >
                      {"04. Créer du contenu"}
                    </a>
                  </li>
                  {"\n                    "}
                  <li>
                    <a
                      href={"#preparer-entretiens"}
                      className={
                        "toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white"
                      }
                    >
                      {"05. Préparer ses entretiens"}
                    </a>
                  </li>
                  {"\n                    "}
                  <li>
                    <a
                      href={"#organiser-recherche"}
                      className={
                        "toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white"
                      }
                    >
                      {"06. Organiser sa recherche"}
                    </a>
                  </li>
                  {"\n                    "}
                  <li>
                    <a
                      href={"#rencontrer-professionnels"}
                      className={
                        "toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white"
                      }
                    >
                      {"07. Rencontrer des professionnels"}
                    </a>
                  </li>
                  {"\n                    "}
                  <li>
                    <a
                      href={"#dix-conseils"}
                      className={
                        "toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white"
                      }
                    >
                      {"08. Dix conseils supplémentaires"}
                    </a>
                  </li>
                  {"\n                    "}
                  <li>
                    <a
                      href={"#erreurs-a-eviter"}
                      className={
                        "toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white"
                      }
                    >
                      {"09. Les erreurs à éviter"}
                    </a>
                  </li>
                  {"\n                    "}
                  <li>
                    <a
                      href={"#checklist-finale"}
                      className={
                        "toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white"
                      }
                    >
                      {"10. Checklist finale"}
                    </a>
                  </li>
                  {"\n                "}
                </ul>
                {"\n                    "}
              </nav>
              {"\n                "}
            </details>
            {"\n                \n                "}
            {"\n                "}
            <header className={"mb-16"}>
              {"\n                    "}
              <div
                className={
                  "guide-category inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-accent text-xs font-semibold uppercase tracking-wider mb-6"
                }
              >
                {"\n                        "}
                <GuideIcon name="book-open" className="" />
                {"\n                        " +
                  values["ARTICLE_CATEGORY"] +
                  " • Développement Web\n                    "}
              </div>
              {"\n                    \n                    "}
              <h1
                className={
                  "text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight mb-6"
                }
              >
                {"\n                        " +
                  values["ARTICLE_TITLE"] +
                  "\n                    "}
              </h1>
              {"\n                    \n                    "}
              <p
                className={
                  "text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8"
                }
              >
                {"\n                        " +
                  values["ARTICLE_EXCERPT"] +
                  "\n                    "}
              </p>
              {"\n\n                    "}
              <div
                className={
                  "prose prose-zinc dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-400 mb-8"
                }
              >
                {"\n                        "}
                <p>
                  {
                    "Trouver son premier emploi dans le développement ne repose pas uniquement sur ses compétences techniques. Il faut aussi savoir les démontrer, inspirer confiance et multiplier les occasions de rencontrer les bonnes personnes."
                  }
                </p>
                {"\n                        "}
                <p>
                  {
                    "J'ai rassemblé ici les conseils que je partage régulièrement avec des développeurs juniors, avec une méthode concrète pour passer à l'action."
                  }
                </p>
                {"\n                    "}
              </div>
              {"\n\n                    "}
              <div
                className={
                  "flex items-center gap-4 mb-10 pt-6 border-t border-neutral-200 dark:border-neutral-800"
                }
              >
                {"\n                        "}
                <div
                  className={
                    "w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0"
                  }
                >
                  {"\n                            "}
                  {"\n                            "}
                  <div
                    className={
                      "w-full h-full flex items-center justify-center text-neutral-700 dark:text-neutral-200 font-bold"
                    }
                  >
                    {"VD"}
                  </div>
                  {"\n                        "}
                </div>
                {"\n                        "}
                <div>
                  {"\n                            "}
                  <div
                    className={"font-medium text-neutral-900 dark:text-white"}
                  >
                    {"Vincent DESBROSSES"}
                  </div>
                  {"\n                            "}
                  <div
                    className={"text-sm text-neutral-500 dark:text-neutral-400"}
                  >
                    {"Développeur Fullstack"}
                  </div>
                  {"\n                        "}
                </div>
                {"\n                        "}
                <div
                  className={
                    "ml-auto text-xs text-neutral-500 dark:text-neutral-400 text-right"
                  }
                >
                  {"\n                            Publié le "}
                  <time dateTime={values["ARTICLE_PUBLISHED_ISO"]}>
                    {values["ARTICLE_PUBLISHED_AT"]}
                  </time>
                  <br />
                  {"\n                            "}
                  <span className={values["ARTICLE_UPDATED_CLASS"]}>
                    {"Mis à jour le "}
                    <time dateTime={values["ARTICLE_UPDATED_ISO"]}>
                      {values["ARTICLE_UPDATED_AT"]}
                    </time>
                    <br />
                  </span>
                  {"\n                            " +
                    values["ARTICLE_READING_TIME"] +
                    " min de lecture\n                        "}
                </div>
                {"\n                    "}
              </div>
              {"\n\n                    "}
              <div className={"flex flex-wrap gap-4 no-print"}>
                {"\n                        "}
                <a
                  href={"#les-trois-piliers"}
                  data-guide-start-reading={""}
                  className={
                    "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors shadow-sm"
                  }
                >
                  {
                    "\n                            Commencer la lecture\n                        "
                  }
                </a>
                {"\n                        "}
                <Button
                  variant="secondary"
                  data-guide-print={""}
                  className={
                    "inline-flex items-center justify-center px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-base font-medium rounded-lg text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors shadow-sm"
                  }
                >
                  {"\n                            "}
                  <GuideIcon name="download-simple" className="mr-2 text-lg" />
                  {
                    "\n                            Enregistrer en PDF\n                        "
                  }
                </Button>
                {"\n                    "}
              </div>
              {"\n                "}
            </header>
            {"\n\n                "}
            <div className={"editorial-content"}>
              {"\n                    \n                    "}
              <GuideLesTroisPiliersSection />
              {"\n\n                    "}
              <GuideDevelopperReseauSection />
              {"\n\n                    "}
              <GuideTrouverOpportunitesSection />
              {"\n\n                    "}
              <GuideCreerContenuSection />
              {"\n\n                    "}
              <GuidePreparerEntretiensSection />
              {"\n\n                    "}
              <GuideOrganiserRechercheSection />
              {"\n\n                    "}
              <GuideRencontrerProfessionnelsSection />
              {"\n\n                    "}
              <GuideDixConseilsSection />
              {"\n\n                    "}
              <GuideErreursAEviterSection />
              {"\n\n                    "}
              <GuideChecklistFinaleSection />
              {"\n\n                    "}
              <section
                className={
                  "border-t border-neutral-200 dark:border-neutral-800 pt-16 mb-16"
                }
              >
                {"\n                        "}
                <h2 className={"text-2xl font-bold mb-4"}>
                  {"Pour faire avancer ta recherche"}
                </h2>
                {"\n                        "}
                <p>
                  {
                    "Commence par mettre à jour ton CV et choisir quelques projets que tu peux présenter. Cible ensuite des entreprises qui recrutent sur ta stack, suis tes démarches et ajuste tes candidatures selon les échanges obtenus."
                  }
                </p>
                {"\n\n                        "}
                <div
                  className={
                    "mt-12 p-6 md:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center bg-neutral-200 dark:bg-neutral-800 rounded-3xl"
                  }
                >
                  {"\n                            "}
                  <Avatar size={128} />
                  {"\n                            "}
                  <div className={"text-center sm:text-left"}>
                    {"\n                                "}
                    <h3 className={"!mt-0 !mb-1 text-xl font-bold"}>
                      {"Vincent DESBROSSES"}
                    </h3>
                    {"\n                                "}
                    <div className={"text-accent font-medium text-sm mb-3"}>
                      {"Développeur Fullstack"}
                    </div>
                    {"\n                                "}
                    <p
                      className={
                        "text-sm text-neutral-600 dark:text-neutral-400 mb-4"
                      }
                    >
                      {
                        "Je conçois et développe des applications web modernes en portant une attention particulière à l'expérience utilisateur, à la qualité logicielle et à la compréhension des besoins produit."
                      }
                    </p>
                    {"\n                                "}
                    <a
                      href={"/fr"}
                      className={
                        "inline-flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      }
                    >
                      {
                        "\n                                    Découvrir mon portfolio "
                      }
                      <GuideIcon name="arrow-right" className="" />
                      {"\n                                "}
                    </a>
                    {"\n                            "}
                  </div>
                  {"\n                        "}
                </div>
                {"\n                    "}
              </section>
              {"\n\n                "}
            </div>
            {"\n            "}
          </article>
          {"\n        "}
        </main>
        {"\n    "}
      </div>
      {"\n\n    "}
      <footer
        className={
          "bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-12 mt-12 no-print"
        }
      >
        {"\n        "}
        <div
          className={
            "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6"
          }
        >
          {"\n            "}
          <div className={"text-neutral-500 dark:text-neutral-400 text-sm"}>
            {
              "\n                © 2026 Vincent DESBROSSES. Guide gratuit.\n            "
            }
          </div>
          {"\n            "}
          <div className={"flex gap-6 text-sm font-medium"}>
            {"\n                "}
            <a
              href={"/fr/blog"}
              className={
                "text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              }
            >
              {"Retour au blog"}
            </a>
            {"\n                "}
            <a
              href={"/fr"}
              className={
                "text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              }
            >
              {"Portfolio"}
            </a>
            {"\n                "}
            <Button
              variant="secondary"
              data-guide-print={""}
              className={
                "text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              }
            >
              {"Télécharger PDF"}
            </Button>
            {"\n            "}
          </div>
          {"\n        "}
        </div>
        {"\n    "}
      </footer>
      {"\n\n    "}
      {"\n    "}
      <div
        id={"toast"}
        role={"status"}
        aria-live={"polite"}
        aria-atomic={"true"}
        className={
          "fixed bottom-4 right-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transform translate-y-20 opacity-0 transition-all duration-300 z-50 flex items-center gap-2"
        }
      >
        {"\n        "}
        <GuideIcon
          name="check-circle"
          className="text-red-400 dark:text-red-600 text-lg"
        />
        {"\n        "}
        <span id={"toast-message"}>{"Action réussie"}</span>
        {"\n    "}
      </div>
      {"\n\n    "}
      {"\n    "}
      <Button
        variant="secondary"
        id={"back-to-top"}
        className={
          "fixed bottom-4 left-4 bg-red-600 text-white p-3 rounded-full shadow-lg md:hidden opacity-0 invisible transition-all duration-300 transform translate-y-4 hover:bg-red-700 z-40"
        }
        aria-label={"Retour en haut"}
      >
        {"\n        "}
        <GuideIcon name="arrow-up" className="" />
        {"\n    "}
      </Button>
      {"\n"}
    </>
  );
}
