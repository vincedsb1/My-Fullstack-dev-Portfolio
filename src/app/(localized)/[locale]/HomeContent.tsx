"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useRef, useState } from "react";
import LanguageSwitcher from "../../LanguageSwitcher.tsx";
import ThemeSwitcher from "../../ThemeSwitcher.tsx";
import FAQ from "../../components/FAQ.tsx";
import Footer from "../../components/Footer.tsx";
import BlogResource, { type BlogHomeArticle } from "./BlogResource.tsx";
import Header from "../../components/Header.tsx";
import MenuButton from "../../components/MenuButton.tsx";
import Projects3 from "../../components/Projects3.tsx";
import Skills from "../../components/Skills.tsx";
import Timeline from "../../components/Timeline.tsx";

export default function Home({
  blogArticles,
}: {
  blogArticles: BlogHomeArticle[];
}) {
  const blogLocale = blogArticles[0]?.locale ?? "fr";
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
      <div
        id="menuContainer"
        className="relative flex w-full items-center justify-end px-4"
      >
        <div ref={buttonRef} className="relative">
          <MenuButton onMenuClick={toggleMenu} />
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute top-0 right-full z-20 mt-5 mr-5 flex flex-col gap-4"
            >
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          )}
        </div>
      </div>
      <div id="mainContainer" className="w-full flex flex-col max-w-5xl">
        <div
          id="headerContainer"
          className="w-full max-w-5xl flex flex-col items-center mb-16 sm:mb-32"
        >
          <Header blogLocale={blogLocale} />
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
          <Projects3 />
        </div>
        <div
          id="blogContainer"
          className="mb-16 flex w-full max-w-5xl flex-col items-center px-4 sm:mb-32 md:px-6"
        >
          <BlogResource articles={blogArticles} />
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
