"use client";

import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import ThemeSwitcher from "../ThemeSwitcher.tsx";
import LanguageSwitcher from "../LanguageSwitcher.tsx";
import MenuButton from "../components/MenuButton.tsx";
import Header from "../components/Header.tsx";
import Skills from "../components/Skills.tsx";
import Projects from "../components/Projects.tsx";
import Timeline from "../components/Timeline.tsx";
import FAQ from "../components/FAQ.tsx";
import Footer from "../components/Footer.tsx";
import "aos/dist/aos.css";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
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
          <MenuButton onMenuClick={toggleMenu} />
        </div>
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute top-0 right-full z-20 mt-5 mr-5 flex flex-col gap-4"
            style={{
              right: buttonRef.current
                ? `${buttonRef.current.offsetWidth}px`
                : "0px",
            }}
          >
            <ThemeSwitcher />
            <LanguageSwitcher />
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
          id="faqContainer"
          className="w-full max-w-5xl flex flex-col items-center mb-16 sm:mb-32"
        >
          <FAQ />
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
