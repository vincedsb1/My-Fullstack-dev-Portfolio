"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, List, Printer } from "lucide-react";
import styles from "./InternationalisationArticle.module.css";

const sections = [
  { id: "accessible", label: "La facilité technique" },
  { id: "complexite", label: "La complexité cachée" },
  { id: "marches", label: "Langues ≠ marchés" },
  { id: "demande", label: "Mesurer la demande" },
  { id: "decision", label: "Prendre une décision" },
];

export function PrintArticle() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={styles.printButton}
      aria-label="Enregistrer l’article en PDF"
    >
      <Printer size={16} aria-hidden="true" />
      <span>PDF</span>
    </button>
  );
}

export function ReadingProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const article = document.getElementById("article-body");
        if (!article || !progressRef.current) return;
        const top = window.scrollY + article.getBoundingClientRect().top - 100;
        const length = Math.max(
          1,
          article.offsetHeight - window.innerHeight + 140,
        );
        const progress = Math.min(
          1,
          Math.max(0, (window.scrollY - top) / length),
        );
        progressRef.current.style.transform = `scaleX(${progress})`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const resizeObserver = new ResizeObserver(update);
    const article = document.getElementById("article-body");
    if (article) resizeObserver.observe(article);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className={styles.progressTrack} aria-hidden="true">
      <div ref={progressRef} className={styles.progressBar} />
    </div>
  );
}

export function ReadingNavigation() {
  const [active, setActive] = useState("");
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = asideRef.current?.closest("#article-top");
    if (!page) return;
    const navigate = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      if (
        mouseEvent.button !== 0 ||
        mouseEvent.metaKey ||
        mouseEvent.ctrlKey ||
        mouseEvent.shiftKey ||
        mouseEvent.altKey
      )
        return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const target = document.getElementById(anchor.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      window.history.pushState(null, "", anchor.hash);
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
      target.focus({ preventScroll: true });
    };
    page.addEventListener("click", navigate);
    return () => page.removeEventListener("click", navigate);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = "";
        for (const section of sections) {
          const node = document.getElementById(section.id);
          if (node && node.getBoundingClientRect().top <= 180)
            current = section.id;
        }
        setActive(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = document.getElementById("article-body");
    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.animate(
            [
              { opacity: 0.4, transform: "translateY(18px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 600, easing: "cubic-bezier(.2,.7,.2,1)" },
          );
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 },
    );
    root
      .querySelectorAll(".blog-editorial-module, h2")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const links = sections.map((section, index) => (
    <li key={section.id}>
      <a
        href={`#${section.id}`}
        aria-current={active === section.id ? "location" : undefined}
        onClick={() => {
          const details = asideRef.current?.querySelector("details");
          if (details) details.open = false;
        }}
      >
        <span>0{index + 1}</span>
        {section.label}
      </a>
    </li>
  ));

  return (
    <aside ref={asideRef} className={styles.readingSidebar}>
      <div className={styles.desktopToc}>
        <p className={styles.sidebarLabel}>Dans cet article</p>
        <nav aria-label="Sommaire de l’article">
          <ol>{links}</ol>
        </nav>
        <div className={styles.sidebarNote}>
          <span>Le point de départ</span>
          <p>
            Prévoir l’international.
            <br />
            <strong>Mesurer sa valeur.</strong>
          </p>
          <a href="https://iconise.fyi/">
            Le projet Iconise <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
      <details className={styles.mobileToc}>
        <summary>
          <List size={17} aria-hidden="true" /> Dans cet article
          <span>5 chapitres</span>
        </summary>
        <nav aria-label="Sommaire mobile de l’article">
          <ol>{links}</ol>
        </nav>
      </details>
    </aside>
  );
}
