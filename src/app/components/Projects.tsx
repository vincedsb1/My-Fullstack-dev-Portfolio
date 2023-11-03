import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

function Projects() {
  return (
    <div
      id="projectsContainer"
      className="flex flex-col w-[835px] justify-center items-center"
    >
      <div
        id="projectsTitleContainer"
        className="w-[815px] text-neutral-700 dark:text-neutral-300 font-bold text-2xl flex flex-row items-center mb-2"
      >
        <FontAwesomeIcon icon={faRocket} className="mr-6" />
        <span className="text-3xl">Projects</span>
      </div>
      <div
        id="projectsIntroContainer"
        className="flex flex-row w-full text-xl text-neutral-400 dark:text-neutral-500 ml-28 mb-16 leading-tight"
      >
        I&apos;ve navigated a range of projects from start to finish.
        <br /> Take a look at some of my recent work.
      </div>
      <div id="projectsCardsContainer" className="w-full flex flex-col ">
        <div
          id="projectsCardsTopContainer"
          className="w-full flex flex-row  mb-4 h-96"
        >
          <div
            id="project1Cards"
            className="w-3/5 mr-4 rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 hover:border-opacity-100 border-neutral-400 border-opacity-50 dark:border-neutral-700 flex flex-row overflow-hidden hover:ring ring-neutral-400 dark:ring-neutral-700 transition-all group cursor-pointer"
            onClick={() =>
              window.open("https://isteslaworthit.vercel.app/", "_blank")
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.open("https://isteslaworthit.vercel.app/", "_blank");
              }
            }}
            role="link"
            tabIndex={0}
          >
            <div
              id="project1Text"
              className="w-1/3 h-full flex flex-col left-0 group-hover:left-3 relative transition-all"
            >
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
            <div
              id="projectImageContainer"
              className="w-2/3 h-full flex justify-center pt-10 transition-all items-end relative"
            >
              <div
                id="project1ImageWrapper"
                className="w-64 transition-all absolute -bottom-3 group-hover:bottom-0 filter drop-shadow-2xl "
              >
                <Image
                  src="/project1.png"
                  width={615}
                  height={730}
                  alt="Is Tesla Worth It?"
                />
              </div>
            </div>
          </div>

          <div
            id="project2Cards"
            className="w-2/5 mr-4 rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 border-neutral-400 dark:hover:border-opacity-100 hover:border-opacity-100 border-opacity-50 dark:border-neutral-700 flex flex-col overflow-hidden hover:ring ring-neutral-400 dark:ring-neutral-700 transition-all group cursor-pointer"
            onClick={() =>
              window.open("https://emmaus-connect-bay.vercel.app/", "_blank")
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.open("https://emmaus-connect-bay.vercel.app/", "_blank");
              }
            }}
            role="link"
            tabIndex={0}
          >
            <div
              id="project2Text"
              className="h-1/3 w-full flex flex-col top-0 group-hover:top-2 relative transition-all"
            >
              <div
                id="project2Title"
                className="font-bold text-2xl text-neutral-700 dark:text-neutral-300 pl-6 leading-tight mb-2  w-1/2 pt-8"
              >
                Emmaüs connect
              </div>
              <div
                id="project2Description"
                className="text-md  text-neutral-500 dark:text-neutral-400 pl-6 leading-tight"
              >
                Platform that catalogs and values reclaimed smartphones for
                resale.
              </div>
            </div>
            <div
              id="project2ImageContainer"
              className="h-2/3 w-full flex justify-center pt-10 transition-all items-end relative"
            >
              <div
                id="project2ImageWrapper"
                className="w-64 transition-all absolute -right-3 group-hover:right-0 filter drop-shadow-2xl "
              >
                <Image
                  src="/project2.png"
                  width={615}
                  height={730}
                  alt="Emmaüs connect"
                />
              </div>
            </div>
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
