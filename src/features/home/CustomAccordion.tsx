"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItemComponent({
  question,
  answer,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${question
          .replace(/\s+/g, "-")
          .toLowerCase()}`}
        className="group flex w-full items-center justify-between rounded-lg px-4 py-6 text-left"
      >
        <h3 className="min-w-0 flex-1 text-base font-semibold leading-relaxed tracking-tight text-gray-900 transition-colors group-hover:text-red-600 dark:text-neutral-50 dark:group-hover:text-red-400 3xs:text-lg">
          {question}
        </h3>
        <ChevronDown
          size={20}
          aria-hidden="true"
          className={`ml-4 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          } text-neutral-600 dark:text-neutral-400`}
        />
      </button>
      <div
        id={`faq-panel-${question.replace(/\s+/g, "-").toLowerCase()}`}
        aria-hidden={!isOpen}
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-6 text-base font-normal leading-relaxed text-gray-600 dark:text-gray-400">
          {answer}
        </div>
      </div>
    </div>
  );
}

interface CustomAccordionProps {
  items: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

function CustomAccordion({ items }: CustomAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <AccordionItemComponent
          key={item.id}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}

export default CustomAccordion;
