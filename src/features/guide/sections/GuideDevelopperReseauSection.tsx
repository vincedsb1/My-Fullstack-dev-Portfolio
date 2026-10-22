import { Button } from "@/components/ui/Button";
import { GuideIcon } from "../GuideIcon";
export default function GuideDevelopperReseauSection() {
  return (
    <section id={"developper-reseau"} className={"scroll-mt-24 mb-16"}>
      {"\n                        "}
      <div className={"flex items-baseline gap-4 mb-8"}>
        {"\n                            "}
        <span
          className={
            "text-3xl font-light text-neutral-600 dark:text-neutral-300"
          }
        >
          {"02"}
        </span>
        {"\n                            "}
        <h2 className={"!mt-0 !mb-0 text-3xl font-bold"}>
          {"Développer activement son réseau"}
        </h2>
        {"\n                        "}
      </div>
      {"\n\n                        "}
      <p>
        {
          "Les annonces ne sont pas le seul point d'entrée. En échangeant avec des personnes du métier, tu peux demander conseil et parfois apprendre qu'une équipe prépare un recrutement."
        }
      </p>
      {"\n\n                        "}
      <h3>{"Identifier les bonnes personnes"}</h3>
      {"\n                        "}
      <p>
        {
          "Ne te limite pas aux recruteurs. Cherche à entrer en contact avec ceux qui comprennent ton métier et ont des besoins :"
        }
      </p>
      {"\n                        "}
      <div className={"flex flex-wrap gap-2 mb-6"}>
        {"\n                            "}
        <span
          className={
            "px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
          }
        >
          {"CTO"}
        </span>
        {"\n                            "}
        <span
          className={
            "px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
          }
        >
          {"Tech Leads"}
        </span>
        {"\n                            "}
        <span
          className={
            "px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
          }
        >
          {"Engineering Managers"}
        </span>
        {"\n                            "}
        <span
          className={
            "px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
          }
        >
          {"Lead Developers"}
        </span>
        {"\n                            "}
        <span
          className={
            "px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
          }
        >
          {"Fondateurs"}
        </span>
        {"\n                            "}
        <span
          className={
            "px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
          }
        >
          {"Product Managers"}
        </span>
        {"\n                        "}
      </div>
      {"\n                        "}
      <p>
        {"Envoie quelques invitations ciblées et personnalise chaque message."}
      </p>
      {"\n\n                        "}
      <h3>{"Contacter directement les décisionnaires"}</h3>
      {"\n                        "}
      <p>
        {
          "Écris un message bref qui explique ton profil et ce qui t'intéresse dans l'entreprise. Pour un premier échange, tu peux aussi demander un conseil ou proposer ton aide, plutôt que d'ouvrir directement par une demande de poste."
        }
      </p>
      {"\n\n                        "}
      {"\n                        "}
      <div
        className={
          "mt-6 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-800"
        }
      >
        {"\n                            "}
        <div
          className={
            "flex items-center justify-between px-4 py-2 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700"
          }
        >
          {"\n                                "}
          <span
            className={
              "text-xs font-semibold text-neutral-500 uppercase tracking-wider"
            }
          >
            {"Modèle de message d'approche"}
          </span>
          {"\n                                "}
          <Button
            variant="secondary"
            data-guide-copy={"msg-template"}
            className={
              "no-print text-neutral-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm"
            }
            aria-label={"Copier le message"}
          >
            {"\n                                    "}
            <GuideIcon name="copy" className="" />
            {" Copier\n                                "}
          </Button>
          {"\n                            "}
        </div>
        {"\n                            "}
        <div
          className={
            "p-4 md:p-6 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line font-mono leading-relaxed"
          }
          id={"msg-template"}
        >
          {
            "Bonjour [Prénom],\n\nJe découvre votre travail chez [Entreprise] et je m'intéresse particulièrement à [élément précis du produit ou de l'équipe technique].\n\nJe suis développeur junior spécialisé en [technologies] et je recherche actuellement [type d'opportunité].\n\nAuriez-vous un conseil à me donner pour me rapprocher d'une équipe comme la vôtre ?\n\nMerci pour votre temps."
          }
        </div>
        {"\n                        "}
      </div>
      {"\n                        "}
      <p className={"text-sm mt-2 text-neutral-500 italic"}>
        {
          "⚠️ Il s'agit d'un modèle à personnaliser absolument selon le contexte, pas d'un message à envoyer en masse."
        }
      </p>
      {"\n                    "}
    </section>
  );
}
