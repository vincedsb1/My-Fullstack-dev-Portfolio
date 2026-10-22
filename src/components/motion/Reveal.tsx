"use client";

import { motionTokens } from "@/lib/motion-tokens";
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import styles from "./Reveal.module.css";

/**
 * Apparitions du template : ajouter data-reveal au bloc à animer,
 * et éventuellement data-reveal-delay (en ms) pour une courte cascade.
 * Le contenu reste visible sans JavaScript et en mouvement réduit.
 */
export default function Reveal({
  children,
  className = "",
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const animations = new Map<HTMLElement, Animation>();

    const reveal = (element: HTMLElement, animate = true) => {
      if (element.dataset.reveal !== "pending") return;
      element.dataset.reveal = "visible";
      observer.unobserve(element);

      if (!animate || preference.matches) return;
      // translate laisse les transformations de survol des cartes indépendantes.
      const animation = element.animate(
        [
          { opacity: 0, translate: "0 18px" },
          { opacity: 1, translate: "0 0" },
        ],
        {
          duration: motionTokens.reveal,
          delay: Math.min(
            120,
            Math.max(0, Number(element.dataset.revealDelay) || 0),
          ),
          easing: `cubic-bezier(${motionTokens.ease.join(",")})`,
          fill: "backwards",
        },
      );
      animations.set(element, animation);
      animation.onfinish = () => animations.delete(element);
    };

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        }),
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );

    const showAll = () => {
      elements.forEach((element) => reveal(element, false));
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };

    // Un rechargement au milieu de la page conserve les éléments déjà à l’écran.
    if (!preference.matches) {
      elements.forEach((element) => {
        if (element.getBoundingClientRect().top >= window.innerHeight) {
          element.dataset.reveal = "pending";
          observer.observe(element);
        }
      });
    }

    const onPreferenceChange = () => {
      if (preference.matches) showAll();
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      // La navigation clavier ne doit jamais attendre une apparition.
      elements.forEach((element) => {
        if (element.contains(event.target as Node)) {
          reveal(element, false);
          animations.get(element)?.cancel();
          animations.delete(element);
        }
      });
    };

    preference.addEventListener("change", onPreferenceChange);
    root.addEventListener("focusin", onFocus);
    return () => {
      showAll();
      observer.disconnect();
      preference.removeEventListener("change", onPreferenceChange);
      root.removeEventListener("focusin", onFocus);
    };
  }, [children]);

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`} {...props}>
      {children}
    </div>
  );
}
