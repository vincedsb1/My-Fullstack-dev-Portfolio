"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import {
  ArrowRightLeft,
  AppWindow,
  Atom,
  Bot,
  Boxes,
  Braces,
  Brush,
  Cloud,
  Code2,
  Container,
  Database,
  FileCode2,
  Figma,
  Github,
  Laptop,
  Leaf,
  Lightbulb,
  MessagesSquare,
  MousePointer2,
  Network,
  Package,
  Palette,
  PenTool,
  Pyramid,
  Ruler,
  Server,
  Sparkles,
  Terminal,
  Triangle,
  Type,
  Wrench,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

type Skill = {
  label: string;
  icon: LucideIcon;
};

type SkillCategory = {
  id:
    | "designProduct"
    | "frontend"
    | "backend"
    | "desktop"
    | "devops"
    | "aiAssistedDevelopment";
  skills: Skill[];
};

const skillCategories: SkillCategory[] = [
  {
    id: "designProduct",
    skills: [
      { label: "Figma", icon: Figma },
      { label: "Storybook", icon: Code2 },
      { label: "Adobe XD", icon: PenTool },
      { label: "Zeplin", icon: Ruler },
      { label: "UX/UI", icon: Palette },
      { label: "Product Thinking", icon: Lightbulb },
    ],
  },
  {
    id: "frontend",
    skills: [
      { label: "Next.js", icon: FileCode2 },
      { label: "React", icon: Atom },
      { label: "TypeScript", icon: Type },
      { label: "JavaScript", icon: Braces },
      { label: "Tailwind CSS", icon: Brush },
      { label: "CSS / SCSS", icon: Type },
    ],
  },
  {
    id: "backend",
    skills: [
      { label: "Node.js", icon: Package },
      { label: "Python", icon: Terminal },
      { label: "Express.js", icon: Server },
      { label: "PostgreSQL", icon: Database },
      { label: "MongoDB", icon: Leaf },
      { label: "MySQL", icon: Database },
      { label: "Prisma", icon: Pyramid },
      { label: "REST APIs", icon: ArrowRightLeft },
    ],
  },
  {
    id: "desktop",
    skills: [
      { label: "Swift", icon: Code2 },
      { label: "SwiftUI", icon: AppWindow },
      { label: "Xcode", icon: Laptop },
      { label: "Swift Package Manager", icon: Boxes },
    ],
  },
  {
    id: "devops",
    skills: [
      { label: "Git / GitHub", icon: Github },
      { label: "GitHub Actions", icon: Workflow },
      { label: "Docker", icon: Container },
      { label: "Vercel", icon: Triangle },
      { label: "AWS", icon: Cloud },
      { label: "Jenkins", icon: Wrench },
    ],
  },
  {
    id: "aiAssistedDevelopment",
    skills: [
      { label: "Claude Code", icon: Bot },
      { label: "Codex", icon: Braces },
      { label: "Gemini", icon: Sparkles },
      { label: "ChatGPT", icon: MessagesSquare },
      { label: "Cursor", icon: MousePointer2 },
      { label: "RAG", icon: Network },
    ],
  },
];

function Skills() {
  const t = useTranslations("skills");

  useEffect(() => {
    AOS.init({
      duration: 300,
    });
  }, []);

  return (
    <div
      id="skillsGlobalContainer"
      className="flex w-[815px] flex-col items-center justify-center px-4 xs:w-full lg:px-0"
    >
      <div
        id="skillsTitleTopContainer"
        className="mb-2 flex w-full flex-row items-center text-2xl font-bold text-neutral-700 dark:text-neutral-300"
        data-aos="fade-up"
      >
        <div id="skillsIcon" className="w-12">
          <Code2 size={32} className="mr-6 text-5xl" />
        </div>
        <h2 id="skillsTitle" className="text-2xl 3xs:text-3xl">
          {t("title")}
        </h2>
      </div>
      <div id="skillsTitleBotContainer" className="flex w-full flex-row">
        <div id="skillsIconBlank" className="w-12 shrink-0" />
        <div
          id="skillsIntroContainer"
          className="mb-16 flex flex-row text-base leading-tight text-neutral-400 dark:text-neutral-500 3xs:text-xl"
          data-aos="fade-up"
        >
          {t("intro")}
        </div>
      </div>

      <div
        id="skillsCardsContainer"
        className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillCategories.map((category, categoryIndex) => (
          <article
            key={category.id}
            id={`${category.id}SkillsCard`}
            className="flex h-full min-w-0 flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-800 dark:hover:border-neutral-700"
            data-aos="fade-up"
            data-aos-delay={categoryIndex * 40}
          >
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-300">
              {t(category.id)}
            </h3>

            <ul className="flex flex-wrap content-start gap-2">
              {category.skills.map((skill) => {
                const Icon = skill.icon;

                return (
                  <li
                    key={skill.label}
                    className="inline-flex max-w-full items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm font-medium leading-none text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-200"
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.8}
                      className="shrink-0 text-neutral-500 dark:text-neutral-400"
                      aria-hidden="true"
                    />
                    <span>{skill.label}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Skills;
