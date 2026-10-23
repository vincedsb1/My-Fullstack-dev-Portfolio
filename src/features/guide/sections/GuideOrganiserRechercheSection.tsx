export default function GuideOrganiserRechercheSection() {
  return (
    <section id={"organiser-recherche"} className={"scroll-mt-24 mb-16"}>
      <div className={"flex items-baseline gap-4 mb-8"}>
        <span
          className={
            "text-3xl font-light text-neutral-600 dark:text-neutral-300"
          }
        >
          {"06"}
        </span>
        <h2 className={"!mt-0 !mb-0 text-3xl font-bold"}>
          {"Organiser sa recherche"}
        </h2>
      </div>
      <p>
        {
          "Tiens un tableau (Notion, Excel) pour noter les candidatures envoyées, les relances prévues et les réponses reçues."
        }
      </p>
      <div
        tabIndex={0}
        role="region"
        aria-label="Tableau comparatif"
        className={
          "overflow-x-auto my-6 border border-neutral-200 dark:border-neutral-800 rounded-xl"
        }
      >
        <table className={"w-full text-sm text-left"}>
          <caption className={"sr-only"}>
            {"Exemple de tableau de suivi des candidatures"}
          </caption>
          <thead
            className={
              "text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-800/50"
            }
          >
            <tr>
              <th scope={"col"} className={"px-4 py-3"}>
                {"Entreprise"}
              </th>
              <th scope={"col"} className={"px-4 py-3"}>
                {"Poste"}
              </th>
              <th scope={"col"} className={"px-4 py-3"}>
                {"Statut"}
              </th>
              <th scope={"col"} className={"px-4 py-3"}>
                {"Prochaine action"}
              </th>
            </tr>
          </thead>
          <tbody
            className={"divide-y divide-neutral-200 dark:divide-neutral-800"}
          >
            <tr className={"bg-white dark:bg-neutral-900"}>
              <th scope={"row"} className={"px-4 py-3 text-left font-medium"}>
                {"Entreprise A"}
              </th>
              <td className={"px-4 py-3"}>{"Dev React"}</td>
              <td className={"px-4 py-3"}>
                <span
                  className={
                    "px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded text-xs"
                  }
                >
                  {"Candidature envoyée"}
                </span>
              </td>
              <td className={"px-4 py-3 text-neutral-500"}>
                {"Noter une date de relance"}
              </td>
            </tr>
            <tr className={"bg-white dark:bg-neutral-900"}>
              <th scope={"row"} className={"px-4 py-3 text-left font-medium"}>
                {"Entreprise B"}
              </th>
              <td className={"px-4 py-3"}>{"Développeur full stack"}</td>
              <td className={"px-4 py-3"}>
                <span
                  className={
                    "px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded text-xs"
                  }
                >
                  {"Entretien programmé"}
                </span>
              </td>
              <td className={"px-4 py-3 text-neutral-500"}>
                {"Préparer les questions techniques"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
