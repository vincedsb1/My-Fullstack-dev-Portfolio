"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle({
  labels,
}: {
  labels: Record<string, string>;
}) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const current = theme === "system" ? labels.system : labels[theme];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={labels.theme}
      title={`${labels.theme} : ${current}`}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="relative inline-flex min-h-11 w-[4.75rem] items-center justify-between rounded-full border border-border bg-surface-sunken px-2 text-content-muted transition-colors duration-fast hover:border-accent"
    >
      <span
        aria-hidden="true"
        className="absolute left-1 top-1 size-[2.125rem] translate-x-0 rounded-full bg-surface-raised shadow-card transition-transform duration-base motion-reduce:transition-none dark:translate-x-7"
      />
      <Sun aria-hidden="true" size={18} className="relative z-10" />
      <Moon aria-hidden="true" size={18} className="relative z-10" />
    </button>
  );
}
