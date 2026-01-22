"use client";

import React, { useState, useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
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
  const t = useTranslations("header");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("vincedsb@gmail.com");
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 300,
    });
  }, []);

  return (
    <div
      id="header"
      className="w-[815px] xs:w-full flex flex-col justify-center md:p-6"
    >
      <div
        id="headerTop"
        className="w-full flex flex-col-reverse sm:flex-row justify-center sm:justify-between mb-3 px-4 lg:px-0 "
      >
        <div
          id="headerTextContainer"
          className="flex flex-col w-full lg:w-fit sm:w-2/3 "
        >
          <div
            id="headerHi"
            className="flex flex-col text-xl 3xs:text-2xl font-bold text-neutral-500 dark:text-neutral-400 mb-3"
            data-aos="fade-up"
          >
            {t("greeting")}
          </div>
          <h1
            id="headerName"
            className="flex flex-col text-4xl 3xs:text-5xl font-bold bg-slate-200 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 leading-[1.15] mb-3"
            data-aos="fade-up"
          >
            {t("name")}
          </h1>
          <div
            id="headerJob"
            className="flex flex-col text-xl 3xs:text-2xl text-red-500 font-bold mb-3"
            data-aos="fade-up"
          >
            {t("jobTitle")}
          </div>
          <div
            id="headerPresentation"
            className="flex text-xl 3xs:text-2xl text-neutral-700 dark:text-neutral-300 leading-tight mb-3"
            data-aos="fade-up"
          >
            {t("description")}
          </div>
        </div>
        <div
          id="headerPhotoMainContainer"
          className="flex flex-row justify-center sm:justify-end items-center w-full sm:w-1/3"
        >
          <div
            id="headerPhotoContainer"
            className="sm:w-60 w-48 mb-4 sm:mb-0"
            data-aos="fade-up"
          >
            <Image
              src={pp}
              alt="Vincent DESBROSSES"
              quality={80}
              sizes="(max-width: 640px) 192px, 240px"
              className="rounded-full ring-4 ring-red-500 p-2 transition-all duration-300 hover:ring-red-400 dark:hover:ring-red-600"
              priority
            />
          </div>
        </div>
      </div>
      <div
        id="headerSocialsContainer"
        className="w-full flex flex-row flex-wrap px-4 lg:px-0"
        data-aos="fade-up"
      >
        <button
          id="email"
          type="button"
          onClick={handleCopyEmail}
          onKeyPress={handleCopyEmail}
          aria-label="Copy email to clipboard"
          className="flex justify-center h-10 3xs:h-12 items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl w-28 px-5 py-3 mb-4 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
          data-aos="fade-up"
        >
          {isCopied ? (
            <span>{tc("copied")}</span>
          ) : (
            <>
              <Mail className="mr-2" /> {tc("email")}
            </>
          )}
        </button>
        <button
          id="linkedIn"
          type="button"
          className="flex justify-center h-10 3xs:h-12 items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 mb-4 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
          data-aos="fade-up"
          onClick={() =>
            window.open(
              locale === "en"
                ? "https://www.linkedin.com/in/vincent-desbrosses/?locale=en_US"
                : "https://www.linkedin.com/in/vincent-desbrosses/",
              "_blank",
            )
          }
        >
          <Linkedin className="mr-2 pb-1" /> {tc("linkedin")}
        </button>
        <button
          id="cv"
          type="button"
          className="flex justify-center h-10 3xs:h-12 items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 mb-4 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
          data-aos="fade-up"
          onClick={() => {
            const fileName =
              locale === "en"
                ? "Resume_Vincent_DESBROSSES.pdf"
                : "CV Vincent DESBROSSES.pdf";
            const link = document.createElement("a");
            link.href = `/${encodeURIComponent(fileName)}`;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <DownloadCloud className="mr-2" /> {tc("cv")}
        </button>
        <button
          id="github"
          type="button"
          className="flex justify-center h-10 3xs:h-12 items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 mb-4 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
          data-aos="fade-up"
          onClick={() => window.open("https://github.com/vincedsb1", "_blank")}
        >
          <Github className="mr-2" /> {tc("github")}
        </button>
        <button
          id="twitter"
          type="button"
          className="flex justify-center h-10 3xs:h-12 items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 mb-4 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
          data-aos="fade-up"
          onClick={() => window.open("https://twitter.com/vincedsb", "_blank")}
        >
          <Twitter className="mr-2" /> {tc("twitter")}
        </button>
        <button
          id="malt"
          type="button"
          className="flex justify-center h-10 3xs:h-12 items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 mb-4 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          tabIndex={0}
          data-aos="fade-up"
          onClick={() =>
            window.open(
              "https://www.malt.fr/profile/vincentdesbrosses",
              "_blank",
            )
          }
        >
          <Briefcase className="mr-2" /> {tc("malt")}
        </button>
      </div>
    </div>
  );
}

export default Header;
