import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimeline } from "@fortawesome/free-solid-svg-icons";

function Timeline() {
  return (
    <div
      id="timelineContainer"
      className="flex flex-col w-[815px] justify-center items-center"
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
      <div id="timelineCardsContainer1" className="w-full flex flex-col ">
        <div id="timelineCard1" className="w-full flex flex-row">
          <div id="timelineCard1Left" className="w-36 flex flex-col">
            <div
              id="timelinePuceContainer1"
              className="bg-red-500 flex justify-center"
            >
              <div
                id="timelinePuce1"
                className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0"
              />
            </div>
            <div
              id="timelineLineContainer1"
              className="w-full h-full flex justify-center"
            >
              <div
                id="timelineLine1"
                className="w-1 h-full bg-neutral-200 dark:bg-neutral-800"
              />
            </div>
          </div>
          <div
            id="timelineCardRight"
            className="flex flex-col bg-sky-300 flex-grow "
          >
            <div
              id="timelineTextTop"
              className="flex flex-row bg-yellow-300 justify-between"
            >
              <div id="timelineCompagnyJob" className="flex flex-col">
                <div id="timelineCompagny" className="">
                  Compagny
                </div>
                <div id="timelineJob" className="">
                  Job
                </div>
              </div>
              <div id="timelinePeriod" className="">
                Period
              </div>
            </div>
            <div id="timelineTextBot" className="">
              timelineTextBot
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
