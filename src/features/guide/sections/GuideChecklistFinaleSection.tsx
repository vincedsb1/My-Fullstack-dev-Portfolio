import { Button } from "@/components/ui/Button";
export default function GuideChecklistFinaleSection() {
  return (
    <section
      id={"checklist-finale"}
      className={
        "scroll-mt-24 mb-16 bg-neutral-50 dark:bg-neutral-800 p-6 md:p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800"
      }
    >
      {"\n                        "}
      <div className={"flex items-baseline gap-4 mb-6"}>
        {"\n                            "}
        <span className={"text-3xl font-light text-accent dark:text-accent"}>
          {"10"}
        </span>
        {"\n                            "}
        <h2 className={"!mt-0 !mb-0 text-3xl font-bold"}>
          {"Ta checklist pour passer à l'action"}
        </h2>
        {"\n                        "}
      </div>
      {"\n                        "}
      <p className={"mb-6"}>
        {
          "Coche les étapes réalisées. Ta progression est sauvegardée dans ce navigateur."
        }
      </p>
      {"\n\n                        "}
      {"\n                        "}
      <div className={"no-print"}>
        {"\n                            "}
        <div className={"flex items-center justify-between mb-4"}>
          {"\n                                "}
          <span
            className={
              "text-sm font-semibold text-neutral-500 uppercase tracking-wider"
            }
            id={"checklist-progress-text"}
            aria-live={"polite"}
            aria-atomic={"true"}
          >
            {"0/14 étapes terminées"}
          </span>
          {"\n                                "}
          <Button
            variant="secondary"
            id={"reset-checklist"}
            className={
              "text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-accent underline decoration-red-200 dark:decoration-red-900/50 underline-offset-4"
            }
          >
            {"Réinitialiser"}
          </Button>
          {"\n                            "}
        </div>
        {"\n                            "}
        <div
          className={
            "w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full mb-6 overflow-hidden"
          }
        >
          {"\n                                "}
          <div
            id={"checklist-progress-bar"}
            className={
              "bg-red-500 h-full rounded-full transition-all duration-300"
            }
            style={{ width: "0%" }}
          ></div>
          {"\n                            "}
        </div>
        {"\n\n                            "}
        <div className={"space-y-3"} id={"checklist-container"}>
          {"\n                                "}
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-1"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {"Mon CV est clair, aéré et a été relu."}
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-2"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {"Mon profil LinkedIn est complet et précis."}
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-3"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {"Mon portfolio présente mes meilleurs projets en ligne."}
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-4"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {"Mon GitHub démontre mes compétences (README soignés)."}
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-5"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {"J'ai défini mon poste cible et ma stack principale."}
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-6"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {"J'ai identifié une liste d'entreprises pertinentes."}
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-7"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {"J'ai commencé à contacter des professionnels sur LinkedIn."}
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-8"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {
                "Je dispose d'un outil de suivi (Notion, Excel) pour mes candidatures."
              }
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-9"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {
                "Je m'entraîne régulièrement aux tests techniques (algo/live coding)."
              }
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-10"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {"J'ai préparé mon pitch de présentation personnelle (2 min)."}
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-11"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {"Je sais justifier l'architecture de mes projets personnels."}
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-12"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {
                "J'ai identifié des meetups ou événements tech près de chez moi."
              }
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-13"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {"J'ai défini une routine de recherche soutenable dans la durée."}
            </span>
            {"\n                                "}
          </label>
          {"\n                                "}
          <label
            className={
              "checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
            }
          >
            {"\n                                    "}
            <input
              type={"checkbox"}
              className={"checkbox-custom mt-0.5"}
              data-id={"chk-14"}
            />
            {"\n                                    "}
            <span
              className={
                "text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              }
            >
              {
                "J'analyse mes résultats (retours positifs/négatifs) pour m'améliorer."
              }
            </span>
            {"\n                                "}
          </label>
          {"\n                            "}
        </div>
        {"\n                        "}
      </div>
      {"\n                        "}
      <div className={"hidden print:block"}>
        {"\n                            "}
        <p>
          <em>
            {
              "(La version interactive de la checklist est disponible sur la version web du guide)."
            }
          </em>
        </p>
        {"\n                        "}
      </div>
      {"\n                    "}
    </section>
  );
}
