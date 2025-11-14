"use client";

import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import ThemeSwitcher from "../../ThemeSwitcher.tsx";
import MenuButton from "../../components/MenuButton.tsx";
import "aos/dist/aos.css";

function IntegrationClient() {
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

  useEffect(() => {
    AOS.init({
      duration: 200,
    });

    // Charger le script dynamiquement
    const script = document.createElement("script");
    script.src =
      "https://www.allaw.fr/embed.js?profession=avocat&profile=Vincent_DESBROSSES_ee5";
    script.async = true;
    const container = document.getElementById("allaw-container");
    container?.appendChild(script);

    // Nettoyage du script lors du démontage
    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <main className="w-full bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center">
      <div id="menuContainer" className="relative w-full flex justify-end">
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
      <div id="mainContainer" className="w-full flex flex-col max-w-5xl">
        <div
          id="integrationContainer"
          className="w-full max-w-5xl items-center mb-16 sm:mb-32"
        >
          <div id="allaw-container" className="p-8 rounded-xl" />
        </div>
      </div>
    </main>
  );
}

export default function Integration() {
  return <IntegrationClient />;
}
