"use client";

import React from "react";
import { useTheme } from "./ThemeContext";
import { Sun, Moon, SunMoon } from "lucide-react";
import { useClientMounted } from "./useClientMounted";

function ThemeSwitcher() {
  const mounted = useClientMounted();
  const { theme, setTheme } = useTheme();

  const handleKeyDown = (
    e: React.KeyboardEvent,
    newTheme: "light" | "dark" | "system",
  ) => {
    if (e.key === "Enter") {
      setTheme(newTheme);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-neutral-300 w-48 dark:bg-neutral-800 relative px-8 py-6 rounded-2xl flex flex-col bg-opacity-30 dark:bg-opacity-30 backdrop-filter backdrop-blur-xl shadow-lg">
      <div
        className={`flex flex-row justify-start cursor-pointer mb-2 hover:text-neutral-700 dark:hover:text-neutral-400 ${
          theme === "light" ? "font-bold" : ""
        }`}
        onClick={() => setTheme("light")}
        onKeyDown={(e) => handleKeyDown(e, "light")}
        role="button"
        tabIndex={0}
      >
        <Sun className="mr-4" />
        Light mode
      </div>
      <div
        className={`flex flex-row justify-start cursor-pointer mb-2 hover:text-neutral-700 dark:hover:text-neutral-400 ${
          theme === "dark" ? "font-bold" : ""
        }`}
        onClick={() => setTheme("dark")}
        onKeyDown={(e) => handleKeyDown(e, "dark")}
        role="button"
        tabIndex={0}
      >
        <Moon className="mr-4" />
        Dark mode
      </div>
      <div
        className={`flex flex-row justify-start cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-400  ${
          theme === "system" ? "font-bold" : ""
        }`}
        onClick={() => setTheme("system")}
        onKeyDown={(e) => handleKeyDown(e, "system")}
        role="button"
        tabIndex={0}
      >
        <SunMoon className="mr-4" />
        System
      </div>
    </div>
  );
}

export default ThemeSwitcher;
