import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimeline } from "@fortawesome/free-solid-svg-icons";

function Timeline() {
  return (
    <div
      id="timelineContainer"
      className="flex flex-col w-[815px] xs:w-full justify-center items-center"
    >
      <div
        id="projectsTitleTopContainer"
        className="w-full text-neutral-700 dark:text-neutral-300 font-bold text-2xl flex flex-row items-center mb-2"
      >
        <div id="timelineIcon" className="w-12">
          <FontAwesomeIcon icon={faTimeline} className="" />
        </div>
        <div id="timelineTitle" className="text-3xl">
          Timeline
        </div>
      </div>
      <div id="projectsTitleBotContainer" className="w-full flex flex-row">
        <div id="timelineIconBlank" className="w-12" />
        <div
          id="projectsIntroContainer"
          className="flex flex-row text-xl text-neutral-400 dark:text-neutral-500 mb-16 leading-tight"
        >
          Take a stroll down my career lane and see where I&apos;ve been!
        </div>
      </div>

      <div
        id="timelineCardsContainer1"
        className="w-[770px] xs:w-full flex flex-col "
      >
        <div
          id="timelineCard1"
          className="w-full flex flex-row hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 h-48  rounded-2xl items-center group"
        >
          <div id="timelineCard1Left" className="w-20 h-full flex flex-col">
            <div id="timelinePuceContainer1" className="flex justify-center">
              <div
                id="timelinePuce1"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 mt-16 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineLineContainer1"
              className="w-full h-full flex justify-center"
            >
              <div
                id="timelineLine1"
                className="w-1 h-[136px] bg-neutral-200 dark:bg-neutral-800 mt-3"
              />
            </div>
          </div>
          <div
            id="timelineCard1Right"
            className="flex flex-col flex-grow left-0 group-hover:ml-3 transition-all w-5/6"
          >
            <div
              id="timelineText1Top"
              className="flex flex-row justify-between mb-3"
            >
              <div id="timelineCompagnyJob1" className="flex flex-col">
                <div
                  id="timelineCompagny1"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-xl"
                >
                  Twenty Soft
                </div>
                <div
                  id="timelineJob1"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-md"
                >
                  Fullstack developper
                </div>
              </div>
              <div
                id="timelinePeriod1"
                className="font-bold text-neutral-500 text-sm dark:text-neutral-300 pt-1 pr-8 group-hover:pr-5 transition-all"
              >
                sept. 2023 → now
              </div>
            </div>
            <div
              id="timelineTextBot1"
              className=" text-neutral-400 dark:text-neutral-500 text-md w-5/6"
            >
              I offer my freelance services as a fullstack JavaScript developer.
            </div>
          </div>
        </div>
      </div>
      <div
        id="timelineCardsContainer2"
        className="w-[770px] xs:w-full flex flex-col "
      >
        <div
          id="timelineCard2"
          className="w-full flex flex-row hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 h-48  rounded-2xl items-center group"
        >
          <div
            id="timelineCard2Left"
            className="w-20 h-full flex flex-col mb-4"
          >
            <div id="timelinePuceContainer2" className="flex justify-center">
              <div
                id="timelinePuce2"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 mt-16 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineLineContainer2"
              className="w-full h-full flex justify-center"
            >
              <div
                id="timelineLine2"
                className="w-1 h-[132px] bg-neutral-200 dark:bg-neutral-800 mt-3"
              />
            </div>
          </div>
          <div
            id="timelineCard2Right"
            className="flex flex-col flex-grow left-0 group-hover:ml-3 transition-all w-5/6"
          >
            <div
              id="timelineText2Top"
              className="flex flex-row justify-between mb-3"
            >
              <div id="timelineCompagnyJob2" className="flex flex-col">
                <div
                  id="timelineCompagny2"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-xl"
                >
                  Jurisoft
                </div>
                <div
                  id="timelineJob2"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-md"
                >
                  Fullstack developper
                </div>
              </div>
              <div
                id="timelinePeriod2"
                className="font-bold text-neutral-500 text-sm dark:text-neutral-300 pt-1 pr-8 group-hover:pr-5 transition-all"
              >
                Jul. 2023 → Sep. 2023
              </div>
            </div>
            <div
              id="timelineTextBot2"
              className=" text-neutral-400 dark:text-neutral-500 text-md w-5/6"
            >
              Focused on elevating the front-end experience for legalconstat.fr
              using a tech stack that included ReactJS, Symfony, and SCSS.
            </div>
          </div>
        </div>
      </div>
      <div
        id="timelineCardsContainer3"
        className="w-[770px] xs:w-full flex flex-col "
      >
        <div
          id="timelineCard3"
          className="w-full flex flex-row hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 h-48  rounded-2xl items-center group"
        >
          <div
            id="timelineCard3Left"
            className="w-20 h-full flex flex-col mb-10"
          >
            <div id="timelinePuceContainer3" className="flex justify-center">
              <div
                id="timelinePuce3"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 mt-16 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineLineContainer3"
              className="w-full h-full flex justify-center"
            >
              <div
                id="timelineLine3"
                className="w-1 h-36 bg-neutral-200 dark:bg-neutral-800 mt-3"
              />
            </div>
          </div>
          <div
            id="timelineCard3Right"
            className="flex flex-col flex-grow left-0 group-hover:ml-3 transition-all w-5/6"
          >
            <div
              id="timelineText3Top"
              className="flex flex-row justify-between mb-3"
            >
              <div id="timelineCompagnyJob3" className="flex flex-col">
                <div
                  id="timelineCompagny3"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-xl"
                >
                  Alpha Web
                </div>
                <div
                  id="timelineJob3"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-md"
                >
                  Product owner
                </div>
              </div>
              <div
                id="timelinePeriod3"
                className="font-bold text-neutral-500 text-sm dark:text-neutral-300 pt-1 pr-8 group-hover:pr-5 transition-all"
              >
                2018 → 2023
              </div>
            </div>
            <div
              id="timelineTextBot3"
              className=" text-neutral-400 dark:text-neutral-500 text-md w-5/6"
            >
              Led the improvement and ongoing maintenance of five web and mobile
              apps, utilizing Scrum techniques. Also responsible for UX/UI
              design, API architecture, and certain Scrum Master functions.
            </div>
          </div>
        </div>
      </div>
      <div
        id="timelineCardsContainer4"
        className="w-[770px] xs:w-full flex flex-col "
      >
        <div
          id="timelineCard4"
          className="w-full flex flex-row hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 h-48  rounded-2xl items-center group"
        >
          <div
            id="timelineCard4Left"
            className="w-20 h-full flex flex-col mb-10"
          >
            <div id="timelinePuceContainer4" className="flex justify-center">
              <div
                id="timelinePuce4"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 mt-16 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineLineContainer4"
              className="w-full h-full flex justify-center"
            >
              <div
                id="timelineLine4"
                className="w-1 h-[156px] bg-neutral-200 dark:bg-neutral-800 mt-3"
              />
            </div>
          </div>
          <div
            id="timelineCard4Right"
            className="flex flex-col flex-grow left-0 group-hover:ml-3 transition-all w-5/6"
          >
            <div
              id="timelineText4Top"
              className="flex flex-row justify-between mb-3"
            >
              <div id="timelineCompagnyJob4" className="flex flex-col">
                <div
                  id="timelineCompagny4"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-xl"
                >
                  Hair Net systems
                </div>
                <div
                  id="timelineJob4"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-md"
                >
                  Customer Support Manager
                </div>
              </div>
              <div
                id="timelinePeriod4"
                className="font-bold text-neutral-500 text-sm dark:text-neutral-300 pt-1 pr-8 group-hover:pr-5 transition-all"
              >
                2014 → 2018
              </div>
            </div>
            <div
              id="timelineTextBot4"
              className=" text-neutral-400 dark:text-neutral-500 text-md w-5/6"
            >
              Led a technical team while collaborating with developers for issue
              resolution. Employed my web development skills, including HTML5
              and CSS, to perform data analysis and drive solutions.
            </div>
          </div>
        </div>
      </div>
      <div
        id="timelineCardsContainer5"
        className="w-[770px] xs:w-full flex flex-col "
      >
        <div
          id="timelineCard5"
          className="w-full flex flex-row hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 h-48  rounded-2xl items-center group"
        >
          <div
            id="timelineCard5Left"
            className="w-20 h-full flex flex-col mb-4"
          >
            <div id="timelinePuceContainer5" className="flex justify-center">
              <div
                id="timelinePuce5"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 mt-16 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineLineContainer5"
              className="w-full h-full flex justify-center"
            >
              <div
                id="timelineLine5"
                className="w-1 h-36 bg-neutral-200 dark:bg-neutral-800 mt-3"
              />
            </div>
          </div>
          <div
            id="timelineCard5Right"
            className="flex flex-col flex-grow left-0 group-hover:ml-3 transition-all w-5/6"
          >
            <div
              id="timelineText5Top"
              className="flex flex-row justify-between mb-3"
            >
              <div id="timelineCompagnyJob5" className="flex flex-col">
                <div
                  id="timelineCompagny5"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-xl"
                >
                  Bolloré Ports
                </div>
                <div
                  id="timelineJob5"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-md"
                >
                  System Administrator
                </div>
              </div>
              <div
                id="timelinePeriod5"
                className="font-bold text-neutral-500 text-sm dark:text-neutral-300 pt-1 pr-8 group-hover:pr-5 transition-all"
              >
                2008 → 2010
              </div>
            </div>
            <div
              id="timelineTextBot5"
              className=" text-neutral-400 dark:text-neutral-500 text-md w-5/6"
            >
              Managed multi-site server environments, working closely with web
              developers to ensure optimized storage and security features.
            </div>
          </div>
        </div>
      </div>
      <div
        id="timelineCardsContainer6"
        className="w-[770px] xs:w-full flex flex-col "
      >
        <div
          id="timelineCard6"
          className="w-full flex flex-row hover:bg-gradient-to-r hover:from-transparent hover:to-neutral-200 dark:hover:to-neutral-800 h-48  rounded-2xl items-center group"
        >
          <div
            id="timelineCard6Left"
            className="w-20 h-full flex flex-col mb-4"
          >
            <div id="timelinePuceContainer6" className="flex justify-center">
              <div
                id="timelinePuce6"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0 mt-16 group-hover:bg-red-500 hover:ring-2 group-hover:ring-neutral-300 dark:group-hover:ring-neutral-400 ring-0 ring-inset group-hover:ring-4 transition-all"
              />
            </div>
            <div
              id="timelineLineContainer6"
              className="w-full h-full flex justify-center"
            >
              <div
                id="timelineLine6"
                className="w-0 h-36 bg-neutral-200 dark:bg-neutral-800 mt-3"
              />
            </div>
          </div>
          <div
            id="timelineCard6Right"
            className="flex flex-col flex-grow left-0 group-hover:ml-3 transition-all w-5/6"
          >
            <div
              id="timelineText6Top"
              className="flex flex-row justify-between mb-3"
            >
              <div id="timelineCompagnyJob6" className="flex flex-col">
                <div
                  id="timelineCompagny6"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-xl"
                >
                  Town Hall of Thorigny
                </div>
                <div
                  id="timelineJob6"
                  className="font-bold text-neutral-700 dark:text-neutral-300 text-md"
                >
                  Fullstack developper
                </div>
              </div>
              <div
                id="timelinePeriod6"
                className="font-bold text-neutral-500 text-sm dark:text-neutral-300 pt-1 pr-8 group-hover:pr-5 transition-all"
              >
                2007 → 2007
              </div>
            </div>
            <div
              id="timelineTextBot6"
              className=" text-neutral-400 dark:text-neutral-500 text-md w-4/5"
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
