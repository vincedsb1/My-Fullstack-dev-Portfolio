"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { locales } from "../../i18n.config.ts";

type Locale = (typeof locales)[number];

function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    if (typeof window !== "undefined") {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    }

    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPathname = segments.join("/");

    router.push(newPathname);
  };

  const handleKeyDown = (e: React.KeyboardEvent, newLocale: Locale) => {
    if (e.key === "Enter" || e.key === " ") {
      handleLanguageChange(newLocale);
    }
  };

  if (!mounted) {
    return null;
  }

  const isEnglish = locale === "en";
  const isFrench = locale === "fr";

  return (
    <div className="bg-neutral-300 w-48 dark:bg-neutral-800 relative px-8 py-6 rounded-2xl flex flex-col bg-opacity-30 dark:bg-opacity-30 backdrop-filter backdrop-blur-xl shadow-lg">
      <div className="flex flex-row items-center mb-4 font-bold text-neutral-700 dark:text-neutral-300">
        <Globe className="mr-2" size={18} />
        Language
      </div>
      <div
        className={`flex flex-row justify-start cursor-pointer mb-2 hover:text-neutral-700 dark:hover:text-neutral-400 ${
          isEnglish ? "font-bold" : ""
        }`}
        onClick={() => handleLanguageChange("en")}
        onKeyDown={(e) => handleKeyDown(e, "en")}
        role="button"
        tabIndex={0}
        aria-label="Select English language"
        aria-current={isEnglish ? "page" : undefined}
      >
        🇬🇧 English
      </div>
      <div
        className={`flex flex-row justify-start cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-400 ${
          isFrench ? "font-bold" : ""
        }`}
        onClick={() => handleLanguageChange("fr")}
        onKeyDown={(e) => handleKeyDown(e, "fr")}
        role="button"
        tabIndex={0}
        aria-label="Select French language"
        aria-current={isFrench ? "page" : undefined}
      >
        🇫🇷 Français
      </div>
    </div>
  );
}

export default LanguageSwitcher;
