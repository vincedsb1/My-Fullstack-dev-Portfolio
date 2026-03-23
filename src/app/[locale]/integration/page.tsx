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
  }, []);

  // Injection dynamique du widget Allaw avec logs de contrôle
  useEffect(() => {
    const container = document.getElementById("allaw-container");
    if (!container) return;

    const profession = "avocat";
    const profile = "Vincent_DESBROSSES_ee5";
    
    // Log console pour vérifier les attributs demandés
    console.log(`[Allaw Widget] Tentative de chargement - Profession: ${profession}, Profile: ${profile}`);

    const script = document.createElement("script");
    script.src = `https://develop.allaw.fr/embed-develop.js?profession=${profession}&profile=${profile}`;
    script.async = true;

    // Log réseau/chargement - Succès
    script.onload = () => {
      console.log("[Allaw Widget] Script chargé avec succès.");
    };

    // Log réseau/chargement - Erreur (404, CORS, etc.)
    script.onerror = (e) => {
      console.error("[Allaw Widget] Erreur lors du chargement du script (404, CORS ou réseau) :", e);
    };

    container.appendChild(script);

    return () => {
      if (container.contains(script)) {
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
      <div
        id="mainContainer"
        className="w-full flex flex-col max-w-5xl min-h-screen"
      >
        <div
          id="integrationContainer"
          className="w-full max-w-5xl items-center mb-16 sm:mb-32 min-h-screen"
        >
          <div id="allaw-container" className="w-full min-h-screen">
            {/* Le script est maintenant injecté dynamiquement via useEffect */}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Integration() {
  return <IntegrationClient />;
}
