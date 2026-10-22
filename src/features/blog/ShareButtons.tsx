"use client";

import { Button } from "@/components/ui/Button";

import { Check, Copy, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const t = useTranslations("blog");
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
    <Button
      variant="secondary"
      type="button"
      onClick={share}
      aria-label={t(copied ? "copied" : "shareArticle")}
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
      <span>{t(copied ? "copied" : "share")}</span>
    </Button>
  );
}
