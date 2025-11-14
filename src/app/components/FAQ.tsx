"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import "aos/dist/aos.css";
import AOS from "aos";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <section
      id="faq"
      className="w-[815px] xs:w-full flex flex-col justify-center px-4 lg:px-0 py-16 md:py-32"
    >
      <div
        className="flex flex-col max-w-3xl"
        data-aos="fade-up"
      >
        <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-neutral-100 md:mb-11 md:text-4xl">
          {t("heading")}
        </h2>
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-neutral-200 dark:border-neutral-800"
            >
              <AccordionTrigger className="font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600 dark:text-neutral-400">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQ;
