"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Linkedin, Phone, X } from "lucide-react";
import "aos/dist/aos.css";
import AOS from "aos";
import pp from "../../../public/pp.jpg";

function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isPhoneCopied, setIsPhoneCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const phoneNumber = "06 66 14 82 30";

  const handleCopyEmail = async () => {
    if (!navigator.clipboard) {
      console.error("Clipboard API not available");
      return;
    }

    try {
      await navigator.clipboard.writeText("vincedsb@gmail.com");
      setIsEmailCopied(true);
      setTimeout(() => {
        setIsEmailCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleCopyPhone = async () => {
    if (!navigator.clipboard) {
      console.error("Clipboard API not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(phoneNumber);
      setIsPhoneCopied(true);
      setTimeout(() => {
        setIsPhoneCopied(false);
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
    <>
      <div
        id="footerContainer"
        className="flex flex-col w-[815px] xs:w-full justify-center items-center  px-4 lg:px-0"
        data-aos="fade-up"
      >
        <div
          id="footerCard"
          className="w-full sm:h-64 p-8 md:p-0 text-neutral-700 dark:text-neutral-300 flex flex-col sm:flex-row items-center mb-2 bg-neutral-200 dark:bg-neutral-800 rounded-3xl"
        >
          <div
            id="footerPhotoContainer"
            className="w-56 h-full flex items-center justify-center"
          >
            <div
              id="footerPhotoContainer"
              className="w-36 mb-6 sm:mb-0 sm:mr-6 md:mx-8"
            >
              <Image
                src={pp}
                alt="Vincent DESBROSSES"
                quality={100}
                className="rounded-full ring-4 ring-red-500 p-2 transition-all duration-300 hover:ring-red-400 dark:hover:ring-red-600"
              />
            </div>
          </div>
          <div
            id="footerRightContainer"
            className="flex flex-col w-[533px] xs:w-full"
          >
            <div
              id="footerTitle"
              className="text-2xl text-neutral-700 dark:text-neutral-300 font-bold mb-3"
            >
              {t("title")}
            </div>
            <div
              id="footerText"
              className="leading-tight text-neutral-400 dark:text-neutral-500 mb-5"
            >
              {t("description")}
            </div>
            <div
              id="footerButtons"
              className="flex flex-col items-center 2xs:flex-wrap 2xs:flex-row"
            >
              <div id="footerEmailButton" className="flex flex-row">
                <button
                  id="email"
                  type="button"
                  onClick={handleCopyEmail}
                  onKeyPress={handleCopyEmail}
                  className="flex justify-center h-10 3xs:h-12 items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl w-28 px-5 py-3 mb-4 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
                  tabIndex={0}
                >
                  {isEmailCopied ? (
                    <span>{tc("copied")}</span>
                  ) : (
                    <>
                      <Mail className="mr-2" /> {tc("email")}
                    </>
                  )}
                </button>
              </div>
              <div id="footerLinkedInButton" className="flex flex-row">
                <button
                  id="linkedIn"
                  type="button"
                  className="flex justify-center h-10 3xs:h-12 items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 mb-4 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
                  tabIndex={0}
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
              </div>
              <div id="footerPhoneButton" className="flex flex-row">
                <button
                  id="phone"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex justify-center h-10 3xs:h-12 items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 mb-4 text-neutral-100 dark:text-neutral-900 cursor-pointer mr-5 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
                  tabIndex={0}
                >
                  <Phone className="mr-2" /> {tc("phone")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-8 shadow-2xl text-neutral-900 dark:text-neutral-100 w-11/12 max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-lg font-bold mb-4">{tc("phone")}</h3>
            <p className="text-2xl font-mono text-center bg-neutral-200 dark:bg-neutral-700 p-4 rounded-lg select-all">
              {phoneNumber}
            </p>
            <button
              onClick={handleCopyPhone}
              className="w-full mt-6 flex justify-center items-center bg-red-500 rounded-xl px-5 py-3 text-neutral-100 cursor-pointer hover:bg-red-600 transition-all"
            >
              {isPhoneCopied ? tc("copied") : tc("copy", { ns: "common" }) || "Copy"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
