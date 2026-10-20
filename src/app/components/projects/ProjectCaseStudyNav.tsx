"use client";

import { Menu, X, ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import type { ProjectLocale } from "@/content/projects/types";
import { getPortfolioPath } from "@/lib/projects/routes";
import ProjectThemeToggle from "./ProjectThemeToggle";

export default function ProjectCaseStudyNav({
  locale,
  showChallenges,
}: {
  locale: ProjectLocale;
  showChallenges: boolean;
}) {
  const t = useTranslations("caseStudy");
  const [open, setOpen] = useState(false);
  const portfolioPath = getPortfolioPath(locale);

  const links = [
    { href: "#overview", label: t("overview") },
    ...(showChallenges
      ? [{ href: "#challenges", label: t("challenges") }]
      : []),
    { href: "#contact", label: t("contact") },
  ];

  const handleSectionLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", href);
    setOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-transparent transition-colors duration-300">
      <div className="absolute inset-0 -z-10 bg-neutral-50/85 backdrop-blur-md dark:bg-neutral-950/85" />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href={portfolioPath}
          className="group inline-flex items-center gap-3 rounded-lg p-1 text-sm font-medium tracking-tight text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-neutral-50"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-neutral-50 transition-transform group-hover:scale-105 dark:bg-neutral-50 dark:text-neutral-900">
            V
          </span>
          <span className="hidden sm:inline">Vincent Desbrosses</span>
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm font-medium text-neutral-500 dark:text-neutral-400 md:flex"
          aria-label={t("mainNavigation")}
        >
          <Link
            href={portfolioPath}
            className="inline-flex items-center gap-1 transition-colors hover:text-neutral-950 dark:hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {t("backToProjects")}
          </Link>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleSectionLinkClick(event, link.href)}
              className="transition-colors hover:text-neutral-950 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ProjectThemeToggle label={t("toggleTheme")} />
          <a
            href="#contact"
            onClick={(event) => handleSectionLinkClick(event, "#contact")}
            className="hidden items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 sm:inline-flex"
          >
            <Briefcase size={15} aria-hidden="true" />
            {t("contact")}
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="case-study-mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-neutral-400 dark:hover:bg-neutral-800 md:hidden"
          >
            {open ? (
              <X size={21} aria-hidden="true" />
            ) : (
              <Menu size={21} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="case-study-mobile-menu"
          className="flex flex-col gap-4 border-t border-neutral-200 bg-neutral-50 p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-950 md:hidden"
          aria-label={t("mainNavigation")}
        >
          <Link
            href={portfolioPath}
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-red-500"
          >
            {t("backToProjects")}
          </Link>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleSectionLinkClick(event, link.href)}
              className="text-lg font-medium hover:text-red-500"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
