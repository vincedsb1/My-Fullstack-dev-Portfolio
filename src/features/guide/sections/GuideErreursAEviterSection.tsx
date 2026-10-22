import { GuideIcon } from "../GuideIcon";
export default function GuideErreursAEviterSection() {
  return (
    <section id={"erreurs-a-eviter"} className={"scroll-mt-24 mb-16"}>
      {"\n                        "}
      <div className={"flex items-baseline gap-4 mb-8"}>
        {"\n                            "}
        <span
          className={
            "text-3xl font-light text-neutral-600 dark:text-neutral-300"
          }
        >
          {"09"}
        </span>
        {"\n                            "}
        <h2 className={"!mt-0 !mb-0 text-3xl font-bold"}>
          {"Ce qu'il faut éviter"}
        </h2>
        {"\n                        "}
      </div>
      {"\n                        "}
      <ul className={"space-y-3"}>
        {"\n                            "}
        <li className={"flex items-start gap-3"}>
          {"\n                                "}
          <GuideIcon name="x-circle" className="text-accent mt-1" />
          {"\n                                "}
          <span>
            {
              "Postuler avec un CV bâclé ou inachevé. Avant la première candidature, finalise un CV irréprochable : clair, sans fautes, bien présenté et adapté au poste. Ce travail de préparation est la base pour être compétitif et éviter de griller tes premières opportunités."
            }
          </span>
          {"\n                            "}
        </li>
        {"\n                            "}
        <li className={"flex items-start gap-3"}>
          {"\n                                "}
          <GuideIcon name="x-circle" className="text-accent mt-1" />
          {"\n                                "}
          <span>
            {
              "Confondre la multiplication aveugle des candidatures avec l'efficacité."
            }
          </span>
          {"\n                            "}
        </li>
        {"\n                            "}
        <li className={"flex items-start gap-3"}>
          {"\n                                "}
          <GuideIcon name="x-circle" className="text-accent mt-1" />
          {"\n                                "}
          <span>
            {
              "Confondre popularité sur LinkedIn et réelles compétences de développeur."
            }
          </span>
          {"\n                            "}
        </li>
        {"\n                            "}
        <li className={"flex items-start gap-3"}>
          {"\n                                "}
          <GuideIcon name="x-circle" className="text-accent mt-1" />
          {"\n                                "}
          <span>
            {
              "Prétendre maîtriser des technologies qu'on ne comprend pas vraiment en profondeur."
            }
          </span>
          {"\n                            "}
        </li>
        {"\n                            "}
        <li className={"flex items-start gap-3"}>
          {"\n                                "}
          <GuideIcon name="x-circle" className="text-accent mt-1" />
          {"\n                                "}
          <span>
            {
              "Présenter un projet généré à 100% par IA sans pouvoir en expliquer l'architecture."
            }
          </span>
          {"\n                            "}
        </li>
        {"\n                        "}
      </ul>
      {"\n                    "}
    </section>
  );
}
