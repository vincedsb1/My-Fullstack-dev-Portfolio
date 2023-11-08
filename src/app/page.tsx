"use client";

import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import ThemeSwitcher from "./ThemeSwitcher.tsx";
import MenuButton from "./components/MenuButton.tsx";
import Header from "./components/Header.tsx";
import Skills from "./components/Skills.tsx";
import Projects from "./components/Projects.tsx";
import Timeline from "./components/Timeline.tsx";
import Footer from "./components/Footer.tsx";
import "aos/dist/aos.css";

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

  useEffect(() => {
    AOS.init({
      duration: 200,
    });
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
          id="headerContainer"
          className="w-full max-w-5xl flex flex-col items-center mb-16 sm:mb-32"
        >
          <Header />
        </div>
        <div
          id="skillsContainer"
          className="w-full max-w-5xl flex flex-col items-center mb-16 sm:mb-32"
        >
          <Skills />
        </div>
        <div
          id="projectsContainer"
          className="w-full max-w-5xl flex flex-col items-center mb-16 sm:mb-32"
        >
          <Projects />
        </div>
        <div
          id="timelineContainer"
          className="w-full max-w-5xl flex flex-col items-center mb-16 sm:mb-32"
        >
          <Timeline />
        </div>
        <div
          id="footerContainer"
          className="w-full max-w-5xl flex flex-col items-center mb-16 sm:mb-32"
        >
          <Footer />
        </div>
      </div>
    </main>
  );
}
// yo
