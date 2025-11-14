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
        className="w-full flex items-center justify-between py-6 px-0 text-left hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
      >
        <h3 className="text-base 3xs:text-lg font-semibold text-neutral-700 dark:text-neutral-300 flex-1">
          {question}
        </h3>
        <ChevronDown
          size={20}
          className={`ml-4 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          } text-neutral-600 dark:text-neutral-400`}
        />
      </button>
      {isOpen && (
        <div className="pb-6 px-0 text-neutral-600 dark:text-neutral-400 text-base leading-relaxed animate-in fade-in duration-200">
          {answer}
        </div>
      )}
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
