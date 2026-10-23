"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Skills.module.css";

const REPULSION_RADIUS = 90;
const MAX_PUSH = 8;

export default function SkillsGrid({ children }: { children: ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const interactive = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const cleanups = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-skill-card]"),
      (card) => {
        const pills = Array.from(
          card.querySelectorAll<HTMLElement>("[data-skill-pill]"),
        );
        let frame = 0;
        let cursorX = 0;
        let cursorY = 0;

        const reset = () => {
          cancelAnimationFrame(frame);
          frame = 0;
          pills.forEach((pill) => {
            pill.style.transform = "translate(0px, 0px)";
          });
        };

        const update = () => {
          frame = 0;
          const rect = card.getBoundingClientRect();
          // Read all bounds before writing transforms to avoid layout thrashing.
          const offsets = pills.map((pill) => {
            const bounds = pill.getBoundingClientRect();
            const dx = bounds.left + bounds.width / 2 - cursorX;
            const dy = bounds.top + bounds.height / 2 - cursorY;
            const distance = Math.hypot(dx, dy);
            // The reference divides by zero at the exact centre of a pill.
            if (distance === 0 || distance >= REPULSION_RADIUS) return [0, 0];
            const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
            return [
              (dx / distance) * force * MAX_PUSH,
              (dy / distance) * force * MAX_PUSH,
            ];
          });

          card.style.setProperty("--mouse-x", `${cursorX - rect.left}px`);
          card.style.setProperty("--mouse-y", `${cursorY - rect.top}px`);
          pills.forEach((pill, index) => {
            const [x, y] = offsets[index];
            pill.style.transform = `translate(${x}px, ${y}px)`;
          });
        };

        const onPointerMove = (event: PointerEvent) => {
          if (!interactive.matches || event.pointerType === "touch") return;
          cursorX = event.clientX;
          cursorY = event.clientY;
          if (!frame) frame = requestAnimationFrame(update);
        };

        card.addEventListener("pointermove", onPointerMove);
        card.addEventListener("pointerleave", reset);
        card.addEventListener("pointercancel", reset);
        interactive.addEventListener("change", reset);

        return () => {
          reset();
          card.removeEventListener("pointermove", onPointerMove);
          card.removeEventListener("pointerleave", reset);
          card.removeEventListener("pointercancel", reset);
          interactive.removeEventListener("change", reset);
        };
      },
    );

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <div id="skillsCardsContainer" ref={gridRef} className={styles.grid}>
      {children}
    </div>
  );
}
