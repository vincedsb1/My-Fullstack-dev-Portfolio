import { getTranslations } from "next-intl/server";
import { Calendar } from "lucide-react";

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
    <div
      id="timelineContainer"
      className="flex w-full flex-col items-center justify-center px-4 md:px-6"
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

      <div
        id="timelineCardsContainer"
        className="flex w-full flex-col"
        data-reveal
      >
        {experiences &&
          experiences.map((experience) => (
            <div
              key={experience.company}
              id={`timelineCard${experience.company}`}
              className="relative w-full flex flex-col hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 min-h-48 rounded-2xl items-center group"
            >
              <div
                id={`timelineCardTop${experience.company}`}
                className="mb-3 mt-12 flex min-h-10 w-full flex-row"
              >
                <div
                  id={`timelinePuceContainer${experience.company}`}
                  className="mx-4 flex h-10 w-6 shrink-0 items-center justify-center 2xs:mx-6 3xs:mx-10"
                >
                  <div
                    id={`timelinePuce${experience.company}`}
                    className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
                  />
                </div>
                <div
                  id={`timelineCompagnyNameJob${experience.company}`}
                  className="flex min-w-0 flex-grow flex-col justify-center transition-all group-hover:pl-3"
                >
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
                  className="max-w-[40%] flex items-start justify-end break-words pr-4 text-right text-sm font-medium leading-relaxed text-[#707070] transition-all group-hover:pr-2 dark:text-neutral-400 3xs:pr-8 3xs:group-hover:pr-5"
                >
                  {experience.period}
                </div>
              </div>
              <div
                id={`timelineCardBot${experience.company}`}
                className="mt-3 flex min-h-28 w-full flex-row 3xs:mt-0"
              >
                <div
                  id={`timelineLineContainer${experience.company}`}
                  className="mx-4 w-6 shrink-0 2xs:mx-6 3xs:mx-10"
                >
                  {experiences &&
                    experiences.indexOf(experience) <
                      experiences.length - 1 && (
                      <div
                        id={`timelineLine${experience.company}`}
                        className="pointer-events-none absolute bottom-[-3.5rem] left-[26px] top-20 z-10 w-1 bg-neutral-200 dark:bg-neutral-800 2xs:left-[34px] 3xs:left-[50px]"
                      />
                    )}
                </div>
                <div
                  id={`timelineDescription${experience.company}`}
                  className="flex min-w-0 flex-grow flex-col items-start justify-start text-sm font-normal leading-relaxed text-gray-600 transition-all group-hover:pl-3 dark:text-gray-400 2xs:text-base"
                >
                  {experience.description}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Timeline;
