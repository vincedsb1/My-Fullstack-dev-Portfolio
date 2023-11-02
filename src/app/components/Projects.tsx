import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

function Projects() {
  return (
    <div
      id="projectsContainer"
      className="flex flex-col w-[835px] justify-center items-center"
    >
      <div
        id="projectsTitleContainer"
        className="w-full text-neutral-700 dark:text-neutral-300 font-bold text-2xl flex flex-row items-center mb-2"
      >
        <FontAwesomeIcon icon={faRocket} className="mr-6" />
        <span className="text-3xl">Projects</span>
      </div>
      <div
        id="projectsIntroContainer"
        className="flex flex-row w-full text-xl text-neutral-400 dark:text-neutral-500 ml-24 mb-16 leading-none"
      >
        I&apos;ve navigated a range of projects from start to finish. Take a
        look at some of my recent work.
      </div>
      <div id="projectsCardsContainer" className="w-full flex flex-col ">
        <div
          id="projectsCardsTopContainer"
          className="w-full flex flex-row  mb-4 h-96"
        >
          <div
            id="project1Cards"
            className="w-3/5 mr-4 rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 border-neutral-400 border-opacity-50 dark:border-neutral-700 flex flex-row"
          >
            <div id="project1Text" className="w-1/3 h-full flex flex-col">
              <div id="project1TextTop" className="h-1/2" />
              <div id="project1TextBot" className="h-1/2 flex flex-col">
                <div
                  id="project1Title"
                  className="font-bold text-2xl text-neutral-700 dark:text-neutral-300 pl-6 leading-tight mb-2"
                >
                  Is Tesla worth it?
                </div>
                <div
                  id="project1Description"
                  className="text-md  text-neutral-500 dark:text-neutral-400 pl-6 leading-tight"
                >
                  Compare 2 cars and find out which one has a better value over
                  time.
                </div>
              </div>
            </div>
            <div id="project1Image" className="w-2/3 h-full">
              Image
            </div>
          </div>
          <div
            id="project2Cards"
            className="w-2/5 rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 border-neutral-400 border-opacity-50 dark:border-neutral-700"
          >
            Project 2
          </div>
        </div>
        <div
          id="projectsCardsBotContainer"
          className="w-full flex flex-row bg-grey-200 h-96"
        >
          <div
            id="project3Cards"
            className="w-2/5 mr-4 rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 border-neutral-400 border-opacity-50 dark:border-neutral-700"
          >
            Project 3
          </div>
          <div
            id="project1Cards"
            className="w-3/5 rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 border-neutral-400 border-opacity-50 dark:border-neutral-700"
          >
            Project 4
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
