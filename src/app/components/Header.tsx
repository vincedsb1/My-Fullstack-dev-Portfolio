import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Linkedin,
  Github,
  Twitter,
  Briefcase,
  DownloadCloud,
} from "lucide-react";
import pp from "../../../public/pp.jpg";

function Header() {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("vincedsb@gmail.com");
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Remet isCopied à false après 2 secondes
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div id="header" className="w-[815px] flex flex-col justify-center">
      <div id="headerTop" className="w-full flex flex-row justify-between mb-3">
        <div id="headerTextContainer" className="flex flex-col w-2/3">
          <div
            id="headerHi"
            className="flex flex-col text-2xl font-bold text-neutral-500 dark:text-neutral-400 mb-3"
          >
            Hi there! I’m
          </div>
          <div
            id="headerName"
            className="flex flex-col text-5xl font-bold bg-slate-200 w-96 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 leading-[1.15] mb-3"
          >
            Vincent DESBROSSES
          </div>
          <div
            id="headerJob"
            className="flex flex-col text-2xl text-red-500 font-bold mb-3"
          >
            Fullstack developer
          </div>
          <div
            id="headerPresentation"
            className="flex flex-col text-2xl text-neutral-700 dark:text-neutral-300 leading-tight mb-3"
          >
            From ideation to completion, my skillset covers the full lifecycle
            of a web project. Let’s talk about your next project.
          </div>
        </div>
        <div
          id="headerPhotoMainContainer"
          className="flex flex-row justify-end items-center w-1/3"
        >
          <div id="headerPhotoContainer" className="w-60">
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
        <button
          id="email"
          type="button"
          onClick={handleCopyEmail}
          onKeyPress={handleCopyEmail}
          className="flex justify-center items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl w-28 px-5 py-3 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
        >
          {isCopied ? (
            <span>Copied!</span>
          ) : (
            <>
              <Mail className="mr-2" /> Email
            </>
          )}
        </button>
        <button
          id="linkedIn"
          type="button"
          className="flex justify-center items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
          onClick={() =>
            window.open(
              "https://www.linkedin.com/in/vincent-desbrosses/",
              "_blank",
            )
          }
        >
          <Linkedin className="mr-2 pb-1" /> LinkedIn
        </button>
        <button
          id="github"
          type="button"
          className="flex justify-center items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
          onClick={() => window.open("https://github.com/vincedsb1", "_blank")}
        >
          <Github className="mr-2" /> GitHub
        </button>
        <button
          id="twitter"
          type="button"
          className="flex justify-center items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
          onClick={() => window.open("https://twitter.com/vincedsb", "_blank")}
        >
          <Twitter className="mr-2" /> X
        </button>
        <button
          id="malt"
          type="button"
          className="flex justify-center items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
          onClick={() =>
            window.open(
              "https://www.malt.fr/profile/vincentdesbrosses",
              "_blank",
            )
          }
        >
          <Briefcase className="mr-2" /> Malt
        </button>
        <button
          id="cv"
          type="button"
          className="flex justify-center items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
          onClick={() => {
            const fileName = "CV Vincent DESBROSSES.pdf";
            const link = document.createElement("a");
            link.href = `/${encodeURIComponent(fileName)}`;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <DownloadCloud className="mr-2" /> CV
        </button>
      </div>
    </div>
  );
}

export default Header;
