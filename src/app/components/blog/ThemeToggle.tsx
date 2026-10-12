"use client";

import { Moon, Sun } from "lucide-react";
import { useLocale } from "next-intl";
import { useTheme } from "../../ThemeContext";

export default function ThemeToggle() {
  const locale = useLocale();
  const { resolvedTheme, setTheme } = useTheme();
  const label = locale === "fr" ? "Changer le thème" : "Change theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors hover:border-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-red-400"
      aria-label={label}
      title={label}
    >
      <Sun aria-hidden="true" className="hidden size-4 dark:block" />
      <Moon aria-hidden="true" className="size-4 dark:hidden" />
    </button>
  );
}
