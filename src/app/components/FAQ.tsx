"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { HelpCircle } from "lucide-react";
import "aos/dist/aos.css";
import AOS from "aos";
import CustomAccordion from "./CustomAccordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

function FAQ() {
  const t = useTranslations("faq");

  useEffect(() => {
    AOS.init({
      duration: 300,
    });
  }, []);

  const items: FaqItem[] = [
    {
      id: "faq-1",
      question: t("items.0.question"),
      answer: t("items.0.answer"),
    },
    {
      id: "faq-2",
      question: t("items.1.question"),
      answer: t("items.1.answer"),
    },
    {
      id: "faq-3",
      question: t("items.2.question"),
      answer: t("items.2.answer"),
    },
    {
      id: "faq-4",
      question: t("items.3.question"),
      answer: t("items.3.answer"),
    },
    {
      id: "faq-5",
      question: t("items.4.question"),
      answer: t("items.4.answer"),
    },
    {
      id: "faq-6",
      question: t("items.5.question"),
      answer: t("items.5.answer"),
    },
  ];

  return (
    <div
      id="faqGlobalContainer"
      className="flex flex-col w-[815px] xs:w-full justify-center items-center px-4 lg:px-0"
    >
      <div
        id="faqTitleTopContainer"
        className="w-full text-neutral-700 dark:text-neutral-300 font-bold text-2xl flex flex-row items-center mb-2"
        data-aos="fade-up"
      >
        <div id="faqIcon" className="w-12">
          <HelpCircle size={32} className="mr-6" />
        </div>
        <div id="faqTitle" className="text-2xl 3xs:text-3xl">
          {t("title")}
        </div>
      </div>
      <div id="faqTitleBotContainer" className="w-full flex flex-row">
        <div id="faqIconBlank" className="w-12" />
        <div
          id="faqIntroContainer"
          className="flex flex-row text-base 3xs:text-xl text-neutral-400 dark:text-neutral-500 mb-16 leading-tight"
          data-aos="fade-up"
        >
          {t("intro")}
        </div>
      </div>

      <div
        id="faqContainer"
        className="w-full flex flex-col"
        data-aos="fade-up"
      >
        <CustomAccordion items={items} />
      </div>
    </div>
  );
}

export default FAQ;
