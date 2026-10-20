import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Download,
  ExternalLink,
  Github,
  Info,
  Mail,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import type {
  ProjectCaseStudyManifest,
  ProjectCatalogEntry,
  ProjectLocale,
} from "@/content/projects/types";
import { getPortfolioPath, getProjectDetailPath } from "@/lib/projects/routes";
import ProjectArchitectureDiagram from "./ProjectArchitectureDiagram";
import ProjectCaseStudyNav from "./ProjectCaseStudyNav";
import ProjectGallery from "./ProjectGallery";
import ProjectScrollReveal from "./ProjectScrollReveal";
import ProjectVideoSection from "./ProjectVideoSection";
import ProjectVisualFrame from "./ProjectVisualFrame";
import ProjectWorkflow from "./ProjectWorkflow";
import { TechnologyBadges } from "./TechnologyBadges";

function InfoItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
        {label}
      </span>
      <span className="block font-medium leading-snug text-neutral-900 dark:text-neutral-100">
        {value}
      </span>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="mb-14 max-w-4xl md:mb-20">
      {eyebrow ? (
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-red-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-neutral-950 dark:text-neutral-50 md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

const outcomeIcons: LucideIcon[] = [Workflow, Sparkles, Download];

function OutcomeStrip({
  outcomes,
  title,
}: {
  outcomes: NonNullable<ProjectCaseStudyManifest["outcomes"]>;
  title: string;
}) {
  const visibleOutcomes = outcomes.slice(0, 3);
  if (!visibleOutcomes.length) return null;

  return (
    <section className="border-b border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-900 dark:bg-[#111111] md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2
          data-reveal
          className="mb-12 text-3xl font-bold tracking-[-0.04em] text-neutral-950 dark:text-neutral-50 md:mb-16 md:text-5xl"
        >
          {title}
        </h2>
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {visibleOutcomes.map((outcome, index) => {
            const Icon = outcomeIcons[index] ?? AlertTriangle;
            return (
              <div
                key={outcome.id}
                data-reveal
                data-reveal-delay={index * 80}
                className="flex gap-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-neutral-950 dark:text-neutral-50">
                    {outcome.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {outcome.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NextProjectCard({
  project,
  label,
  description,
  href,
}: {
  project: ProjectCatalogEntry;
  label: string;
  description: string;
  href?: string;
}) {
  const className =
    "group block w-full text-left relative h-[400px] rounded-[2rem] md:rounded-[3rem] overflow-hidden focus-visible:ring-4 focus-visible:ring-red-500 outline-none border border-neutral-200 dark:border-neutral-800 bg-neutral-900";

  const content = (
    <>
      <div className="absolute inset-0 bg-neutral-900 transition-colors duration-500 group-hover:bg-neutral-800" />
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-10 text-white md:p-16">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          {label}
        </span>
        <div className="mt-auto">
          <h3 className="mb-4 text-5xl font-bold tracking-tighter transition-transform duration-500 group-hover:translate-x-4 motion-reduce:transform-none motion-reduce:transition-none md:text-7xl">
            {project.canonicalName}
          </h3>
          <p className="max-w-xl text-xl font-light text-neutral-400 transition-transform delay-75 duration-500 group-hover:translate-x-2 motion-reduce:transform-none motion-reduce:transition-none md:text-2xl">
            {description}
          </p>
        </div>
        <div className="absolute bottom-10 right-10 flex size-16 scale-90 items-center justify-center rounded-full bg-white text-neutral-900 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:scale-100 motion-reduce:transition-none md:bottom-16 md:right-16">
          <ArrowRight size={24} aria-hidden="true" />
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${label}: ${project.canonicalName}`}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      aria-label={`${label}: ${project.canonicalName}`}
      className={className}
    >
      {content}
    </div>
  );
}

export default async function ProjectCaseStudyTemplate({
  project,
  manifest,
  locale,
  previous,
  next,
  nextPortfolioProject,
  editorialBody,
  preview = false,
}: {
  project: ProjectCatalogEntry;
  manifest: ProjectCaseStudyManifest;
  locale: ProjectLocale;
  previous?: ProjectCatalogEntry;
  next?: ProjectCatalogEntry;
  nextPortfolioProject?: ProjectCatalogEntry;
  editorialBody?: ReactNode;
  preview?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "caseStudy" });
  const projectT = await getTranslations({ locale, namespace: "projects" });
  const liveUrl = project.links.live?.verified
    ? project.links.live.url
    : undefined;
  const githubUrl = project.links.github?.verified
    ? project.links.github.url
    : undefined;
  const heroVisual = manifest.hero.visual ?? {
    type: "illustration" as const,
    label: project.canonicalName,
  };
  const visibleChallenges = (manifest.challenges ?? []).slice(0, 4);
  const nextNavigationProject = next ?? nextPortfolioProject;
  const nextNavigationIsAvailable = Boolean(next && next.id !== project.id);

  return (
    <ProjectScrollReveal
      data-case-study-template={manifest.variant}
      className="min-h-screen overflow-x-hidden bg-neutral-50 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-50"
    >
      {preview ? (
        <div className="fixed bottom-4 left-4 z-[100] rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-600 backdrop-blur dark:text-red-300">
          {t("fixtureNotice")}
        </div>
      ) : null}
      {/* Navigation fixe : retour au portfolio, ancres et thème. */}
      <ProjectCaseStudyNav
        locale={locale}
        showChallenges={Boolean(manifest.challenges?.length)}
      />

      <main id="top">
        {/* Hero : identité du projet et illustration produit existante. */}
        <section className="relative overflow-hidden border-b border-neutral-200 px-6 pb-20 pt-40 dark:border-neutral-900 md:pb-32 md:pt-48">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.14),transparent_32%),linear-gradient(to_bottom,rgba(255,255,255,0.34),transparent_42%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.16),transparent_32%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_42%)]" />
          <div className="mx-auto max-w-7xl text-center">
            {manifest.hero.pill ? (
              <p className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-600 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
                <span
                  className="size-2 animate-pulse rounded-full bg-red-500 motion-reduce:animate-none"
                  aria-hidden="true"
                />
                {manifest.hero.pill}
              </p>
            ) : null}
            <h1 className="mx-auto max-w-6xl text-6xl font-extrabold leading-[0.88] tracking-[-0.075em] text-gradient sm:text-8xl md:text-[9rem]">
              {project.canonicalName}
            </h1>
            <p className="mx-auto mt-10 max-w-4xl text-xl font-light leading-relaxed text-neutral-500 dark:text-neutral-400 md:text-2xl">
              {manifest.hero.description}
            </p>
            {liveUrl || githubUrl ? (
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {liveUrl ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-neutral-700 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    {projectT("accessProject")}
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                ) : null}
                {githubUrl ? (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-neutral-300 px-6 text-sm font-semibold text-neutral-800 transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-neutral-700 dark:text-neutral-100 dark:hover:text-red-400"
                  >
                    <Github size={16} aria-hidden="true" />
                    {projectT("viewOnGithub")}
                  </a>
                ) : null}
              </div>
            ) : null}

            <div className="mx-auto mt-20 w-full max-w-[42rem] px-2 md:mt-24 md:px-0">
              <ProjectVisualFrame
                visual={heroVisual}
                className="aspect-[16/10] w-full"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            </div>
          </div>
        </section>

        {/* Vue d’ensemble : problème, solution et périmètre de contribution. */}
        <section
          id="overview"
          className="overview-section scroll-mt-20 border-b border-neutral-200 py-24 dark:border-neutral-900 md:py-32"
        >
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 sm:px-8 md:px-16 lg:grid-cols-12 lg:gap-24">
            <div
              data-reveal
              className="flex min-w-0 flex-col justify-center pt-2 lg:col-span-7"
            >
              <div className="mb-10 max-w-4xl md:mb-10">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-6 bg-red-500" aria-hidden="true" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-500 sm:text-xs">
                    {t("overviewEyebrow")}
                  </p>
                </div>
                <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-5xl lg:text-[54px]">
                  {manifest.hero.hook}
                </h2>
              </div>
              <div className="space-y-8 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
                <p>
                  <strong className="font-semibold text-neutral-950 dark:text-neutral-200">
                    {t("problem")}
                  </strong>
                  <span
                    className="mx-1 text-neutral-300 dark:text-neutral-600"
                    aria-hidden="true"
                  >
                    —
                  </span>
                  {manifest.overview.problem}
                </p>
                <p>
                  <strong className="font-semibold text-neutral-950 dark:text-neutral-200">
                    {t("solution")}
                  </strong>
                  <span
                    className="mx-1 text-neutral-300 dark:text-neutral-600"
                    aria-hidden="true"
                  >
                    —
                  </span>
                  {manifest.overview.solution}
                </p>
              </div>
            </div>
            <aside
              data-reveal
              data-reveal-delay="80"
              className="overview-glass-card relative w-full self-start overflow-hidden rounded-[2rem] border border-neutral-200/60 p-8 shadow-[0_8px_40px_rgb(0,0,0,0.03)] transition-shadow duration-500 hover:shadow-[0_12px_50px_rgb(0,0,0,0.05)] dark:border-neutral-800/70 dark:shadow-[0_8px_40px_rgb(0,0,0,0.2)] dark:hover:shadow-[0_12px_50px_rgb(0,0,0,0.3)] sm:p-10 lg:col-span-5"
            >
              <div
                className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent opacity-50 dark:via-neutral-600"
                aria-hidden="true"
              />
              <h3 className="mb-10 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                <Info
                  className="size-4 text-neutral-300 dark:text-neutral-600"
                  aria-hidden="true"
                />
                {t("contributionAndScope")}
              </h3>
              <div className="space-y-8">
                {manifest.overview.audience ? (
                  <InfoItem
                    label={t("audience")}
                    value={manifest.overview.audience}
                  />
                ) : null}
                {manifest.overview.audience &&
                (manifest.overview.role || manifest.overview.scope) ? (
                  <div
                    className="h-px w-full bg-gradient-to-r from-neutral-200/20 via-neutral-200 to-neutral-200/20 dark:from-transparent dark:via-neutral-700 dark:to-transparent"
                    aria-hidden="true"
                  />
                ) : null}
                {manifest.overview.role ? (
                  <InfoItem
                    label={t("contribution")}
                    value={manifest.overview.role}
                  />
                ) : null}
                {manifest.overview.role && manifest.overview.scope ? (
                  <div
                    className="h-px w-full bg-gradient-to-r from-neutral-200/20 via-neutral-200 to-neutral-200/20 dark:from-transparent dark:via-neutral-700 dark:to-transparent"
                    aria-hidden="true"
                  />
                ) : null}
                <InfoItem label={t("scope")} value={manifest.overview.scope} />
              </div>
            </aside>
          </div>
        </section>

        {/* Contenu éditorial optionnel, rendu par le manifeste du projet. */}
        {editorialBody ? (
          <section className="border-b border-neutral-200 bg-white py-24 dark:border-neutral-900 dark:bg-[#0A0A0A] md:py-32">
            <article
              data-reveal
              className="case-study-prose mx-auto max-w-3xl px-6"
            >
              {editorialBody}
            </article>
          </section>
        ) : null}

        {/* Démonstration : façade vidéo puis lecteur à la demande. */}
        {manifest.video ? (
          <ProjectVideoSection
            video={manifest.video}
            title={t("videoTitle")}
            facadeBadge={t("videoFacadeBadge")}
            facadeTitle={t("videoFacadeTitle")}
            playLabel={t("videoPlay")}
            closeLabel={t("videoClose")}
            regionLabel={t("videoRegion")}
            unavailable={t("videoUnavailable")}
          />
        ) : null}

        {/* Workflow interactif : étapes et illustration associée. */}
        {manifest.workflow?.length ? (
          <ProjectWorkflow
            steps={manifest.workflow}
            title={t("workflowTitle")}
            previousLabel={t("previousStep")}
            nextLabel={t("nextStep")}
          />
        ) : null}

        {/* Architecture : composants techniques et relations principales. */}
        {manifest.architecture ? (
          <ProjectArchitectureDiagram
            architecture={manifest.architecture}
            title={t("architectureTitle")}
            relationLabel={t("architectureRelation")}
            asyncFlowLabel={t("asyncFlow")}
          />
        ) : null}

        {/* Galerie optionnelle : visuels et agrandissement accessible. */}
        {manifest.gallery?.length ? (
          <ProjectGallery
            items={manifest.gallery}
            title={t("galleryTitle")}
            closeLabel={t("closeLightbox")}
            openLabel={t("openImage")}
          />
        ) : null}

        {/* Défis techniques : quatre cartes contrainte / solution. */}
        {manifest.challenges?.length ? (
          <section
            id="challenges"
            className="challenges-section scroll-mt-20 border-b border-neutral-200 py-24 dark:border-neutral-900 md:py-32"
          >
            <div className="mx-auto max-w-[1240px] px-4 sm:px-8 md:px-12 lg:px-24">
              <div data-reveal>
                <SectionHeading title={t("challengesTitle")} />
              </div>
              <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
                {visibleChallenges.map((challenge, index) => (
                  <article
                    key={challenge.id}
                    data-reveal
                    data-reveal-delay={(index % 2) * 80}
                    className="group flex h-full flex-col rounded-3xl border border-neutral-900/[0.03] bg-white p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-neutral-900/[0.08] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] motion-reduce:transform-none motion-reduce:transition-none dark:border-neutral-800/70 dark:bg-neutral-900/80 dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.2)] dark:hover:border-neutral-700 dark:hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.35)] md:p-12"
                  >
                    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center md:mb-12">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] border border-neutral-100 bg-neutral-50 text-sm font-bold text-neutral-400 transition-all duration-500 group-hover:border-red-500/10 group-hover:bg-red-500/5 group-hover:text-red-500 motion-reduce:transition-none dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-500 dark:group-hover:border-red-500/20 dark:group-hover:bg-red-500/10 dark:group-hover:text-red-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl font-bold leading-tight text-neutral-950 transition-colors duration-500 group-hover:text-red-500 motion-reduce:transition-none dark:text-neutral-50 dark:group-hover:text-red-400">
                        {challenge.title}
                      </h3>
                    </div>
                    <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10">
                      {challenge.problem || challenge.constraint ? (
                        <div className="relative">
                          <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                            {t("constraint")}
                          </h4>
                          <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                            {challenge.problem ?? challenge.constraint}
                          </p>
                        </div>
                      ) : null}
                      {challenge.solution ? (
                        <div className="relative">
                          <h4 className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-500 dark:text-red-400">
                            <span
                              className="size-1.5 animate-pulse rounded-full bg-red-500/80 motion-reduce:animate-none dark:bg-red-400/80"
                              aria-hidden="true"
                            />
                            {t("solution")}
                          </h4>
                          <p className="text-sm font-medium leading-relaxed text-neutral-900 dark:text-neutral-200">
                            {challenge.solution}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Stack : badges partagés avec les autres vues du portfolio. */}
        {manifest.stack?.length ? (
          <section className="border-b border-neutral-200 bg-white py-16 text-center dark:border-neutral-900 dark:bg-[#0A0A0A] md:py-20">
            <div data-reveal className="mx-auto max-w-4xl px-6">
              <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                {t("stackTitle")}
              </p>
              <div className="flex justify-center">
                <TechnologyBadges
                  technologies={manifest.stack}
                  label={t("stackTitle")}
                />
              </div>
            </div>
          </section>
        ) : null}

        {/* Résultats : synthèse des trois points issus du manifeste. */}
        {manifest.outcomes?.length ? (
          <OutcomeStrip
            outcomes={manifest.outcomes}
            title={t("outcomesTitle")}
          />
        ) : null}

        {/* Navigation entre les études de cas disponibles. */}
        {previous || nextNavigationProject ? (
          <section className="bg-neutral-50 py-16 dark:bg-[#111111]">
            <div className="mx-auto max-w-7xl px-6">
              <div data-reveal className="grid gap-6 md:grid-cols-2">
                {previous && previous.id !== project.id ? (
                  <Link
                    href={getProjectDetailPath(locale, previous.slug)}
                    className="group rounded-[2rem] border border-neutral-200 bg-neutral-900 p-8 text-white transition-transform hover:-translate-y-1 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-neutral-800 md:p-12"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                      {t("previousProject")}
                    </span>
                    <span className="mt-14 flex items-end justify-between gap-4">
                      <span className="text-4xl font-bold tracking-tight md:text-6xl">
                        {previous.canonicalName}
                      </span>
                      <ArrowLeft
                        className="shrink-0 transition-transform group-hover:-translate-x-2 motion-reduce:transform-none"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                ) : null}
                {nextNavigationProject ? (
                  <div className="md:col-span-2">
                    <NextProjectCard
                      project={nextNavigationProject}
                      label={t("nextProject")}
                      description={projectT(
                        nextNavigationProject.descriptionKey,
                      )}
                      href={
                        nextNavigationIsAvailable
                          ? getProjectDetailPath(
                              locale,
                              nextNavigationProject.slug,
                            )
                          : undefined
                      }
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      {/* Contact : appel à l’action puis séparation sur toute la largeur. */}
      <footer
        id="contact"
        className="scroll-mt-20 border-t border-neutral-200 bg-neutral-50 py-24 text-center dark:border-neutral-900 dark:bg-[#0A0A0A]"
      >
        <div data-reveal className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-neutral-950 dark:text-neutral-50 md:text-5xl">
            {t("contactTitle")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
            {t("contactDescription")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:vincedsb@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 font-medium text-white transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <Mail size={17} aria-hidden="true" />
              {t("contactEmail")}
            </a>
            <a
              href="https://www.malt.fr/profile/vincentdesbrosses"
              target="_blank"
              rel="noopener noreferrer me"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 font-medium text-neutral-900 transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:text-red-400"
            >
              {t("contactMalt")}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-20 border-t border-neutral-200 dark:border-neutral-900">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-6 pt-8 text-sm text-neutral-500 dark:text-neutral-400 md:flex-row">
            <p>© 2026 Vincent Desbrosses.</p>
            <Link
              href={getPortfolioPath(locale)}
              className="inline-flex items-center gap-2 transition-colors hover:text-neutral-950 dark:hover:text-white"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              {t("backToProjects")}
            </Link>
          </div>
        </div>
      </footer>
    </ProjectScrollReveal>
  );
}
