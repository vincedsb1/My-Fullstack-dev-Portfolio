export default function GuideTrouverOpportunitesSection() {
  return (
    <section id={"trouver-opportunites"} className={"scroll-mt-24 mb-16"}>
      {"\n                        "}
      <div className={"flex items-baseline gap-4 mb-8"}>
        {"\n                            "}
        <span
          className={
            "text-3xl font-light text-neutral-600 dark:text-neutral-300"
          }
        >
          {"03"}
        </span>
        {"\n                            "}
        <h2 className={"!mt-0 !mb-0 text-3xl font-bold"}>
          {"Multiplier les opportunités"}
        </h2>
        {"\n                        "}
      </div>
      {"\n                        "}
      <p>
        {
          "La recherche demande de la régularité. Combine réponses aux offres, candidatures spontanées et prises de contact directes."
        }
      </p>
      {"\n                        "}
      <ul>
        {"\n                            "}
        <li>
          {
            "Consulte plusieurs plateformes, pas seulement LinkedIn. Va sur les sites carrières des entreprises."
          }
        </li>
        {"\n                            "}
        <li>{"Repère les entreprises qui utilisent ta stack technique."}</li>
        {"\n                            "}
        <li>
          {
            "N'attends pas de correspondre à 100% aux critères d'une annonce pour postuler."
          }
        </li>
        {"\n                            "}
        <li>
          {
            "Adapte tes candidatures pour les entreprises qui t'intéressent vraiment."
          }
        </li>
        {"\n                        "}
      </ul>
      {"\n                        \n                        "}
      <blockquote
        className={
          "p-4 my-6 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 text-amber-900 dark:text-amber-200 rounded-r-lg"
        }
      >
        {"\n                            "}
        <strong className={"block mb-1"}>
          {"Ne cherche pas uniquement les géants de la tech."}
        </strong>
        {
          "\n                            Les PME, agences web, éditeurs logiciels spécialisés, entreprises régionales et startups moins visibles représentent d'excellentes opportunités pour débuter.\n                        "
        }
      </blockquote>
      {"\n                    "}
    </section>
  );
}
