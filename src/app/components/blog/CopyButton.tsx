"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-neutral-300 bg-white/80 px-2.5 text-xs font-medium text-neutral-700 hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:border-neutral-600 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:text-red-400"
      aria-label={copied ? "Code copié" : "Copier le code"}
    >
      {copied ? (
        <Check size={14} aria-hidden="true" />
      ) : (
        <Copy size={14} aria-hidden="true" />
      )}
      {copied ? "Copié" : "Copier"}
    </button>
  );
}
