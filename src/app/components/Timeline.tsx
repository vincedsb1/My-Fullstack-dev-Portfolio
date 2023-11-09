"use client";

import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimeline } from "@fortawesome/free-solid-svg-icons";
import "aos/dist/aos.css";
import AOS from "aos";

function Timeline() {
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
          Timeline
        </div>
      </div>
      <div id="projectsTitleBotContainer" className="w-full flex flex-row">
        <div id="timelineIconBlank" className="w-12" />
        <div
          id="projectsIntroContainer"
          className="flex flex-row text-base 3xs:text-xl text-neutral-400 dark:text-neutral-500 mb-16 leading-tight"
          data-aos="fade-up"
        >
          Take a stroll down my career lane and see where I&apos;ve been!
        </div>
      </div>

      <div
        id="timelineCardsContainer1"
        className="w-[770px] xs:w-full flex flex-col"
        data-aos="fade-up"
      >
        <div
          id="timelineCard1"
          className="w-full flex flex-col hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 min-h-48 rounded-2xl items-center group"
        >
          <div
            id="timelineCard1Top"
            className="w-full h-10 flex flex-row mt-12 mb-3"
          >
            <div
              id="timelinePuceContainer1"
              className="w-6 h-full flex justify-center items-center mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelinePuce1"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineCompagnyNameJob"
              className="h-full flex flex-col flex-grow justify-center font-bold text-neutral-700 dark:text-neutral-300 group-hover:pl-3 transition-all"
            >
              <div
                id="timelineCompagny1"
                className="text-md 3xs:text-xl flex flex-grow justify-start items-center"
              >
                Twenty Soft
              </div>
              <div
                id="timelineJob1"
                className="text-md flex flex-grow items-center"
              >
                Fullstack developper
              </div>
            </div>
            <div
              id="timelinePeriod1"
              className="h-full flex items-start justify-end font-bold text-neutral-500 text-sm dark:text-neutral-300 pr-8 group-hover:pr-5 transition-all"
            >
              Sept. 2023 → now
            </div>
          </div>
          <div
            id="timelineCard1Bot"
            className="w-full h-28 flex flex-row mt-3 3xs:mt-0"
          >
            <div
              id="timelineLineContainer"
              className="h-28 w-6 w-min-28 flex justify-center flex-shrink-0 mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelineLine1"
                className="w-1 h-[182px] 3xs:h-[164px] bg-neutral-200 dark:bg-neutral-800 -mt-6 3xs:-mt-2 z-10"
              />
            </div>
            <div
              id="timelineDesc1f"
              className="text-neutral-400 dark:text-neutral-500 text-xs 2xs:text-sm 3xs:text-base pt-3 2xs:pt-0 flex flex-grow flex-shrink group-hover:pl-3 transition-all"
            >
              I offer my freelance services as a fullstack JavaScript developer.
            </div>
          </div>
        </div>
      </div>
      <div
        id="timelineCardsContainer2"
        className="w-[770px] xs:w-full flex flex-col"
        data-aos="fade-up"
      >
        <div
          id="timelineCard2"
          className="w-full flex flex-col hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 min-h-48 rounded-2xl items-center group"
        >
          <div
            id="timelineCard2Top"
            className="w-full h-10 flex flex-row mt-12 mb-3"
          >
            <div
              id="timelinePuceContainer2"
              className="w-6 h-full flex justify-center items-center mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelinePuce2"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineCompagnyNameJob2"
              className="h-full flex flex-col flex-grow justify-center font-bold text-neutral-700 dark:text-neutral-300 group-hover:pl-3 transition-all"
            >
              <div
                id="timelineCompagny2"
                className="text-md 3xs:text-xl flex flex-grow justify-start items-center"
              >
                Jurisoft
              </div>
              <div
                id="timelineJob2"
                className="text-md flex flex-grow items-center"
              >
                Fullstack developper
              </div>
            </div>
            <div
              id="timelinePeriod2"
              className="h-full flex items-start justify-end font-bold text-neutral-500 text-sm dark:text-neutral-300 pr-8 group-hover:pr-5 transition-all"
            >
              Jul. 2023 → Sep. 2023
            </div>
          </div>
          <div
            id="timelineCard2Bot"
            className="w-full h-28 flex flex-row mt-3 3xs:mt-0"
          >
            <div
              id="timelineLineContainer2"
              className="h-28 w-6 w-min-28 flex justify-center flex-shrink-0 mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelineLine2"
                className="w-1 h-[182px] 3xs:h-[164px] bg-neutral-200 dark:bg-neutral-800 -mt-6 3xs:-mt-2 z-10"
              />
            </div>
            <div
              id="timelineDesc2"
              className="text-neutral-400 dark:text-neutral-500 text-xs 2xs:text-sm 3xs:text-base pt-3 2xs:pt-0 flex flex-grow flex-shrink group-hover:pl-3 transition-all"
            >
              Focused on elevating the front-end experience for legalconstat.fr
              using a tech stack that included ReactJS, Symfony, and SCSS.
            </div>
          </div>
        </div>
      </div>

      <div
        id="timelineCardsContainer3"
        className="w-[770px] xs:w-full flex flex-col"
        data-aos="fade-up"
      >
        <div
          id="timelineCard3"
          className=" w-full flex flex-col hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 min-h-48 rounded-2xl items-center group"
        >
          <div
            id="timelineCard3Top"
            className="w-full h-10 flex flex-row mt-12 mb-3"
          >
            <div
              id="timelinePuceContainer3"
              className="w-6 h-full flex justify-center items-center mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelinePuce3"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineCompagnyNameJob3"
              className="h-full flex flex-col flex-grow justify-center font-bold text-neutral-700 dark:text-neutral-300 group-hover:pl-3 transition-all"
            >
              <div
                id="timelineCompagny3"
                className="text-md 3xs:text-xl flex flex-grow justify-start items-center"
              >
                Alpha Web
              </div>
              <div
                id="timelineJob3"
                className="text-md flex flex-grow items-center"
              >
                Product owner
              </div>
            </div>
            <div
              id="timelinePeriod3"
              className="h-full flex items-start justify-end font-bold text-neutral-500 text-sm dark:text-neutral-300 pr-8 group-hover:pr-5 transition-all"
            >
              2018 → 2023
            </div>
          </div>
          <div
            id="timelineCard3Bot"
            className="w-full h-28 h-28 flex flex-row mt-3 3xs:mt-0"
          >
            <div
              id="timelineLineContainer3"
              className="h-28 w-6 w-min-28 flex justify-center flex-shrink-0 mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelineLine3"
                className="w-1 h-[182px] 3xs:h-[164px] bg-neutral-200 dark:bg-neutral-800 -mt-6 3xs:-mt-2 z-10"
              />
            </div>
            <div
              id="timelineDesc3"
              className=" w-1/3 text-neutral-400 dark:text-neutral-500 text-xs 2xs:text-sm 3xs:text-base pt-3 2xs:pt-0 flex flex-grow flex-shrink pr-10 group-hover:pl-3 transition-all"
            >
              Managed five web/mobile apps using Scrum, focusing on UX/UI design
              and API architecture
            </div>
          </div>
        </div>
      </div>
      <div
        id="timelineCardsContainer4"
        className="w-[770px] xs:w-full flex flex-col"
        data-aos="fade-up"
      >
        <div
          id="timelineCard4"
          className=" w-full flex flex-col hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 min-h-48 rounded-2xl items-center group"
        >
          <div
            id="timelineCard4Top"
            className="w-full h-10 flex flex-row mt-12 mb-3"
          >
            <div
              id="timelinePuceContainer4"
              className="w-6 h-full flex justify-center items-center mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelinePuce4"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineCompagnyNameJob4"
              className="h-full flex flex-col flex-grow justify-center font-bold text-neutral-700 dark:text-neutral-300 group-hover:pl-3 transition-all"
            >
              <div
                id="timelineCompagny4"
                className="text-md 3xs:text-xl flex flex-grow justify-start items-center"
              >
                Hair Net system
              </div>
              <div
                id="timelineJob4"
                className="text-md flex flex-grow items-center"
              >
                Customer Support Manager
              </div>
            </div>
            <div
              id="timelinePeriod4"
              className="h-full flex items-start justify-end font-bold text-neutral-500 text-sm dark:text-neutral-300 pr-8 group-hover:pr-5 transition-all"
            >
              2014 → 2018
            </div>
          </div>
          <div
            id="timelineCard4Bot"
            className="w-full h-28 h-28 flex flex-row mt-3 3xs:mt-0"
          >
            <div
              id="timelineLineContainer4"
              className="h-28 w-6 w-min-28 flex justify-center flex-shrink-0 mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelineLine4"
                className="w-1 h-[182px] 3xs:h-[164px] bg-neutral-200 dark:bg-neutral-800 -mt-6 3xs:-mt-2 z-10"
              />
            </div>
            <div
              id="timelineDesc4"
              className=" w-1/3 text-neutral-400 dark:text-neutral-500 text-xs 2xs:text-sm 3xs:text-base pt-3 2xs:pt-0 flex flex-grow flex-shrink pr-10 group-hover:pl-3 transition-all"
            >
              Guided a tech team, resolving issues with developers, using
              HTML5/CSS for data analysis and solution development.
            </div>
          </div>
        </div>
      </div>

      <div
        id="timelineCardsContainer5"
        className="w-[770px] xs:w-full flex flex-col"
        data-aos="fade-up"
      >
        <div
          id="timelineCard5"
          className=" w-full flex flex-col hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 min-h-48 rounded-2xl items-center group"
        >
          <div
            id="timelineCard5Top"
            className="w-full h-10 flex flex-row mt-12 mb-3"
          >
            <div
              id="timelinePuceContainer5"
              className="w-6 h-full flex justify-center items-center mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelinePuce5"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineCompagnyNameJob5"
              className="h-full flex flex-col flex-grow justify-center font-bold text-neutral-700 dark:text-neutral-300 group-hover:pl-3 transition-all"
            >
              <div
                id="timelineCompagny5"
                className="text-md 3xs:text-xl flex flex-grow justify-start items-center"
              >
                Bolloré Ports
              </div>
              <div
                id="timelineJob5"
                className="text-md flex flex-grow items-center"
              >
                System Administrator
              </div>
            </div>
            <div
              id="timelinePeriod5"
              className="h-full flex items-start justify-end font-bold text-neutral-500 text-sm dark:text-neutral-300 pr-8 group-hover:pr-5 transition-all"
            >
              2008 → 2010
            </div>
          </div>
          <div
            id="timelineCard5Bot"
            className="w-full h-28 h-28 flex flex-row mt-3 3xs:mt-0"
          >
            <div
              id="timelineLineContainer5"
              className="h-28 w-6 w-min-28 flex justify-center flex-shrink-0 mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelineLine5"
                className="w-1 h-[182px] 3xs:h-[164px] bg-neutral-200 dark:bg-neutral-800 -mt-6 3xs:-mt-2 z-10"
              />
            </div>
            <div
              id="timelineDesc5"
              className=" w-1/3 text-neutral-400 dark:text-neutral-500 text-xs 2xs:text-sm 3xs:text-base pt-3 2xs:pt-0 flex flex-grow flex-shrink pr-10 group-hover:pl-3 transition-all"
            >
              Managed multi-site server environments, working closely with web
              developers to ensure optimized storage and security features.
            </div>
          </div>
        </div>
      </div>

      <div
        id="timelineCardsContainer6"
        className="w-[770px] xs:w-full flex flex-col"
        data-aos="fade-up"
      >
        <div
          id="timelineCard6"
          className=" w-full flex flex-col hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 min-h-48 rounded-2xl items-center group"
        >
          <div
            id="timelineCard6Top"
            className="w-full h-10 flex flex-row mt-12 mb-3"
          >
            <div
              id="timelinePuceContainer6"
              className="w-6 h-full flex justify-center items-center mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelinePuce6"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineCompagnyNameJob6"
              className="h-full flex flex-col flex-grow justify-center font-bold text-neutral-700 dark:text-neutral-300 group-hover:pl-3 transition-all"
            >
              <div
                id="timelineCompagny6"
                className="text-md 3xs:text-xl flex flex-grow justify-start items-center"
              >
                Town Hall of Thorigny
              </div>
              <div
                id="timelineJob6"
                className="text-md flex flex-grow items-center"
              >
                Fullstack developper
              </div>
            </div>
            <div
              id="timelinePeriod6"
              className="h-full flex items-start justify-end font-bold text-neutral-500 text-sm dark:text-neutral-300 pr-8 group-hover:pr-5 transition-all"
            >
              2007
            </div>
          </div>
          <div
            id="timelineCard6Bot"
            className="w-full h-28 h-28 flex flex-row mt-3 3xs:mt-0"
          >
            <div
              id="timelineLineContainer6"
              className="h-28 w-6 w-min-28 flex justify-center flex-shrink-0 mx-4 2xs:mx-6 3xs:mx-10"
            >
              <div
                id="timelineLine6"
                className="w-0 h-[0px] bg-neutral-200 dark:bg-neutral-800 -mt-6 3xs:-mt-2 z-10"
              />
            </div>
            <div
              id="timelineDesc6"
              className=" w-1/3 text-neutral-400 dark:text-neutral-500 text-xs 2xs:text-sm 3xs:text-base pt-3 2xs:pt-0 flex flex-grow flex-shrink pr-10 group-hover:pl-3 transition-all"
            >
              Focused on end-to-end web solutions using PHP, MySQL, HTML, CSS,
              and JavaScript for a municipal website project.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
