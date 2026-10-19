"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const data = { title, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.assign(
        `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
          data.url,
        )}`,
      );
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label={
        copied
          ? locale === "fr"
            ? "Lien copié"
            : "Link copied"
          : locale === "fr"
          ? "Partager l’article"
          : "Share article"
      }
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-red-400"
      aria-live="polite"
    >
      {copied ? (
        <Check aria-hidden="true" size={16} />
      ) : (
        <>
          <Share2 aria-hidden="true" size={16} className="sm:hidden" />
          <Copy aria-hidden="true" size={16} className="hidden sm:block" />
        </>
      )}
      <span>
        {copied
          ? locale === "fr"
            ? "Lien copié"
            : "Link copied"
          : locale === "fr"
          ? "Partager"
          : "Share"}
      </span>
    </button>
  );
}
