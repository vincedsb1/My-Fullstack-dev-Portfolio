"use client";

import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import "aos/dist/aos.css";
import AOS from "aos";

function Projects() {
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
  }, []);
  return (
    <div
      id="projectsContainer"
      className="flex flex-col w-[835px] xs:w-full justify-center items-center pl-4 lg:px-0 3xs:px-10"
    >
      <div
        id="projectsTitleTopContainer"
        className="w-full text-neutral-700 dark:text-neutral-300 font-bold text-2xl flex flex-row items-center mb-2"
        data-aos="fade-up"
      >
        <div id="projectsIcon" className="w-12">
          <FontAwesomeIcon icon={faRocket} className="" />
        </div>
        <div id="projectsTitle" className="text-2xl 3xs:text-3xl">
          Projects
        </div>
      </div>
      <div id="projectsTitleBotContainer" className="w-full flex flex-row pr-4">
        <div id="projectsIconBlank" className="w-12" />
        <div
          id="projectsIntroContainer"
          className="flex flex-row text-base 3xs:text-xl text-neutral-400 dark:text-neutral-500 mb-16 leading-tight"
          data-aos="fade-up"
        >
          I&apos;ve navigated a range of projects from start to finish.
          <br /> Take a look at some of my recent work.
        </div>
      </div>
      <div id="projectsCardsContainer" className="w-full flex flex-wrap">
        <div
          id="project1Container"
          className="w-full lg:w-2/3 h-96 pr-4 3xs:pr-0 md:pr-4 pb-4 transition-all"
          data-aos="fade-up"
        >
          <div
            id="project1Card"
            className="w-full h-full rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 hover:border-opacity-100 border-neutral-400 border-opacity-50 dark:border-neutral-700 flex flex-row overflow-hidden hover:ring ring-neutral-400 dark:ring-neutral-700 transition-all group cursor-pointer"
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
              <div id="project1TextTop" className="h-1/6 sm:h-1/2" />
              <div
                id="project1TextBot"
                className="h-5/6 sm:h-1/2 flex flex-col"
              >
                <div
                  id="project1Title"
                  className="font-bold text-2xl text-neutral-700 dark:text-neutral-300 pl-6 leading-tight mb-2"
                >
                  Is Tesla worth it?
                </div>
                <div
                  id="project1Description"
                  className="text-sm 2xs:text-base text-neutral-500 dark:text-neutral-400 pl-6 leading-tight"
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
                className="w-64 transition-all absolute -bottom-3 group-hover:bottom-0 filter drop-shadow-2xl flex flex-row justify-end"
              >
                <div className="w-48 2xs:w-fit">
                  <Image
                    src="/project1.png"
                    width={615}
                    height={730}
                    alt="Is Tesla Worth It?"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="project2Container"
          className="w-full md:w-1/2 lg:w-1/3 h-96 pr-4 3xs:pr-0 md:pr-4 pb-4 transition-all"
          data-aos="fade-up"
        >
          <div
            id="project2Card"
            className="w-full h-full rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 border-neutral-400 dark:hover:border-opacity-100 hover:border-opacity-100 border-opacity-50 dark:border-neutral-700 flex flex-col overflow-hidden hover:ring ring-neutral-400 dark:ring-neutral-700 transition-all group cursor-pointer"
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
                className="text-sm 2xs:text-base text-neutral-500 dark:text-neutral-400 pl-6 leading-tight"
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
                className="w-64 transition-all absolute -right-3 group-hover:right-0 filter drop-shadow-2xl flex flex-row justify-end"
              >
                <div className="w-56 2xs:w-fit">
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
        </div>

        <div
          id="project3Container"
          className="w-full md:w-1/2 lg:w-1/3 h-96 pr-4 pb-4 transition-all"
          data-aos="fade-up"
        >
          <div
            id="project3Card"
            className="w-full h-full rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 border-neutral-400 dark:hover:border-opacity-100 hover:border-opacity-100 border-opacity-50 dark:border-neutral-700 flex flex-col overflow-hidden hover:ring ring-neutral-400 dark:ring-neutral-700 transition-all group cursor-pointer"
            onClick={() =>
              window.open("https://wilders-game.vercel.app/", "_blank")
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.open("https://wilders-game.vercel.app/", "_blank");
              }
            }}
            role="link"
            tabIndex={0}
          >
            <div
              id="project3Text"
              className="h-1/3 w-full flex flex-col top-0 group-hover:top-2 relative transition-all"
            >
              <div
                id="project3Title"
                className="font-bold text-2xl text-neutral-700 dark:text-neutral-300 pl-6 leading-tight mb-2  w-full pt-8"
              >
                Wilder Game
              </div>
              <div
                id="project3Description"
                className="text-sm 2xs:text-base text-neutral-500 dark:text-neutral-400 pl-6 leading-tight w-full pr-4"
              >
                A timed web quiz app challenging users to match film release
                dates accurately for high scores.
              </div>
            </div>
            <div
              id="project3ImageContainer"
              className="h-2/3 w-full flex justify-center pt-10 transition-all items-end relative"
            >
              <div
                id="project3ImageWrapper"
                className="w-36 transition-all absolute -bottom-4 group-hover:-bottom-2 filter drop-shadow-2xl flex flex-row justify-center"
              >
                <div className="w-32 2xs:w-fit">
                  <Image
                    src="/project3.png"
                    width={615}
                    height={730}
                    alt="Wilder Game"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="project4Container"
          className="w-full lg:w-2/3 rounded-3xl h-96 pr-4 pb-4 transition-all"
          data-aos="fade-up"
        >
          <div
            id="project4Card"
            className="w-full h-full rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 hover:border-opacity-100 border-neutral-400 border-opacity-50 dark:border-neutral-700 flex flex-row overflow-hidden hover:ring ring-neutral-400 dark:ring-neutral-700 transition-all group cursor-pointer"
            onClick={() =>
              window.open("http://5.250.176.153/", "_blank")
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.open("http://5.250.176.153/", "_blank");
              }
            }}
            role="link"
            tabIndex={0}
          >
            <div
              id="project4Text"
              className="w-1/3 h-full flex flex-col left-0 group-hover:left-3 relative transition-all"
            >
              <div
                id="project4TextBot"
                className="h-full flex flex-col justify-center"
              >
                <div
                  id="project4Title"
                  className="font-bold text-2xl text-neutral-700 dark:text-neutral-300 pl-6 leading-tight mb-2"
                >
                  QuickFlow
                </div>
                <div
                  id="project4Description"
                  className="text-sm 2xs:text-base text-neutral-500 dark:text-neutral-400 pl-6 leading-tight"
                >
                  Ideation platform streamlining democratic decision-making.
                </div>
              </div>
            </div>
            <div
              id="project4ImageContainer"
              className="w-2/3 h-full flex justify-center pt-10 transition-all items-center relative "
            >
              <div
                id="project4ImageWrapper"
                className="w-72 transition-all absolute -right-3 group-hover:-right-1 filter drop-shadow-2xl flex flex-row justify-end"
              >
                <div className="w-32 2xs:w-44 3xs:w-fit">
                  <Image
                    src="/project4.png"
                    width={615}
                    height={730}
                    alt="QuickFlow"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
