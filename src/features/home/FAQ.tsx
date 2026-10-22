import { HelpCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import CustomAccordion from "./CustomAccordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

async function FAQ() {
  const t = await getTranslations("faq");

  const faqItems: FaqItem[] = [
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
  ];

  const items = faqItems.map((item) => ({
    ...item,
    question: item.question.replace(/ \?/g, "\u00A0?"),
  }));

  return (
    <div
      id="faqGlobalContainer"
      className="flex w-full flex-col items-center justify-center px-4 md:px-6"
    >
      <div
        id="faqTitleTopContainer"
        className="w-full text-neutral-700 dark:text-neutral-300 font-bold text-2xl flex flex-row items-center mb-2"
        data-reveal
      >
        <div id="faqIcon" className="w-12">
          <HelpCircle size={32} className="mr-6" />
        </div>
        <h2 id="faqTitle" className="text-2xl 3xs:text-3xl">
          {t("title").replace(/ \?/g, "\u00A0?")}
        </h2>
      </div>
      <div id="faqTitleBotContainer" className="w-full flex flex-row">
        <div id="faqIconBlank" className="w-12" />
        <div
          id="faqIntroContainer"
          className="flex flex-row text-base 3xs:text-xl text-neutral-400 dark:text-neutral-500 mb-16 leading-tight"
          data-reveal
        >
          {t("intro")}
        </div>
      </div>

      <div id="faqContainer" className="w-full flex flex-col" data-reveal>
        <CustomAccordion items={items} />
      </div>
    </div>
  );
}

export default FAQ;
