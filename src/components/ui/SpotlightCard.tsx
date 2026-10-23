"use client";

import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type PointerEvent,
} from "react";
import styles from "./SpotlightCard.module.css";

export default function SpotlightCard({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"article">) {
  const frameRef = useRef(0);
  const interactiveRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    const interactive = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    interactiveRef.current = interactive;
    const cancel = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
    interactive.addEventListener("change", cancel);
    return () => {
      cancel();
      interactive.removeEventListener("change", cancel);
    };
  }, []);

  const followPointer = (event: PointerEvent<HTMLElement>) => {
    if (!interactiveRef.current?.matches || event.pointerType === "touch")
      return;
    const card = event.currentTarget;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${clientY - rect.top}px`);
      frameRef.current = 0;
    });
  };

  const stopFollowing = () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
  };

  return (
    <article
      {...props}
      className={`${styles.surface} ${className}`}
      onPointerMove={followPointer}
      onPointerLeave={stopFollowing}
      onPointerCancel={stopFollowing}
    />
  );
}
