"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FileCode,
  Atom,
  Type,
  Code,
  Palette,
  Server,
  Database,
    Braces,
    LineChart,
    ChevronLeft,
    ChevronRight,
    Rocket,
  } from "lucide-react";
import { useTranslations } from "next-intl";

// Step 5: Technology mapping and badge component
const technologyMeta: Record<TechnologyId, { label: string; icon?: JSX.Element }> = {
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
  if (!tech) return null; // Or some fallback UI
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 text-neutral-800 px-3 py-1 text-xs font-medium dark:bg-neutral-800 dark:text-neutral-100">
      {tech.icon && <span>{tech.icon}</span>}
      <span>{tech.label}</span>
    </span>
  );
}

// Step 2: Define the data model as per the plan.
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

// Step 3: Populate the project data array.
const projects: Project[] = [
  // Featured Projects
  {
    id: "allaw",
    order: 1,
    isFeatured: true,
    i18nNameKey: "allaw.name",
    i18nDescriptionKey: "allaw.description",
    url: "https://www.allaw.fr",
    imageSrc: "/projects/allaw.png",
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
    imageSrc: "/projects/truthify.png",
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
    imageSrc: "/projects/aimoto.png",
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
    imageSrc: "/project6-2.png",
    imageAlt: "Screenshot of the Smartflow project",
    technologies: ["nextjs", "tailwind", "postgresql", "typescript"],
    kind: "tool",
  },
  // Other Projects
  {
    id: "decorNature",
    order: 5,
    isFeatured: false,
    i18nNameKey: "decorNature.name",
    i18nDescriptionKey: "decorNature.description",
    url: undefined,
    imageSrc: "/project5.png",
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
    url: undefined,
    imageSrc: "/project1.png",
    imageAlt: "Screenshot of the Tesla App project",
    technologies: ["nextjs", "recharts", "typescript"],
    kind: "showcase",
  },
  {
    id: "emmausConnect",
    order: 7,
    isFeatured: false,
    i18nNameKey: "emmausConnect.name",
    i18nDescriptionKey: "emmausConnect.description",
    url: undefined,
    imageSrc: "/project2.png",
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
    url: undefined,
    imageSrc: "/project3.png",
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
    url: undefined,
    imageSrc: "/project4.png",
    imageAlt: "Screenshot of the Legal Directory project",
    technologies: ["nextjs", "tailwind", "nodejs", "postgresql"],
    kind: "showcase",
  },
  {
    id: "legalConstat",
    order: 10,
    isFeatured: false,
    i18nNameKey: "legalConstat.name",
    i18nDescriptionKey: "legalConstat.description",
    url: undefined,
    imageSrc: "/image-placeholder.png", // Placeholder
    imageAlt: "Legal Constat project placeholder",
    technologies: ["react", "typescript", "symfony", "css"],
    kind: "tool",
  },
  {
    id: "liic",
    order: 11,
    isFeatured: false,
    i18nNameKey: "liic.name",
    i18nDescriptionKey: "liic.description",
    url: undefined,
    imageSrc: "/image-placeholder.png", // Placeholder
    imageAlt: "LIIC project placeholder",
    technologies: ["typescript", "json", "nodejs"],
    kind: "extension",
  },
];

// Step 8: Other Projects Grid Card
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
      className="flex flex-col h-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 md:p-6 shadow-sm hover:shadow-md transition-transform transition-shadow duration-200 hover:-translate-y-1 cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`${t("viewProjectAriaLabel")}: ${t(project.i18nNameKey)}`}
    >
      <div className="flex-grow">
        <h4 className="font-semibold text-lg text-neutral-900 dark:text-neutral-50">
          {t(project.i18nNameKey)}
        </h4>
        <p className="mt-1 mb-3 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
          {t(project.i18nDescriptionKey)}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((techId) => (
            <TechBadge key={techId} techId={techId} />
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
        />
      </div>
    </article>
  );
}

function Projects3() {
  const t = useTranslations("projects");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 300 });
  }, []);

  const featuredProjects = projects
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.order - b.order);
  const otherProjects = projects
    .filter((p) => !p.isFeatured)
    .sort((a, b) => a.order - b.order);

  const handlePrevious = () => {
    setActiveIndex(
      (prevIndex) =>
        (prevIndex - 1 + featuredProjects.length) % featuredProjects.length
    );
  };

  const handleNext = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex + 1) % featuredProjects.length
    );
  };

  const activeProject = featuredProjects[activeIndex];

  return (
    <section id="projects3" className="w-full bg-neutral-100 dark:bg-neutral-950 py-12 md:py-24 lg:py-32">
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
              <h2 id="projectsTitle" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
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

        {/* Step 7: Featured Projects Carousel */}
        {activeProject && (
          <div data-aos="fade-up" className="max-w-5xl mx-auto mb-16">
            <div className="rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 md:p-10 lg:p-12 shadow-sm md:shadow">
              <div className="flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-10">
                {/* Left Column (Text) */}
                <div className="flex flex-col justify-center order-2 md:order-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
                    {activeProject.kind}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-3">
                    {t(activeProject.i18nNameKey)}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-300 mb-6 md:mb-8">
                    {t(activeProject.i18nDescriptionKey)}
                  </p>
                  <div className="flex gap-4">
                    <a
                      href={activeProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-medium rounded-full bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 ${
                        !activeProject.url
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      aria-disabled={!activeProject.url}
                      onClick={(e) => {
                        if (!activeProject.url) e.preventDefault();
                      }}
                    >
                      {t("viewProject")}
                    </a>
                  </div>
                </div>

                {/* Right Column (Visual) */}
                <div className="order-1 md:order-2">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
                    <Image
                      src={activeProject.imageSrc}
                      alt={activeProject.imageAlt}
                      layout="fill"
                      objectFit="cover"
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-start md:justify-start gap-2 md:gap-3">
                    {activeProject.technologies.map((techId) => (
                      <TechBadge key={techId} techId={techId} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-6 md:mt-8">
                <button
                  type="button"
                  onClick={handlePrevious}
                  aria-label={t("previousProjectAriaLabel")}
                  className="p-2 rounded-full text-neutral-500 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="flex gap-2">
                  {featuredProjects.map((project, index) => (
                    <button
                      type="button"
                      key={project.id}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`${t("goToProjectAriaLabel")} ${t(
                        project.i18nNameKey
                      )}`}
                      aria-pressed={activeIndex === index}
                    >
                      <span
                        className={`block rounded-full transition-all ${
                          activeIndex === index
                            ? "w-3 h-3 bg-neutral-900 dark:bg-neutral-50"
                            : "w-2 h-2 bg-neutral-300 dark:bg-neutral-600"
                        }`}
                      ></span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={t("nextProjectAriaLabel")}
                  className="p-2 rounded-full text-neutral-500 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Other Projects Grid */}
        <div data-aos="fade-up">
          <h3 className="mt-16 md:mt-20 mb-8 text-xl md:text-2xl font-semibold text-center text-neutral-900 dark:text-neutral-50">
            {t("othersTitle")}
          </h3>
          <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

