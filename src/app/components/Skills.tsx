import React from "react";
import {
  Code2,
  Figma,
  PenTool,
  Ruler,
  Brush,
  Type,
  Triangle,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faN,
  faDatabase,
  faRightLeft,
  faE,
  faUserAstronaut,
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

function Skills() {
  return (
    <div
      id="skillsContainer"
      className="flex flex-col w-[815px] justify-center items-center"
    >
      <div
        id="SkillsTitleContainer"
        className="w-full text-neutral-700 dark:text-neutral-300 font-bold text-3xl flex flex-row items-center mb-1"
      >
        <Code2 size={32} className="mr-6 text-5xl" />
        <span className="">Skills</span>
      </div>
      <div
        id="skillsContainer"
        className="flex flex-row w-full text-xl text-neutral-400 dark:bg-neutral-500 ml-28 mb-8"
      >
        I&apos;ve got a few tricks up my sleeve when it comes to skills.
      </div>
      <div
        id="SkillsContainer"
        className="w-full  flex flex-row justify-between"
      >
        <div id="designContainer" className="flex flex-col ">
          <div id="designTitle" className="text-xl font-bold  mb-3">
            Design
          </div>
          <div
            id="desigSkillsContainer"
            className="flex flex-col  text-base text-neutral-700 dark:text-neutral-300"
          >
            <div id="figma" className="flex flex-row justify-start mb-1">
              <div
                id="figmaIcon"
                className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
              >
                <Figma size={20} />
              </div>
              <div id="figmaLabel" className="flex flex-row">
                Figma
              </div>
            </div>
            <div id="AdobeXd" className="flex flex-row justify-start mb-1">
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
            <div id="zeplin" className="flex flex-row justify-start mb-1">
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

        <div id="frontContainer" className="flex flex-col">
          <div id="frontTitle" className="text-xl font-bold  mb-3">
            Front-end
          </div>
          <div
            id="frontSkillsContainer"
            className="flex flex-col text-base text-neutral-700 dark:text-neutral-300"
          >
            <div id="react" className="flex flex-row justify-start mb-1">
              <div
                id="reactIcon"
                className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
              >
                <FontAwesomeIcon icon={faReact} />
              </div>
              <div id="reactLabel" className="flex flex-row">
                ReactJS
              </div>
            </div>
            <div id="tailwind" className="flex flex-row justify-start mb-1">
              <div
                id="tailwindIcon"
                className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
              >
                <Brush size={18} />
              </div>
              <div id="tailwindLabel" className="flex flex-row">
                Tailwind
              </div>
            </div>
            <div id="next" className="flex flex-row justify-start mb-1">
              <div
                id="nextIcon"
                className="flex flex-row items-center mr-2 w-6 text-lg justify-center"
              >
                <FontAwesomeIcon icon={faN} />
              </div>
              <div id="nextLabel" className="flex flex-row">
                NextJS
              </div>
            </div>
            <div id="javascript" className="flex flex-row justify-start mb-1">
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
            <div id="css" className="flex flex-row justify-start mb-1">
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
            <div id="next" className="flex flex-row justify-start mb-1">
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

        <div id="backContainer" className="flex flex-col">
          <div id="backTitle" className="text-xl font-bold mb-3">
            Back-end
          </div>
          <div
            id="backSkillsContainer"
            className="flex flex-col text-base text-neutral-700 dark:text-neutral-300"
          >
            <div id="node" className="flex flex-row justify-start mb-1">
              <div
                id="nodeIcon"
                className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
              >
                <FontAwesomeIcon icon={faNodeJs} />
              </div>
              <div id="reactLabel" className="flex flex-row">
                NodeJS
              </div>
            </div>
            <div id="sql" className="flex flex-row justify-start mb-1">
              <div
                id="sqlIcon"
                className="flex flex-row items-center mr-2 w-6 text-lg justify-center"
              >
                <FontAwesomeIcon icon={faDatabase} />
              </div>
              <div id="sqlLabel" className="flex flex-row">
                MySQL
              </div>
            </div>
            <div id="api" className="flex flex-row justify-start mb-1">
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
            <div id="express" className="flex flex-row justify-start mb-1">
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
            <div id="jenkins" className="flex flex-row justify-start mb-1">
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
            <div id="postman" className="flex flex-row justify-start mb-1">
              <div
                id="postmanIcon"
                className="flex flex-row items-center mr-2 w-6 text-md justify-center"
              >
                <FontAwesomeIcon icon={faUserAstronaut} />
              </div>
              <div id="postmanLabel" className="flex flex-row">
                Postman
              </div>
            </div>
          </div>
        </div>

        <div id="otherContainer" className="flex flex-col">
          <div id="otherTitle" className="text-xl font-bold mb-3">
            Other
          </div>
          <div
            id="otherSkillsContainer"
            className="flex flex-col text-base text-neutral-700 dark:text-neutral-300"
          >
            <div id="git" className="flex flex-row justify-start mb-1">
              <div
                id="gitIcon"
                className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
              >
                <FontAwesomeIcon icon={faGithub} />
              </div>
              <div id="gitLabel" className="flex flex-row">
                Git/GitHub
              </div>
            </div>
            <div id="tailwind" className="flex flex-row justify-start mb-1">
              <div
                id="vercelIcon"
                className="flex flex-row items-center mr-2 w-6 text-xl justify-center"
              >
                <Triangle />
              </div>
              <div id="vercelLabel" className="flex flex-row">
                Vercel
              </div>
            </div>
            <div id="agile" className="flex flex-row justify-start mb-1">
              <div
                id="agileIcon"
                className="flex flex-row items-center mr-2 w-6 text-lg justify-center"
              >
                <FontAwesomeIcon icon={faSailboat} />
              </div>
              <div id="agileLabel" className="flex flex-row">
                Agile / Scrum
              </div>
            </div>
            <div id="jira" className="flex flex-row justify-start mb-1">
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
            <div id="product" className="flex flex-row justify-start mb-1">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills;
