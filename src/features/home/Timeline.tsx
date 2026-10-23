import { getTranslations } from "next-intl/server";
import { Calendar } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import styles from "./Timeline.module.css";

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
}

async function Timeline() {
  const t = await getTranslations("timeline");
  const experiences = t.raw("experiences") as Experience[];

  return (
    <section
      id="parcours"
      aria-labelledby="timelineTitle"
      className="mx-auto flex w-full max-w-[840px] flex-col items-center justify-center px-4 md:px-0"
    >
      <div
        id="projectsTitleTopContainer"
        className="mb-2 flex w-full flex-row items-center text-neutral-700 dark:text-neutral-300"
        data-reveal
      >
        <div id="timelineIcon" className="w-12 shrink-0">
          <Calendar size={32} className="mr-6 text-5xl" />
        </div>
        <h2
          id="timelineTitle"
          className="text-2xl font-bold tracking-tight 3xs:text-3xl"
        >
          {t("title")}
        </h2>
      </div>
      <div id="projectsTitleBotContainer" className="w-full flex flex-row">
        <div id="timelineIconBlank" className="w-12 shrink-0" />
        <div
          id="projectsIntroContainer"
          className="mb-16 flex flex-row text-base font-light leading-relaxed text-[#707070] dark:text-neutral-400 md:text-lg"
          data-reveal
        >
          {t("intro")}
        </div>
      </div>

      <div id="timelineCardsContainer" className="relative w-full" data-reveal>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 left-4 top-8 z-0 w-[2px] -translate-x-1/2 bg-neutral-200/80 dark:bg-neutral-800 md:left-6"
        />
        <ol className="relative z-10 space-y-6 md:space-y-8">
          {experiences?.map((experience, index) => {
            const isCurrent = index === 0;

            return (
              <li
                key={experience.company}
                id={`timelineCard${experience.company}`}
                className="group relative flex items-start gap-4 md:gap-6"
              >
                <div
                  id={`timelinePuceContainer${experience.company}`}
                  className="relative z-10 flex w-8 flex-none justify-center pt-7 md:w-12"
                >
                  {isCurrent && (
                    <span
                      aria-hidden="true"
                      className={`absolute left-1/2 top-[25px] -ml-2.5 h-5 w-5 rounded-full bg-orange-500/30 ${styles.currentPulse}`}
                    />
                  )}
                  <span
                    id={`timelinePuce${experience.company}`}
                    className={`relative z-20 shrink-0 rounded-full ring-4 ring-neutral-100 transition-all duration-300 group-hover:scale-125 motion-reduce:transition-none motion-reduce:group-hover:scale-100 dark:ring-neutral-900 ${
                      isCurrent
                        ? "h-3.5 w-3.5 bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]"
                        : index === 1
                        ? "h-3 w-3 bg-neutral-300 group-hover:bg-red-500 group-hover:ring-red-500/20 dark:bg-neutral-600"
                        : "h-3 w-3 bg-neutral-300 group-hover:bg-neutral-500 dark:bg-neutral-600 dark:group-hover:bg-neutral-300"
                    }`}
                  />
                </div>

                <SpotlightCard
                  className={`min-w-0 flex-1 p-6 md:p-8 ${
                    isCurrent ? styles.currentCard : ""
                  }`}
                  data-timeline-card
                  data-current={isCurrent}
                >
                  <div
                    id={`timelineCardTop${experience.company}`}
                    className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline"
                  >
                    <div id={`timelineCompagnyNameJob${experience.company}`}>
                      <h3
                        id={`timelineCompagny${experience.company}`}
                        className="text-lg font-semibold tracking-tight text-gray-900 dark:text-neutral-50 3xs:text-xl"
                      >
                        {experience.company}
                      </h3>
                      <div
                        id={`timelineJob${experience.company}`}
                        className="text-base font-medium leading-normal text-gray-600 dark:text-gray-300"
                      >
                        {experience.position}
                      </div>
                    </div>
                    <div
                      id={`timelinePeriod${experience.company}`}
                      className={`w-fit max-w-full whitespace-nowrap rounded-full px-3 py-1 text-right text-sm font-medium leading-relaxed text-[#707070] dark:text-neutral-400 ${
                        isCurrent
                          ? "bg-orange-500/10 dark:bg-orange-500/15"
                          : "bg-neutral-100 dark:bg-neutral-700/60"
                      }`}
                    >
                      {experience.period}
                    </div>
                  </div>
                  <div
                    id={`timelineCardBot${experience.company}`}
                    className="mt-3 3xs:mt-0"
                  >
                    <div
                      id={`timelineDescription${experience.company}`}
                      className="text-sm font-normal leading-relaxed text-gray-600 dark:text-gray-400 2xs:text-base"
                    >
                      {experience.description}
                    </div>
                  </div>
                </SpotlightCard>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default Timeline;
