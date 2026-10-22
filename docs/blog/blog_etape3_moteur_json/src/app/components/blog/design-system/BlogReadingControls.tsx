"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, List, Printer } from "lucide-react";

export type BlogTocItem = { id: string; label: string };

export function BlogReadingProgress({ targetId }: { targetId: string }) {
  const indicator = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = document.getElementById(targetId);
        const line = indicator.current;
        if (!el || !line) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const height = Math.max(1, el.offsetHeight - window.innerHeight * 0.55);
        const value = Math.max(0, Math.min(1, (window.scrollY - top + 110) / height));
        line.style.transform = `scaleX(${value})`;
      });
    };

    window.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("resize", refresh);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : null;
    const element = document.getElementById(targetId);
    if (element && observer) observer.observe(element);
    refresh();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("resize", refresh);
      observer?.disconnect();
    };
  }, [targetId]);

  return <div className="blog-ds__reading-progress" aria-hidden="true"><div ref={indicator} /></div>;
}

export function BlogReadingNavigation({ items, locale = "fr" }: { items: ReadonlyArray<BlogTocItem>; locale?:"fr"|"en" }) {
  const [active, setActive] = useState<string>("");
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const passed = items.filter(({ id }) => {
          const node = document.getElementById(id);
          return node && node.getBoundingClientRect().top <= 200;
        });
        setActive(passed.at(-1)?.id ?? "");
      });
    };
    refresh();
    window.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("resize", refresh);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, [items]);

  const list = (context: "desktop" | "mobile") => (
    <ol className="blog-ds__toc-list">
      {items.map((item, index) => <li key={`${context}-${item.id}`}>
        <a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}
          onClick={() => { if (detailsRef.current) detailsRef.current.open = false; }}>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item.label}
        </a>
      </li>)}
    </ol>
  );

  return <aside className="blog-ds__toc">
    <nav className="blog-ds__toc-desktop" aria-label={locale==="fr"?"Sommaire de la page":"Table of contents"}>
      <p className="blog-ds__toc-label">{locale==="fr"?"Dans cette page":"On this page"}</p>{list("desktop")}
      <p className="blog-ds__toc-note">{locale==="fr"?"Un langage commun pour les articles, sans limiter les composants éditoriaux sur mesure.":"A shared visual language for articles."}</p>
    </nav>
    <details ref={detailsRef} className="blog-ds__toc-mobile">
      <summary><List size={17} aria-hidden="true" /> {locale==="fr"?"Sommaire":"Contents"} <span>{items.length} {locale==="fr"?"sections":"sections"}</span></summary>
      <nav aria-label={locale==="fr"?"Sommaire mobile":"Mobile table of contents"}>{list("mobile")}</nav>
    </details>
  </aside>;
}

export function BlogPrintButton() {
  return <button type="button" className="blog-ds__utility-button" onClick={() => window.print()} aria-label="Imprimer la page ou enregistrer au format PDF">
    <Printer size={16} aria-hidden="true" /> <span>PDF</span>
  </button>;
}

export function BlogBackToTop({ targetId = "blog-article-top" }: { targetId?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return <a className="blog-ds__back-top" href={`#${targetId}`} aria-label="Retour en haut"><ArrowUp size={19} aria-hidden="true" /></a>;
}
