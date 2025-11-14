"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import "aos/dist/aos.css";
import AOS from "aos";

const projectUrls: Record<string, string> = {
  project1: "https://isteslaworthit.vercel.app/",
  project2: "https://emmaüs-connect.vercel.app/",
  project3: "https://wilder-game.vercel.app/",
  project4: "https://quickflow-app.vercel.app/",
  project5: "https://decor-nature.fr/",
  project6: "https://www.smartflow-app.com/",
};

const projectImages: Record<string, { src: string; alt: string }> = {
  project1: { src: "/project1.png", alt: "Is Tesla worth it?" },
  project2: { src: "/project2.png", alt: "Emmaüs connect" },
  project3: { src: "/project3.png", alt: "Wilder Game" },
  project4: { src: "/project4.png", alt: "QuickFlow" },
  project5: { src: "/project5.png", alt: "Décor Nature" },
  project6: { src: "/project6-2.png", alt: "SmartFlow" },
};

type ProjectLayout = "small" | "wide" | "normal";

const getContainerClass = (layout: ProjectLayout): string => {
  if (layout === "small") {
    return "w-full md:w-1/2 lg:w-1/3 h-96";
  }
  if (layout === "wide") {
    return "w-full md:w-1/2 lg:w-2/3 h-96";
  }
  return "w-full lg:w-2/3 h-96";
};

interface ProjectCardProps {
  projectKey: string;
  name: string;
  description: string;
  url: string;
  imageSrc: string;
  imageAlt: string;
  layout: ProjectLayout;
}

function ProjectCard({
  projectKey,
  name,
  description,
  url,
  imageSrc,
  imageAlt,
  layout,
}: ProjectCardProps) {
  const handleClick = () => window.open(url, "_blank");
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      window.open(url, "_blank");
    }
  };

  const containerClass = getContainerClass(layout);

  if (layout === "small") {
    return (
      <div
        id={`${projectKey}Container`}
        className={`${containerClass} pr-4 pb-4 transition-all`}
        data-aos="fade-up"
      >
        <div
          id={`${projectKey}Card`}
          className="w-full h-full rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 border-neutral-400 dark:hover:border-opacity-100 hover:border-opacity-100 border-opacity-50 dark:border-neutral-700 flex flex-col overflow-hidden hover:ring ring-neutral-400 dark:ring-neutral-700 transition-all group cursor-pointer"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="link"
          tabIndex={0}
        >
          <div
            id={`${projectKey}Text`}
            className="h-1/3 w-full flex flex-col top-0 group-hover:top-2 relative transition-all"
          >
            <div
              id={`${projectKey}Title`}
              className="font-bold text-2xl text-neutral-700 dark:text-neutral-300 pl-6 leading-tight mb-2  w-full pt-8"
            >
              {name}
            </div>
            <div
              id={`${projectKey}Description`}
              className="text-sm 2xs:text-base text-neutral-500 dark:text-neutral-400 pl-6 leading-tight w-full pr-4"
            >
              {description}
            </div>
          </div>
          <div
            id={`${projectKey}ImageContainer`}
            className="h-2/3 w-full flex justify-center pt-10 transition-all items-end relative"
          >
            <div
              id={`${projectKey}ImageWrapper`}
              className="w-56 transition-all absolute -bottom-4 group-hover:-bottom-2 filter drop-shadow-2xl flex flex-row justify-center"
            >
              <div className="w-32 2xs:w-fit">
                <Image src={imageSrc} width={815} height={730} alt={imageAlt} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`${projectKey}Container`}
      className={`${containerClass} 3xs:pr-0 md:pr-4 pb-4 transition-all`}
      data-aos="fade-up"
    >
      <div
        id={`${projectKey}Card`}
        className="w-full h-full rounded-3xl bg-neutral-200 dark:bg-neutral-800 border border-1 hover:border-opacity-100 border-neutral-400 border-opacity-50 dark:border-neutral-700 flex flex-row overflow-hidden hover:ring ring-neutral-400 dark:ring-neutral-700 transition-all group cursor-pointer"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="link"
        tabIndex={0}
      >
        <div
          id={`${projectKey}Text`}
          className="w-1/3 h-full flex flex-col left-0 group-hover:left-3 relative transition-all"
        >
          <div id={`${projectKey}TextBot`} className="h-full flex flex-col">
            <div
              id={`${projectKey}Title`}
              className="font-bold text-2xl text-neutral-700 dark:text-neutral-300 pl-6 leading-tight mb-2"
            >
              {name}
            </div>
            <div
              id={`${projectKey}Description`}
              className="text-sm 2xs:text-base text-neutral-500 dark:text-neutral-400 pl-6 leading-tight"
            >
              {description}
            </div>
          </div>
        </div>
        <div
          id={`${projectKey}ImageContainer`}
          className="w-2/3 h-full flex justify-center pt-10 transition-all items-center relative "
        >
          <div
            id={`${projectKey}ImageWrapper`}
            className="w-56 md:w-76 transition-all absolute md:-right-3 -right-3 lg:-right-0 group-hover:scale-105 md:group-hover:scale-110 md:group-hover:-right-1 filter drop-shadow-2xl flex flex-row justify-end"
          >
            <div className="w-28 2xs:w-44 3xs:w-fit md:w-96 ">
              <Image src={imageSrc} width={800} height={600} alt={imageAlt} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const t = useTranslations("projects");

  const projectOrder = [
    "project5",
    "project6",
    "project1",
    "project2",
    "project3",
    "project4",
  ];
  const layouts: Record<string, ProjectLayout> = {
    project5: "small",
    project6: "wide",
    project1: "normal",
    project2: "normal",
    project3: "normal",
    project4: "normal",
  };

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
          {t("title")}
        </div>
      </div>
      <div id="projectsTitleBotContainer" className="w-full flex flex-row pr-4">
        <div id="projectsIconBlank" className="w-12" />
        <div
          id="projectsIntroContainer"
          className="flex flex-row text-base 3xs:text-xl text-neutral-400 dark:text-neutral-500 mb-16 leading-tight"
          data-aos="fade-up"
        >
          {t("intro")}
        </div>
      </div>
      <div id="projectsCardsContainer" className="w-full flex flex-wrap">
        {projectOrder.map((projectKey) => (
          <ProjectCard
            key={projectKey}
            projectKey={projectKey}
            name={t(`${projectKey}.name`)}
            description={t(`${projectKey}.description`)}
            url={projectUrls[projectKey]}
            imageSrc={projectImages[projectKey].src}
            imageAlt={projectImages[projectKey].alt}
            layout={layouts[projectKey]}
          />
        ))}
      </div>
    </div>
  );
}

export default Projects;
