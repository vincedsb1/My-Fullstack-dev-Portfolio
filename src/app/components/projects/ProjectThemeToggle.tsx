"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../ThemeContext";
import { useClientMounted } from "../../useClientMounted";

export default function ProjectThemeToggle({ label }: { label: string }) {
  const mounted = useClientMounted();
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return <span className="size-10" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      className="inline-flex size-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
    >
      {isDark ? (
        <Sun size={19} aria-hidden="true" />
      ) : (
        <Moon size={19} aria-hidden="true" />
      )}
    </button>
  );
}
