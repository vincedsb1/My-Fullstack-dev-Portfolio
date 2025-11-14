"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimeline } from "@fortawesome/free-solid-svg-icons";
import "aos/dist/aos.css";
import AOS from "aos";

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
}

function Timeline() {
  const t = useTranslations("timeline");
  const experiences = t.raw("experiences") as Experience[];

  useEffect(() => {
    AOS.init({
      duration: 300,
    });
  }, []);

  return (
    <div
      id="timelineContainer"
      className="flex flex-col w-[815px] xs:w-full justify-center items-center px-4"
    >
      <div
        id="projectsTitleTopContainer"
        className="w-full text-neutral-700 dark:text-neutral-300 font-bold text-2xl flex flex-row items-center mb-2"
        data-aos="fade-up"
      >
        <div id="timelineIcon" className="w-12">
          <FontAwesomeIcon icon={faTimeline} className="" />
        </div>
        <div id="timelineTitle" className="text-2xl 3xs:text-3xl">
          {t("title")}
        </div>
      </div>
      <div id="projectsTitleBotContainer" className="w-full flex flex-row">
        <div id="timelineIconBlank" className="w-12" />
        <div
          id="projectsIntroContainer"
          className="flex flex-row text-base 3xs:text-xl text-neutral-400 dark:text-neutral-500 mb-16 leading-tight"
          data-aos="fade-up"
        >
          {t("intro")}
        </div>
      </div>

      <div
        id="timelineCardsContainer"
        className="w-[770px] xs:w-full flex flex-col"
        data-aos="fade-up"
      >
        {experiences &&
          experiences.map((experience) => (
            <div
              key={experience.company}
              id={`timelineCard${experience.company}`}
              className="w-full flex flex-col hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 min-h-48 rounded-2xl items-center group"
            >
              <div
                id={`timelineCardTop${experience.company}`}
                className="w-full h-10 flex flex-row mt-12 mb-3"
              >
                <div
                  id={`timelinePuceContainer${experience.company}`}
                  className="w-6 h-full flex justify-center items-center mx-4 2xs:mx-6 3xs:mx-10"
                >
                  <div
                    id={`timelinePuce${experience.company}`}
                    className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
                  />
                </div>
                <div
                  id="timelineCompagnyNameJob"
                  className="h-full flex flex-col flex-grow justify-center font-bold text-neutral-700 dark:text-neutral-300 group-hover:pl-3 transition-all"
                >
                  <div
                    id={`timelineCompagny${experience.company}`}
                    className="text-md 3xs:text-xl flex flex-grow justify-start items-center"
                  >
                    {experience.company}
                  </div>
                  <div
                    id={`timelineJob${experience.company}`}
                    className="text-md flex flex-grow items-center"
                  >
                    {experience.position}
                  </div>
                </div>
                <div
                  id={`timelinePeriod${experience.company}`}
                  className="h-full flex items-start justify-end font-bold text-neutral-500 text-sm dark:text-neutral-300 pr-8 group-hover:pr-5 transition-all"
                >
                  {experience.period}
                </div>
              </div>
              <div
                id={`timelineCardBot${experience.company}`}
                className="w-full h-28 flex flex-row mt-3 3xs:mt-0"
              >
                <div
                  id="timelineLineContainer"
                  className="h-28 w-6 w-min-28 flex justify-center flex-shrink-0 mx-4 2xs:mx-6 3xs:mx-10"
                >
                  {experiences &&
                    experiences.indexOf(experience) <
                      experiences.length - 1 && (
                      <div
                        id={`timelineLine${experience.company}`}
                        className="w-1 h-[182px] 3xs:h-[164px] bg-neutral-200 dark:bg-neutral-800 -mt-6 3xs:-mt-2 z-10"
                      />
                    )}
                </div>
                <div
                  id={`timelineDescription${experience.company}`}
                  className="flex flex-col flex-grow items-start justify-start text-sm 2xs:text-base text-neutral-500 dark:text-neutral-400 leading-tight group-hover:pl-3 transition-all"
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
