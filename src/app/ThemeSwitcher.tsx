"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      The current theme is: {theme}
      <br />
      <button type="button" onClick={() => setTheme("light")}>
        Light Mode
      </button>
      <br />
      <button type="button" onClick={() => setTheme("dark")}>
        Dark Mode
      </button>
    </div>
  );
}

export default ThemeSwitcher;
