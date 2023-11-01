import React from "react";
import Image from "next/image";
import pp from "../../../public/pp.jpg";

function Header() {
  return (
    <div id="header" className="w-full flex flex-col">
      <div id="headerTop" className="w-full flex flex-row justify-between">
        <div id="headerTextContainer" className="flex flex-col w-3/5">
          <div
            id="headerHi"
            className="flex flex-col text-2xl font-bold text-neutral-600 dark:text-neutral-300"
          >
            Hi there! I’m
          </div>
          <div
            id="headerName"
            className="flex flex-col text-5xl font-bold bg-slate-200 w-96 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400"
          >
            Vincent DESBROSSES
          </div>
          <div
            id="headerJob"
            className="flex flex-col text-2xl text-red-500 font-bold"
          >
            Fullstack developer
          </div>
          <div
            id="headerPresentation"
            className="flex flex-col text-2xl text-neutral-700 dark:text-neutral-300"
          >
            From ideation to completion, my skillset covers the full lifecycle
            of a web project. Let’s talk about your next project.
          </div>
        </div>
        <div
          id="headerPhotoMainContainer"
          className="flex flex-row justify-end items-center w-2/5"
        >
          <div id="headerPhotoContainer" className="w-52">
            <Image
              src={pp}
              alt="Vincent DESBROSSES"
              quality={100}
              className="rounded-full ring-4 ring-red-500 p-2"
            />
          </div>
        </div>
      </div>
      <div id="headerSocialsContainer" className="w-full flex flex-row">
        Header Socials media
      </div>
    </div>
  );
}

export default Header;
