"use client";

import { SurfaceButton } from "@/components/ui/Button";

import { motionTokens } from "@/lib/motion-tokens";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  Layers3,
  Monitor,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import type { ProjectWorkflowStep } from "@/content/projects/types";
import ProjectVisualFrame from "./ProjectVisualFrame";

const visualIcons: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  code: Code2,
  database: Database,
  monitor: Monitor,
  workflow: Workflow,
  layers: Layers3,
};

function WorkflowVisual({ step }: { step: ProjectWorkflowStep }) {
  const visual = step.visual;
  if (visual.type === "icon") {
    const Icon = visual.icon ? visualIcons[visual.icon] ?? Sparkles : Sparkles;
    return (
      <div className="flex h-full min-h-[20rem] flex-col items-center justify-center gap-6 p-10 text-center">
        <span className="flex size-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 text-accent shadow-inner">
          <Icon size={36} aria-hidden="true" />
        </span>
        <div>
          <h4 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
            {visual.title}
          </h4>
          <p className="mt-3 max-w-md leading-relaxed text-content-muted dark:text-content-subtle">
            {visual.description}
          </p>
        </div>
      </div>
    );
  }

  if (visual.type === "mockup") {
    return (
      <div className="flex h-full min-h-[20rem] flex-col justify-center p-5 sm:p-8">
        <ProjectVisualFrame
          visual={visual.visual}
          className="aspect-[16/10] w-full"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
        <div className="mt-5">
          <h4 className="font-bold text-neutral-950 dark:text-neutral-50">
            {visual.title}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-content-muted dark:text-content-subtle">
            {visual.description}
          </p>
        </div>
      </div>
    );
  }

  if (visual.type === "flow") {
    const isBoard = visual.steps.length > 6;
    return (
      <div className="flex h-full min-h-[20rem] flex-col justify-center p-6 sm:p-10">
        <div className="mb-7">
          <h4 className="font-bold text-neutral-950 dark:text-neutral-50">
            {visual.title}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-content-muted dark:text-content-subtle">
            {visual.description}
          </p>
        </div>
        <div
          className={
            isBoard
              ? "mx-auto grid w-full max-w-sm grid-cols-3 gap-2"
              : "flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-2"
          }
        >
          {visual.steps.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className={
                isBoard ? "contents" : "flex items-center gap-2 sm:contents"
              }
            >
              <div className="flex min-h-14 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-center text-sm font-semibold text-neutral-800 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                {item}
              </div>
              {!isBoard && index < visual.steps.length - 1 ? (
                <>
                  <ArrowRight
                    className="hidden shrink-0 text-accent sm:block"
                    size={20}
                    aria-hidden="true"
                  />
                  <ArrowDown
                    className="mx-auto text-accent sm:hidden"
                    size={18}
                    aria-hidden="true"
                  />
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[20rem] flex-col items-center justify-center p-8 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/20">
        <CheckCircle2 size={38} aria-hidden="true" />
      </span>
      <h4 className="mt-6 text-xl font-bold text-neutral-950 dark:text-neutral-50">
        {visual.title}
      </h4>
      <p className="mt-3 max-w-md leading-relaxed text-content-muted dark:text-content-subtle">
        {visual.description}
      </p>
      {visual.visual ? (
        <ProjectVisualFrame
          visual={visual.visual}
          className="mt-6 w-full max-w-sm"
          sizes="(max-width: 640px) 100vw, 384px"
        />
      ) : null}
    </div>
  );
}

export default function ProjectWorkflow({
  steps,
  title,
  previousLabel,
  nextLabel,
}: {
  steps: ProjectWorkflowStep[];
  title: string;
  previousLabel: string;
  nextLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const activeStep = steps[activeIndex];
  if (!activeStep) return null;

  const selectStep = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, steps.length - 1)));
  };

  return (
    <section
      id="workflow"
      className="border-b border-neutral-200  py-24 dark:border-neutral-900 bg-surface-sunken md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Titre puis sélecteur d’étapes et panneau illustré. */}
        <div data-reveal className="mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-neutral-950 dark:text-neutral-50 md:text-5xl">
            {title}
          </h2>
        </div>
        <div
          data-reveal
          className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16"
        >
          <div
            className="flex snap-x gap-3 overflow-x-auto pb-3 lg:col-span-5 lg:flex-col lg:overflow-visible lg:pb-0"
            role="tablist"
            aria-orientation="vertical"
            aria-label={title}
          >
            {steps.map((step, index) => {
              const selected = index === activeIndex;
              return (
                <SurfaceButton
                  key={step.id}
                  type="button"
                  role="tab"
                  id={`workflow-tab-${step.id}`}
                  aria-selected={selected}
                  aria-controls={`workflow-panel-${step.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectStep(index)}
                  onKeyDown={(event) => {
                    let nextIndex = index;
                    if (
                      event.key === "ArrowDown" ||
                      event.key === "ArrowRight"
                    ) {
                      nextIndex = (index + 1) % steps.length;
                    } else if (
                      event.key === "ArrowUp" ||
                      event.key === "ArrowLeft"
                    ) {
                      nextIndex = (index - 1 + steps.length) % steps.length;
                    } else if (event.key === "Home") {
                      nextIndex = 0;
                    } else if (event.key === "End") {
                      nextIndex = steps.length - 1;
                    } else {
                      return;
                    }
                    event.preventDefault();
                    selectStep(nextIndex);
                    window.requestAnimationFrame(() => {
                      const tab = document.getElementById(
                        `workflow-tab-${steps[nextIndex].id}`,
                      );
                      tab?.focus({ preventScroll: true });
                      tab?.scrollIntoView({
                        block: "nearest",
                        inline: "nearest",
                        behavior: reducedMotion ? "auto" : "smooth",
                      });
                    });
                  }}
                  className={`flex min-w-[15rem] shrink-0 items-start gap-4 rounded-2xl border p-5 text-left transition-all    lg:min-w-0 ${
                    selected
                      ? "border-neutral-200 bg-white shadow-md ring-1 ring-black/5 dark:border-neutral-700 dark:bg-neutral-800 dark:ring-white/5"
                      : "border-transparent opacity-60 hover:bg-neutral-100 hover:opacity-100 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      selected
                        ? "bg-red-500 text-white"
                        : "bg-neutral-200 text-content-muted dark:bg-neutral-700"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-neutral-950 dark:text-neutral-50">
                      {step.title}
                    </span>
                    <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-content-muted dark:text-content-subtle">
                      {step.description}
                    </span>
                  </span>
                </SurfaceButton>
              );
            })}
          </div>

          <div className="relative min-h-[22rem] overflow-hidden rounded-card border border-neutral-200 bg-neutral-50 ring-1 ring-inset ring-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900/30 lg:col-span-7 lg:min-h-[24rem]">
            <LazyMotion features={domAnimation} strict>
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={activeStep.id}
                  id={`workflow-panel-${activeStep.id}`}
                  role="tabpanel"
                  aria-labelledby={`workflow-tab-${activeStep.id}`}
                  tabIndex={0}
                  initial={
                    reducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{
                    duration: reducedMotion ? 0 : motionTokens.base,
                    ease: motionTokens.ease,
                  }}
                  className="h-full p-4     sm:p-6"
                >
                  <WorkflowVisual step={activeStep} />
                </m.div>
              </AnimatePresence>
            </LazyMotion>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {activeIndex + 1} / {steps.length}: {activeStep.title}.{" "}
          {previousLabel} / {nextLabel}
        </p>
      </div>
    </section>
  );
}
