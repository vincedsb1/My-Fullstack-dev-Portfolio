import React, { useState } from "react";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";
import pp from "../../../public/pp.jpg";

function Footer() {
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

  return (
    <div
      id="footerContainer"
      className="flex flex-col w-[815px] justify-center items-center  "
    >
      <div
        id="footerCard"
        className="w-full h-64 text-neutral-700 dark:text-neutral-300 flex flex-row items-center mb-2 bg-neutral-200 dark:bg-neutral-800 rounded-3xl"
      >
        <div
          id="footerPhotoContainer"
          className="w-56 h-full flex items-center justify-center"
        >
          <div id="footerPhotoContainer" className="w-36">
            <Image
              src={pp}
              alt="Vincent DESBROSSES"
              quality={100}
              className="rounded-full ring-4 ring-red-500 p-2"
            />
          </div>
        </div>
        <div id="footerRightContainer" className="flex flex-col w-[533px]">
          <div
            id="footerTitle"
            className="text-2xl text-neutral-700 dark:text-neutral-300 font-bold mb-3"
          >
            Interested in working together?
          </div>
          <div
            id="footerText"
            className="leading-tight text-neutral-400 dark:text-neutral-500 mb-5"
          >
            I&apos;m deeply passionate about tech and have honed various skills
            to lead development projects end-to-end. Excited to discuss your
            upcoming project; reach out to me!
          </div>
          <div id="footerButtons" className="flex flex-row">
            <div id="footerEmailButton" className="flex flex-row" />
            <div id="footerLinkedInButton" className="flex flex-row">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
