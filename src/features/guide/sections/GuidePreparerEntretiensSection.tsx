import { Button } from "@/components/ui/Button";
export default function GuidePreparerEntretiensSection() {
  return (
    <section id={"preparer-entretiens"} className={"scroll-mt-24 mb-16"}>
      {"\n                        "}
      <div className={"flex items-baseline gap-4 mb-8"}>
        {"\n                            "}
        <span
          className={
            "text-3xl font-light text-neutral-600 dark:text-neutral-300"
          }
        >
          {"05"}
        </span>
        {"\n                            "}
        <h2 className={"!mt-0 !mb-0 text-3xl font-bold"}>
          {"Se préparer aux entretiens"}
        </h2>
        {"\n                        "}
      </div>
      {"\n                        "}
      <p>{"Prépare tes entretiens autour de quatre situations fréquentes :"}</p>
      {"\n\n                        "}
      <div className={"space-y-6"}>
        {"\n                            "}
        <div>
          {"\n                                "}
          <h3
            className={
              "!mt-0 !mb-3 !text-lg !font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2"
            }
          >
            {"A. Entretien RH & Motivation"}
          </h3>
          {"\n                                "}
          <p className={"text-sm"}>
            {
              "Sache présenter ton parcours et tes motivations en quelques phrases. Si tu es en reconversion, explique ce qui t'a conduit vers le développement. Prépare des questions à poser sur l'entreprise."
            }
          </p>
          {
            "\n                                \n                                "
          }
          <div
            className={
              "mt-3 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden"
            }
          >
            {"\n                                    "}
            <div
              className={
                "flex items-center justify-between px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700"
              }
            >
              {"\n                                        "}
              <span className={"text-xs font-medium text-neutral-500"}>
                {"Prompt IA d'entraînement"}
              </span>
              {"\n                                        "}
              <Button
                variant="secondary"
                data-guide-copy={"prompt-template"}
                className={
                  "no-print text-neutral-500 hover:text-red-600 text-xs flex items-center gap-1"
                }
              >
                {"Copier"}
              </Button>
              {"\n                                    "}
            </div>
            {"\n                                    "}
            <div
              className={
                "p-3 text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-line font-mono"
              }
              id={"prompt-template"}
            >
              {
                "Joue le rôle d'un recruteur technique exigeant qui fait passer un entretien à un développeur junior. Pose-moi les questions une par une. Attends ma réponse avant de continuer. Après chaque réponse, évalue sa clarté, sa pertinence et identifie les éléments manquants."
              }
            </div>
            {"\n                                "}
          </div>
          {"\n                            "}
        </div>
        {"\n\n                            "}
        <div>
          {"\n                                "}
          <h3
            className={
              "!mt-0 !mb-3 !text-lg !font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2"
            }
          >
            {"B. Algorithmique & Live Coding"}
          </h3>
          {"\n                                "}
          <p className={"text-sm"}>
            {"Entraîne-toi sur "}
            <a
              href={"https://www.codingame.com/start/"}
              className={
                "text-red-600 underline underline-offset-2 hover:text-accent dark:text-red-400"
              }
            >
              {"CodinGame"}
            </a>
            {
              " ou LeetCode. Décompose le problème avant de coder et explique ton raisonnement à voix haute. La méthode compte autant que le résultat."
            }
          </p>
          {"\n                            "}
        </div>
        {"\n\n                            "}
        <div>
          {"\n                                "}
          <h3
            className={
              "!mt-0 !mb-3 !text-lg !font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2"
            }
          >
            {"C. Questions Techniques"}
          </h3>
          {"\n                                "}
          <p className={"text-sm"}>
            {
              'Maîtrise les fondamentaux de ta stack. Comprends les concepts plutôt que de réciter des définitions. Sois capable de dire "je ne sais pas, mais voici comment je chercherais".'
            }
          </p>
          {"\n                            "}
        </div>
        {"\n\n                            "}
        <div>
          {"\n                                "}
          <h3
            className={
              "!mt-0 !mb-3 !text-lg !font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2"
            }
          >
            {"D. Études de cas & Architecture"}
          </h3>
          {"\n                                "}
          <p className={"text-sm"}>
            {
              "On peut te demander d'imaginer l'architecture d'une app simple. Identifie le besoin métier, choisis la BDD, le front, l'API et justifie tes compromis techniques."
            }
          </p>
          {"\n                            "}
        </div>
        {"\n                        "}
      </div>
      {"\n                    "}
    </section>
  );
}
