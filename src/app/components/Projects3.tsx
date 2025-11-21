"use client";

import { AnimatePresence, motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Atom,
  Braces,
  ChevronLeft,
  ChevronRight,
  Code,
  Database,
  FileCode,
  LineChart,
  Palette,
  Rocket,
  Server,
  Type,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const technologyMeta: Record<
  TechnologyId,
  { label: string; icon?: JSX.Element }
> = {
  nextjs: { label: "Next.js", icon: <FileCode size={16} /> },
  react: { label: "React", icon: <Atom size={16} /> },
  typescript: { label: "TypeScript", icon: <Type size={16} /> },
  javascript: { label: "JavaScript", icon: <Code size={16} /> },
  tailwind: { label: "Tailwind CSS", icon: <Palette size={16} /> },
  nodejs: { label: "Node.js", icon: <Server size={16} /> },
  mongodb: { label: "MongoDB", icon: <Database size={16} /> },
  postgresql: { label: "PostgreSQL", icon: <Database size={16} /> },
  mysql: { label: "MySQL", icon: <Database size={16} /> },
  json: { label: "JSON", icon: <Braces size={16} /> },
  python: { label: "Python", icon: <Code size={16} /> },
  symfony: { label: "Symfony" },
  css: { label: "CSS" },
  recharts: { label: "Recharts", icon: <LineChart size={16} /> },
};

function TechBadge({ techId }: { techId: TechnologyId }) {
  const tech = technologyMeta[techId];
  if (!tech) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 text-neutral-700 px-3 py-1 text-xs font-medium dark:bg-neutral-700 dark:text-neutral-100">
      {tech.icon && <span>{tech.icon}</span>}
      <span>{tech.label}</span>
    </span>
  );
}

function SimpleTechBadge({ techId }: { techId: TechnologyId }) {
  const tech = technologyMeta[techId];
  if (!tech) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-700 px-3 py-1 text-xs font-medium text-neutral-800 dark:text-neutral-100">
      {tech.label}
    </span>
  );
}

type ProjectId =
  | "allaw"
  | "truthify"
  | "aimoto"
  | "smartflow"
  | "decorNature"
  | "teslaApp"
  | "emmausConnect"
  | "wilderGame"
  | "legalDirectory"
  | "legalConstat"
  | "liic";

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
  | "css"
  | "recharts";

type Project = {
  id: ProjectId;
  i18nNameKey: string;
  i18nDescriptionKey: string;
  url?: string;
  imageSrc: string;
  imageAlt: string;
  technologies: TechnologyId[];
  isFeatured: boolean;
  kind: "platform" | "tool" | "extension" | "showcase";
  order: number;
};

const projects: Project[] = [
  {
    id: "allaw",
    order: 1,
    isFeatured: true,
    i18nNameKey: "allaw.name",
    i18nDescriptionKey: "allaw.description",
    url: "https://www.allaw.fr",
    imageSrc: "/allaw.jpg",
    imageAlt: "Screenshot of the Allaw project",
    technologies: ["nextjs", "typescript", "nodejs", "mongodb"],
    kind: "platform",
  },
  {
    id: "truthify",
    order: 2,
    isFeatured: true,
    i18nNameKey: "truthify.name",
    i18nDescriptionKey: "truthify.description",
    url: "https://www.truthify.eu/",
    imageSrc: "/truthify.png",
    imageAlt: "Screenshot of the Truthify project",
    technologies: ["nextjs", "typescript", "tailwind", "postgresql"],
    kind: "tool",
  },
  {
    id: "aimoto",
    order: 3,
    isFeatured: true,
    i18nNameKey: "aimoto.name",
    i18nDescriptionKey: "aimoto.description",
    url: undefined,
    imageSrc: "/aimoto.png",
    imageAlt: "Screenshot of the Aimoto project",
    technologies: ["nextjs", "typescript", "tailwind", "python"],
    kind: "tool",
  },
  {
    id: "smartflow",
    order: 4,
    isFeatured: true,
    i18nNameKey: "smartflow.name",
    i18nDescriptionKey: "smartflow.description",
    url: "https://www.smartflow-app.com/",
    imageSrc: "/smartflow.png",
    imageAlt: "Screenshot of the Smartflow project",
    technologies: ["nextjs", "tailwind", "postgresql", "typescript"],
    kind: "tool",
  },
  {
    id: "decorNature",
    order: 5,
    isFeatured: false,
    i18nNameKey: "decorNature.name",
    i18nDescriptionKey: "decorNature.description",
    url: "https://www.decor-nature.fr/",
    imageSrc: "/decornature.png",
    imageAlt: "Screenshot of the Decor Nature project",
    technologies: ["nextjs", "tailwind", "postgresql", "typescript"],
    kind: "showcase",
  },
  {
    id: "teslaApp",
    order: 6,
    isFeatured: false,
    i18nNameKey: "teslaApp.name",
    i18nDescriptionKey: "teslaApp.description",
    url: "https://isteslaworthit.vercel.app/",
    imageSrc: "/isteslaworthit.png",
    imageAlt: "Screenshot of the Tesla App project",
    technologies: ["nextjs", "recharts", "typescript"],
    kind: "showcase",
  },
  {
    id: "emmausConnect",
    order: 11,
    isFeatured: false,
    i18nNameKey: "emmausConnect.name",
    i18nDescriptionKey: "emmausConnect.description",
    url: "https://emmaus-connect-bay.vercel.app/",
    imageSrc: "/emmausconnect.png",
    imageAlt: "Screenshot of the Emmaus Connect project",
    technologies: ["react", "javascript", "json"],
    kind: "showcase",
  },
  {
    id: "wilderGame",
    order: 8,
    isFeatured: false,
    i18nNameKey: "wilderGame.name",
    i18nDescriptionKey: "wilderGame.description",
    url: "https://wilders-game.vercel.app/",
    imageSrc: "/wildersgame.jpg",
    imageAlt: "Screenshot of the Wilder Game project",
    technologies: ["react", "javascript", "nodejs", "mysql"],
    kind: "showcase",
  },
  {
    id: "legalDirectory",
    order: 9,
    isFeatured: false,
    i18nNameKey: "legalDirectory.name",
    i18nDescriptionKey: "legalDirectory.description",
    url: "http://5.250.176.153:5000/",
    imageSrc: "/quickflow.png",
    imageAlt: "Screenshot of the Quickflow project",
    technologies: ["react", "nodejs", "mysql", "tailwind"],
    kind: "showcase",
  },
  {
    id: "legalConstat",
    order: 10,
    isFeatured: false,
    i18nNameKey: "legalConstat.name",
    i18nDescriptionKey: "legalConstat.description",
    url: "https://www.legalconstat.fr/",
    imageSrc: "/legalconstat.png",
    imageAlt: "Legal Constat project placeholder",
    technologies: ["react", "typescript", "symfony", "css"],
    kind: "tool",
  },
  {
    id: "liic",
    order: 7,
    isFeatured: false,
    i18nNameKey: "liic.name",
    i18nDescriptionKey: "liic.description",
    url: undefined,
    imageSrc: "/liic.png",
    imageAlt: "LIIC project placeholder",
    technologies: ["typescript", "json", "nodejs"],
    kind: "extension",
  },
];

function OtherProjectCard({ project, t }: { project: Project; t: any }) {
  const handleCardClick = () => {
    if (project.url) {
      window.open(project.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      data-aos="fade-up"
      className="group flex flex-col h-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-5 md:p-6 shadow-sm hover:shadow-md transition-transform transition-shadow duration-200 hover:-translate-y-1 cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`${t("viewProjectAriaLabel")}: ${t(project.i18nNameKey)}`}
    >
      <div className="flex-grow">
        <h4 className="font-semibold text-2xl 3xs:text-3xl text-neutral-900 dark:text-neutral-50 mb-3">
          {t(project.i18nNameKey)}
        </h4>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5 line-clamp-2">
          {t(project.i18nDescriptionKey)}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((techId) => (
            <SimpleTechBadge key={techId} techId={techId} />
          ))}
        </div>
      </div>
      <div className="relative mt-auto aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={project.imageSrc}
          alt={project.imageAlt}
          layout="fill"
          objectFit="cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    </article>
  );
}

type FeaturedPanelProps = {
  project: Project;
  t: ReturnType<typeof useTranslations>;
};

function FeaturedPanel({ project, t }: FeaturedPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-10 flex-1">
        {/* Colonne gauche : texte */}
        <div className="flex flex-col items-start order-2 md:order-1">
          {/* Mobile/Tablet view: Title then Tag */}
          <div className="md:hidden flex items-center gap-x-3 mb-3">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {t(project.i18nNameKey)}
            </h3>
            <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-700 px-4 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-100">
              {project.kind.charAt(0).toUpperCase() + project.kind.slice(1)}
            </span>
          </div>

          {/* Desktop view: Tag then Title */}
          <span className="hidden md:inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-700 px-4 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-100 mb-4">
            {project.kind.charAt(0).toUpperCase() + project.kind.slice(1)}
          </span>
          <h3 className="hidden md:block text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-3">
            {t(project.i18nNameKey)}
          </h3>

          <p className="text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-300 mb-6 md:mb-8">
            {t.rich(project.i18nDescriptionKey, {
              strong: (chunks) => <strong>{chunks}</strong>,
              break: () => <br />,
            })}
          </p>

          <div>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-medium rounded-full bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 ${
                !project.url ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-disabled={!project.url}
              onClick={(e) => {
                if (!project.url) e.preventDefault();
              }}
            >
              {t("viewProject")}
            </a>
          </div>
        </div>

        {/* Colonne droite : image + badges */}
        <div className="order-1 md:order-2 flex flex-col">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
            <Image
              src={project.imageSrc}
              alt={project.imageAlt}
              layout="fill"
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {project.technologies.map((techId) => (
              <TechBadge key={techId} techId={techId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects3() {
  const t = useTranslations("projects");
  const [[activeIndex, direction], setActiveIndex] = useState<[number, 1 | -1]>([
    0,
    1,
  ]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 300 });
  }, []);

  const featuredProjects = projects
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.order - b.order);
  const otherProjects = projects
    .filter((p) => !p.isFeatured)
    .sort((a, b) => a.order - b.order);

  const goToIndex = (nextIndex: number, nextDirection: 1 | -1) => {
    if (isAnimating || nextIndex === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex([nextIndex, nextDirection]);
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % featuredProjects.length;
    goToIndex(nextIndex, 1);
  };

  const handlePrevious = () => {
    const nextIndex =
      (activeIndex - 1 + featuredProjects.length) % featuredProjects.length;
    goToIndex(nextIndex, -1);
  };

  const activeProject = featuredProjects[activeIndex];

  const slideVariants = {
    enter: (direction: 1 | -1) => ({
      x: direction === 1 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      x: "0%",
      opacity: 1,
    },
    exit: (direction: 1 | -1) => ({
      x: direction === 1 ? "-100%" : "100%",
      opacity: 0.6,
    }),
  };

  const slideTransition = {
    x: { type: "tween", duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    opacity: { type: "tween", duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  };

  return (
    <section
      id="projects3"
      className="w-full bg-neutral-100 dark:bg-neutral-900 py-12 md:py-24 lg:py-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="w-full mb-10 md:mb-14">
          <div
            id="projectsTitleTopContainer"
            className="w-full flex flex-row items-center mb-4"
            data-aos="fade-up"
          >
            <div id="projectsIcon" className="w-12">
              <Rocket size={32} className="mr-6" />
            </div>
            <h2
              id="projectsTitle"
              className="text-2xl 3xs:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              {t("title")}
            </h2>
          </div>
          <div id="projectsTitleBotContainer" className="w-full flex flex-row">
            <div id="projectsIconBlank" className="w-12" />
            <p
              id="projectsIntroContainer"
              className="max-w-2xl text-sm md:text-base text-neutral-500 dark:text-neutral-400"
              data-aos="fade-up"
            >
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Featured Projects Carousel */}
        {activeProject && (
          <div className="max-w-5xl mx-auto" data-aos="fade-up">
            <div className="rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 md:p-10 lg:p-12 shadow-sm md:shadow">
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="relative grid overflow-hidden">
                  <AnimatePresence
                    custom={direction}
                    initial={false}
                    onExitComplete={() => setIsAnimating(false)}
                  >
                    <motion.div
                      key={activeProject.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={slideTransition}
                      className="w-full h-full col-start-1 row-start-1"
                    >
                      <FeaturedPanel project={activeProject} t={t} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    aria-label={t("previousProjectAriaLabel")}
                    className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                    disabled={isAnimating}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex gap-2">
                    {featuredProjects.map((project, index) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() =>
                          goToIndex(index, index > activeIndex ? 1 : -1)
                        }
                        aria-pressed={activeIndex === index}
                        aria-label={`${t(
                          "goToProjectAriaLabel",
                        )} ${t(project.i18nNameKey)}`}
                        className="w-4 h-4 flex items-center justify-center"
                        disabled={isAnimating}
                      >
                        <span
                          className={`block rounded-full transition-all ${
                            activeIndex === index
                              ? "w-3 h-3 bg-neutral-900 dark:bg-neutral-50"
                              : "w-2 h-2 bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500 hover:w-3 hover:h-3"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={t("nextProjectAriaLabel")}
                    className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                    disabled={isAnimating}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Projects Grid */}
        <div data-aos="fade-up" className="mt-16">
          <h3 className="mt-12 md:mt-16 mb-6 text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 text-left">
            {t("othersTitle")}
          </h3>
          <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
            {otherProjects.map((project) => (
              <OtherProjectCard key={project.id} project={project} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects3;