"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext";
import styles from "@/components/layout/SiteHeader.module.css";

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
      className={styles.themeToggle}
    >
      <span aria-hidden="true" className={styles.themeThumb} />
      <Sun aria-hidden="true" size={18} className={styles.themeIcon} />
      <Moon aria-hidden="true" size={18} className={styles.themeIcon} />
    </button>
  );
}
