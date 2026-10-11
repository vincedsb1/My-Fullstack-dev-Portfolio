"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function GuideResource() {
  const t = useTranslations("guideResource");

  return (
    <section
      aria-labelledby="guide-resource-title"
      className="w-full rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800 sm:p-8"
    >
      <div className="max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          {t("eyebrow")}
        </p>
        <h2
          id="guide-resource-title"
          className="mb-3 text-xl font-bold text-neutral-900 dark:text-neutral-50 sm:text-2xl"
        >
          {t("title")}
        </h2>
        <p className="mb-5 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          {t("description")}
        </p>
        <Link
          href="/guide-premier-emploi-developpeur"
          className="inline-flex items-center gap-2 font-semibold text-neutral-900 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-4 dark:text-white dark:hover:text-red-400 dark:focus-visible:ring-offset-neutral-800"
        >
          {t("link")}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}
