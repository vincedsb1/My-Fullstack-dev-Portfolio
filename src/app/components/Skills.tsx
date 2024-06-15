"use client";

import React, { useEffect } from "react";
import {
  Code2,
  Figma,
  PenTool,
  Ruler,
  Brush,
  Type,
  Triangle,
  Pyramid,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faN,
  faDatabase,
  faServer,
  faRightLeft,
  faE,
  faSailboat,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import {
  faReact,
  faSquareJs,
  faCss3Alt,
  faNodeJs,
  faJenkins,
  faGithub,
  faJira,
} from "@fortawesome/free-brands-svg-icons";
import "aos/dist/aos.css";
import AOS from "aos";

function Skills() {
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
  }, []);
  return (
    <div
      id="skillsGlobalContainer"
      className="flex flex-col w-[815px] xs:w-full justify-center items-center px-4 lg:px-0"
    >
      <div
        id="skillsTitleTopContainer"
        className="w-full text-neutral-700 dark:text-neutral-300 font-bold text-2xl flex flex-row items-center mb-2"
        data-aos="fade-up"
      >
        <div id="skillsIcon" className="w-12">
          <Code2 size={32} className="mr-6 text-5xl" />
        </div>
        <div id="skillsTitle" className="text-2xl 3xs:text-3xl">
          Skills
        </div>
      </div>
      <div id="skillsTitleBotContainer" className="w-full flex flex-row">
        <div id="skillsIconBlank" className="w-12" />
        <div
          id="skillsIntroContainer"
          className="flex flex-row text-base 3xs:text-xl text-neutral-400 dark:text-neutral-500 mb-16 leading-tight"
          data-aos="fade-up"
        >
          I&apos;ve got a few tricks up my sleeve when it comes to skills.
        </div>
      </div>
      <div
        id="skillsContainer"
        className="w-full flex flex-col md:flex-row justify-center"
      >
        <div
          id="skillsSubContainer1"
          className="flex flex-col 2xs:flex-row items-center 2xs:items-start 2xs:justify-around w-full md:w-1/2"
        >
          <div id="designContainer" className="flex flex-col w-40 mb-8 md:mb-0">
            <div
              id="designTitle"
              className="text-xl font-bold  mb-5 text-neutral-700 dark:text-neutral-300"
              data-aos="fade-up"
            >
              Design
            </div>
            <div
              id="desigSkillsContainer"
              className="flex flex-col  text-base text-neutral-600 dark:text-neutral-400"
            >
              <div
                id="figma"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="figmaIcon"
                  className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
                >
                  <Figma size={20} />
                </div>
                <div
                  id="figmaLabel"
                  className="flex flex-row font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400"
                >
                  Figma
                </div>
              </div>
              <div
                id="AdobeXd"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="AdobeXdIcon"
                  className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
                >
                  <PenTool size={18} />
                </div>
                <div id="AdobeXdLabel" className="flex flex-row">
                  Adobe xD
                </div>
              </div>
              <div
                id="zeplin"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="zeplinIcon"
                  className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
                >
                  <Ruler size={18} />
                </div>
                <div id="zeplinLabel" className="flex flex-row">
                  Zeplin
                </div>
              </div>
            </div>
          </div>

          <div id="frontContainer" className="flex flex-col w-40 mb-8 md:mb-0">
            <div
              id="frontTitle"
              className="text-xl font-bold  mb-5 text-neutral-700 dark:text-neutral-300"
              data-aos="fade-up"
            >
              Front-end
            </div>
            <div
              id="frontSkillsContainer"
              className="flex flex-col text-base text-neutral-600 dark:text-neutral-400"
            >
              <div
                id="next"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="nextIcon"
                  className="flex flex-row items-center mr-2 w-6 text-lg justify-center"
                >
                  <FontAwesomeIcon icon={faN} />
                </div>
                <div
                  id="nextLabel"
                  className="flex flex-row font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400"
                >
                  NextJS
                </div>
              </div>
              <div
                id="react"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="reactIcon"
                  className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
                >
                  <FontAwesomeIcon icon={faReact} />
                </div>
                <div
                  id="reactLabel"
                  className="flex flex-row font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400"
                >
                  ReactJS
                </div>
              </div>
              <div
                id="tailwind"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="tailwindIcon"
                  className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
                >
                  <Brush size={18} />
                </div>
                <div
                  id="tailwindLabel"
                  className="flex flex-row font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400"
                >
                  Tailwind
                </div>
              </div>

              <div
                id="javascript"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="javascriptIcon"
                  className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
                >
                  <FontAwesomeIcon icon={faSquareJs} />
                </div>
                <div id="javascriptLabel" className="flex flex-row">
                  Javascript
                </div>
              </div>
              <div
                id="css"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="cssIcon"
                  className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
                >
                  <FontAwesomeIcon icon={faCss3Alt} />
                </div>
                <div id="cssLabel" className="flex flex-row">
                  CSS / SCSS
                </div>
              </div>
              <div
                id="next"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="nextIcon"
                  className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
                >
                  <Type size={18} />
                </div>
                <div id="nextLabel" className="flex flex-row">
                  Typescript
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="skillsSubContainer2"
          className="flex flex-col 2xs:flex-row items-center 2xs:items-start 2xs:justify-around w-full md:w-1/2"
        >
          <div id="backContainer" className="flex flex-col w-40 mb-8 md:mb-0">
            <div
              id="backTitle"
              className="text-xl font-bold mb-5 text-neutral-700 dark:text-neutral-300"
              data-aos="fade-up"
            >
              Back-end
            </div>
            <div
              id="backSkillsContainer"
              className="flex flex-col text-base text-neutral-600 dark:text-neutral-400"
            >
              <div
                id="node"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="nodeIcon"
                  className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
                >
                  <FontAwesomeIcon icon={faNodeJs} />
                </div>
                <div
                  id="reactLabel"
                  className="flex flex-row font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400"
                >
                  NodeJS
                </div>
              </div>
              <div
                id="postgresql"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="postgresqlIcon"
                  className="flex flex-row items-center mr-2 w-6 text-lg justify-center"
                >
                  <FontAwesomeIcon icon={faServer} />
                </div>
                <div
                  id="postgresqlLabel"
                  className="flex flex-row font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400"
                >
                  PostgreSQL
                </div>
              </div>
              <div
                id="sql"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="sqlIcon"
                  className="flex flex-row items-center mr-2 w-6 text-lg justify-center"
                >
                  <FontAwesomeIcon icon={faDatabase} />
                </div>
                <div
                  id="sqlLabel"
                  className="flex flex-row font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400"
                >
                  MySQL
                </div>
              </div>
              <div
                id="api"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="apiIcon"
                  className="flex flex-row items-center mr-2 w-6 text-md justify-center"
                >
                  <FontAwesomeIcon icon={faRightLeft} />
                </div>
                <div id="apiLabel" className="flex flex-row">
                  RESTful API
                </div>
              </div>
              <div
                id="express"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="expressIcon"
                  className="flex flex-row items-center mr-2 w-6 text-md justify-center"
                >
                  <FontAwesomeIcon icon={faE} />
                </div>
                <div id="expressLabel" className="flex flex-row">
                  ExpressJS
                </div>
              </div>
              <div
                id="prisma"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="prismaIcon"
                  className="flex flex-row items-center mr-2 w-6 text-md justify-center"
                >
                  <Pyramid size={18} />
                </div>
                <div
                  id="prismaLabel"
                  className="flex flex-row font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400"
                >
                  Prisma
                </div>
              </div>
            </div>
          </div>

          <div id="otherContainer" className="flex flex-col w-40 mb-8 md:mb-0">
            <div
              id="otherTitle"
              className="text-xl font-bold mb-5 text-neutral-700 dark:text-neutral-300"
              data-aos="fade-up"
            >
              Other
            </div>
            <div
              id="otherSkillsContainer"
              className="flex flex-col text-base text-neutral-600 dark:text-neutral-400"
            >
              <div
                id="git"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="gitIcon"
                  className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </div>
                <div
                  id="gitLabel"
                  className="flex flex-row font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400"
                >
                  Git/GitHub
                </div>
              </div>
              <div
                id="tailwind"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="vercelIcon"
                  className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
                >
                  <Triangle />
                </div>
                <div
                  id="vercelLabel"
                  className="flex flex-row font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400"
                >
                  Vercel
                </div>
              </div>
              <div
                id="agile"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="agileIcon"
                  className="flex flex-row items-center mr-2 w-6 text-lg justify-center"
                >
                  <FontAwesomeIcon icon={faSailboat} />
                </div>
                <div
                  id="agileLabel"
                  className="flex flex-row font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400"
                >
                  Agile / Scrum
                </div>
              </div>
              <div
                id="jira"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="jiraIcon"
                  className="flex flex-row items-center mr-2 w-6 text-lg justify-center"
                >
                  <FontAwesomeIcon icon={faJira} />
                </div>
                <div id="jiraleLabel" className="flex flex-row">
                  Jira
                </div>
              </div>
              <div
                id="product"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="productIcon"
                  className="flex flex-row items-center mr-2 w-6 text-lg justify-center"
                >
                  <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <div id="productLabel" className="flex flex-row">
                  Product thinking
                </div>
              </div>
              <div
                id="jenkins"
                className="flex flex-row justify-start mb-1"
                data-aos="fade-up"
              >
                <div
                  id="jenkinsIcon"
                  className="flex flex-row items-center mr-2 w-6 text-md justify-center"
                >
                  <FontAwesomeIcon icon={faJenkins} />
                </div>
                <div id="jenkinsLabel" className="flex flex-row">
                  Jenkins
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills;
