"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import {
  Atom,
  Braces,
  Code,
  Database,
  FileCode,
  Palette,
  Rocket,
  Server,
  Type,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";

// Étape 2: Modèle de données TypeScript
type ProjectSize = "large" | "square";
type ProjectId =
  | "allaw"
  | "truthify"
  | "legalConstat"
  | "smartflow"
  | "decorNature"
  | "aimoto"
  | "liic"
  | "teslaApp"
  | "emmausConnect"
  | "wilderGame"
  | "legalDirectory";

type TechnologyId =
  | "nextjs"
  | "react"
  | "typescript"
  | "javascript"
  | "tailwind"
  | "nodejs"
  | "mongodb"
  | "postgresql"
  | "mysql"
  | "json"
  | "python"
  | "symfony"
  | "css";

type Project = {
  id: ProjectId;
  i18nNameKey: string;
  i18nDescriptionKey: string;
  url?: string;
  kind: "web-app" | "extension" | "tool" | "platform";
  technologies: TechnologyId[];
  size: ProjectSize;
  imageSrc: string;
  imageAlt: string;
  mobileOrder: number;
};

// Étape 5: Mapping technologies → icônes
const technologyIcons: Record<
  TechnologyId,
  { label: string; icon: JSX.Element }
> = {
  nextjs: { label: "Next.js", icon: <FileCode size={20} /> },
  react: { label: "React", icon: <Atom size={20} /> },
  typescript: { label: "TypeScript", icon: <Type size={20} /> },
  javascript: { label: "JavaScript", icon: <Code size={20} /> },
  tailwind: { label: "Tailwind CSS", icon: <Palette size={20} /> },
  nodejs: { label: "Node.js", icon: <Server size={20} /> },
  mongodb: { label: "MongoDB", icon: <Database size={20} /> },
  postgresql: { label: "PostgreSQL", icon: <Database size={20} /> },
  mysql: { label: "MySQL", icon: <Database size={20} /> },
  json: { label: "JSON", icon: <Braces size={20} /> },
  python: { label: "Python", icon: <Code size={20} /> },
  symfony: { label: "Symfony", icon: <Server size={20} /> },
  css: { label: "CSS", icon: <Palette size={20} /> },
};

// Étape 3: Définition de la liste `projects`
const projects: Project[] = [
  {
    id: "allaw",
    i18nNameKey: "allaw.name",
    i18nDescriptionKey: "allaw.description",
    url: "https://allaw.io",
    kind: "platform",
    technologies: [
      "nextjs",
      "react",
      "typescript",
      "tailwind",
      "nodejs",
      "postgresql",
    ],
    size: "large",
    imageSrc: "/project1.png",
    imageAlt: "Allaw project screenshot",
    mobileOrder: 1,
  },
  {
    id: "truthify",
    i18nNameKey: "truthify.name",
    i18nDescriptionKey: "truthify.description",
    url: "https://truthify.com",
    kind: "web-app",
    technologies: ["react", "javascript", "nodejs", "mongodb"],
    size: "large",
    imageSrc: "/project2.png",
    imageAlt: "Truthify project screenshot",
    mobileOrder: 2,
  },
  {
    id: "legalConstat",
    i18nNameKey: "legalConstat.name",
    i18nDescriptionKey: "legalConstat.description",
    kind: "tool",
    technologies: ["javascript", "css", "python"],
    size: "large",
    imageSrc: "/project3.png",
    imageAlt: "Légal Constat project screenshot",
    mobileOrder: 3,
  },
  {
    id: "smartflow",
    i18nNameKey: "smartflow.name",
    i18nDescriptionKey: "smartflow.description",
    kind: "tool",
    technologies: ["javascript", "json"],
    size: "large",
    imageSrc: "/project4.png",
    imageAlt: "Smartflow project screenshot",
    mobileOrder: 4,
  },
  {
    id: "decorNature",
    i18nNameKey: "decorNature.name",
    i18nDescriptionKey: "decorNature.description",
    url: "https://decor-nature.vercel.app/",
    kind: "web-app",
    technologies: ["nextjs", "react", "typescript", "tailwind"],
    size: "square",
    imageSrc: "/project5.png",
    imageAlt: "Decor Nature project screenshot",
    mobileOrder: 5,
  },
  {
    id: "aimoto",
    i18nNameKey: "aimoto.name",
    i18nDescriptionKey: "aimoto.description",
    url: "https://aimoto.vercel.app/",
    kind: "web-app",
    technologies: ["nextjs", "react", "typescript", "tailwind"],
    size: "square",
    imageSrc: "/project6-2.png",
    imageAlt: "Aimoto project screenshot",
    mobileOrder: 6,
  },
  {
    id: "liic",
    i18nNameKey: "liic.name",
    i18nDescriptionKey: "liic.description",
    url: "https://liic.website/",
    kind: "web-app",
    technologies: ["react", "javascript", "tailwind"],
    size: "square",
    imageSrc: "/project6.png",
    imageAlt: "LIIC project screenshot",
    mobileOrder: 7,
  },
  {
    id: "teslaApp",
    i18nNameKey: "teslaApp.name",
    i18nDescriptionKey: "teslaApp.description",
    kind: "tool",
    technologies: ["react", "javascript"],
    size: "square",
    imageSrc: "/project1-old.png", // Placeholder
    imageAlt: "Tesla App project screenshot",
    mobileOrder: 8,
  },
  {
    id: "emmausConnect",
    i18nNameKey: "emmausConnect.name",
    i18nDescriptionKey: "emmausConnect.description",
    kind: "platform",
    technologies: ["symfony", "mysql", "javascript"],
    size: "square",
    imageSrc: "/project1-old.png", // Placeholder
    imageAlt: "Emmaus Connect project screenshot",
    mobileOrder: 9,
  },
  {
    id: "wilderGame",
    i18nNameKey: "wilderGame.name",
    i18nDescriptionKey: "wilderGame.description",
    kind: "web-app",
    technologies: ["react", "javascript"],
    size: "square",
    imageSrc: "/project1-old.png", // Placeholder
    imageAlt: "Wilder Game project screenshot",
    mobileOrder: 10,
  },
  {
    id: "legalDirectory",
    i18nNameKey: "legalDirectory.name",
    i18nDescriptionKey: "legalDirectory.description",
    kind: "tool",
    technologies: ["nextjs", "react", "typescript", "tailwind"],
    size: "square",
    imageSrc: "/project1-old.png", // Placeholder
    imageAlt: "Legal Directory project screenshot",
    mobileOrder: 11,
  },
];

// Étape 11: Layout desktop
const desktopGridClassesById: Record<ProjectId, string> = {
  decorNature: "lg:col-start-1 lg:row-start-1",
  aimoto: "lg:col-start-2 lg:row-start-1",
  truthify: "lg:col-start-3 lg:row-start-1 lg:col-span-1 lg:row-span-2",
  allaw: "lg:col-start-1 lg:row-start-2 lg:col-span-1 lg:row-span-2",
  liic: "lg:col-start-2 lg:row-start-2",
  legalConstat: "lg:col-start-2 lg:row-start-3 lg:col-span-2",
  emmausConnect: "lg:col-start-1 lg:row-start-4",
  wilderGame: "lg:col-start-2 lg:row-start-4",
  teslaApp: "lg:col-start-3 lg:row-start-4",
  smartflow: "lg:col-start-1 lg:row-start-5 lg:col-span-2",
  legalDirectory: "lg:col-start-3 lg:row-start-5",
};

// Étape 6 & 7: Composant ProjectCard2
type ProjectCard2Props = { project: Project };

function ProjectCard2({ project }: ProjectCard2Props) {
  const t = useTranslations("projects");

  const name = t(project.i18nNameKey);
  const description = t(project.i18nDescriptionKey);

  const handleInteraction = () => {
    if (project.url) {
      window.open(project.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleInteraction();
    }
  };

  const isLargeHorizontal =
    project.id === "legalConstat" || project.id === "smartflow";

  const articleClasses = `
    group relative rounded-3xl overflow-hidden border border-neutral-300/60 dark:border-neutral-700/60
    bg-neutral-200/60 dark:bg-neutral-800/60
    cursor-pointer transition-all duration-300
    hover:ring-2 hover:ring-sky-500 hover:scale-[1.02]
    focus:ring-2 focus:ring-sky-500 focus:scale-[1.02]
    md:col-span-1 md:row-span-1
    ${project.size === "large" ? "md:col-span-2" : ""}
    ${desktopGridClassesById[project.id]}
  `;

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Ouvrir le projet ${name}`}
      onClick={handleInteraction}
      onKeyDown={handleKeyDown}
      className={articleClasses}
      data-aos="fade-up"
    >
      <div
        className={`relative w-full h-full flex ${
          isLargeHorizontal ? "flex-row" : "flex-col"
        }`}
      >
        <div
          className={`relative ${isLargeHorizontal ? "w-1/2" : "w-full h-1/2"}`}
        >
          <Image
            src={project.imageSrc}
            alt={project.imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div
          className={`flex flex-col justify-between p-4 ${
            isLargeHorizontal ? "w-1/2" : "w-full h-1/2"
          }`}
        >
          <div>
            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              {name}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Étape 12: Bandeau technologies */}
      <div
        className="absolute bottom-0 left-0 w-full p-3 bg-black/50 backdrop-blur-sm
                   translate-y-full group-hover:translate-y-0 group-focus:translate-y-0
                   transition-transform duration-300 ease-in-out"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {project.technologies.map((techId) => (
            <div key={techId} className="flex items-center gap-2 text-white">
              {technologyIcons[techId].icon}
              <span className="text-xs font-medium">
                {technologyIcons[techId].label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

// Étape 8: Composant Projects2
export default function Projects2() {
  const t = useTranslations("projects");

  useEffect(() => {
    AOS.init({ duration: 300, once: true });
  }, []);

  const sortedProjects = [...projects].sort(
    (a, b) => a.mobileOrder - b.mobileOrder,
  );

  return (
    <section id="projects" className="w-full px-4">
      <div className="flex items-center gap-4 mb-8" data-aos="fade-up">
        <Rocket className="text-sky-500" size={32} />
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-neutral-200">
          {t("title")}
        </h2>
      </div>
      <p
        className="text-lg text-neutral-600 dark:text-neutral-400 mb-12"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {t("subtitle")}
      </p>

      {/* Étape 9, 10, 11: Grille responsive */}
      <div
        id="projectsCardsContainer"
        className="w-full grid gap-6 
                   grid-cols-1 
                   md:grid-cols-2
                   lg:grid-cols-3 lg:[grid-auto-rows:260px]"
      >
        {sortedProjects.map((project) => (
          <ProjectCard2 key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
