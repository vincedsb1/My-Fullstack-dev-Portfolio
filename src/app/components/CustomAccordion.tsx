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
        aria-controls={`faq-panel-${question.replace(/\s+/g, "-").toLowerCase()}`}
        className="w-full flex items-center justify-between py-6 px-4 text-left hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800/50 transition-colors rounded-lg"
      >
        <h3 className="text-base 3xs:text-lg font-semibold text-neutral-700 dark:text-neutral-300 flex-1">
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
        <div className="pb-6 px-4 text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
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
