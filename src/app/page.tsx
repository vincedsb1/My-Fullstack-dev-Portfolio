"use client";

import React, { useState, useEffect, useRef } from "react";
import ThemeSwitcher from "./ThemeSwitcher.tsx";
import MenuButton from "./components/MenuButton.tsx";

export default function Home() {
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const toggleThemeSwitcher = () => {
    setShowThemeSwitcher(!showThemeSwitcher);
  };

  useEffect(() => {
    // Utilisez simplement MouseEvent ici
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowThemeSwitcher(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="w-full h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center">
      <div className="relative w-full flex justify-end">
        <div ref={buttonRef}>
          <MenuButton onMenuClick={toggleThemeSwitcher} />
        </div>
        {showThemeSwitcher && (
          <div
            ref={menuRef}
            className="absolute top-0 right-full z-20 mt-5 mr-5"
            style={{
              right: buttonRef.current
                ? `${buttonRef.current.offsetWidth}px`
                : "0px",
            }}
          >
            <ThemeSwitcher />
          </div>
        )}
      </div>
      <div id="mainContainer" className="w-full max-w-5xl bg-yellow-300">
        <div
          id="MenuButtonContainer"
          className="w-full bg-sky-400 flex flex-row justify-end"
        />
        Bonjour
      </div>
    </main>
  );
}
