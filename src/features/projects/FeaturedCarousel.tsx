"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

const AUTO_PLAY_DURATION = 4000;
export default function FeaturedCarousel({
  children,
  ids,
  names,
  labels,
}: {
  children: ReactNode[];
  ids: string[];
  names: string[];
  labels: Record<string, string>;
}) {
  const [[active, direction], setActive] = useState<[number, 1 | -1]>([0, 1]);
  const [animating, setAnimating] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusing, setFocusing] = useState(false);
  const [visible, setVisible] = useState(true);
  const [onScreen, setOnScreen] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [progress, setProgress] = useState(0);
  const elapsed = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const t = (key: string, values?: Record<string, string>) =>
    Object.entries(values ?? {}).reduce(
      (value, [name, replacement]) =>
        value.replaceAll(`{${name}}`, replacement),
      labels[key] ?? key,
    );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(media.matches);
    const updateVisibility = () =>
      setVisible(document.visibilityState === "visible");
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting),
    );
    if (root.current) observer.observe(root.current);
    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);
  const goTo = useCallback(
    (index: number, nextDirection: 1 | -1) => {
      if (animating || index === active || index < 0 || index >= ids.length)
        return;
      elapsed.current = 0;
      setProgress(0);
      setAnimating(true);
      setActive([index, nextDirection]);
    },
    [active, animating, ids.length],
  );
  const next = useCallback(
    () => goTo((active + 1) % ids.length, 1),
    [active, goTo, ids.length],
  );
  const previous = useCallback(
    () => goTo((active - 1 + ids.length) % ids.length, -1),
    [active, goTo, ids.length],
  );
  useEffect(() => {
    if (!animating) return;
    const timeout = window.setTimeout(
      () => setAnimating(false),
      reduced ? 50 : 650,
    );
    return () => window.clearTimeout(timeout);
  }, [animating, reduced]);
  useEffect(() => {
    if (
      reduced ||
      hovering ||
      focusing ||
      !visible ||
      !onScreen ||
      animating ||
      ids.length < 2
    )
      return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed.current = Math.min(
        AUTO_PLAY_DURATION,
        elapsed.current + now - last,
      );
      last = now;
      setProgress((elapsed.current / AUTO_PLAY_DURATION) * 100);
      if (elapsed.current >= AUTO_PLAY_DURATION) {
        elapsed.current = 0;
        setProgress(0);
        setAnimating(true);
        setActive([(active + 1) % ids.length, 1]);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [
    active,
    animating,
    focusing,
    hovering,
    ids.length,
    onScreen,
    reduced,
    visible,
  ]);
  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let target = index;
    let nextDirection: 1 | -1 = 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      target = (index + 1) % ids.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = (index - 1 + ids.length) % ids.length;
      nextDirection = -1;
    } else if (event.key === "Home") {
      target = 0;
      nextDirection = -1;
    } else if (event.key === "End") target = ids.length - 1;
    else return;
    event.preventDefault();
    goTo(target, nextDirection);
    window.requestAnimationFrame(
      () =>
        document.getElementById(`featured-project-tab-${ids[target]}`)?.focus(),
    );
  }
  if (!ids.length) return null;
  const variants = {
    enter: (d: 1 | -1) => ({
      x: reduced ? 0 : d === 1 ? "100%" : "-100%",
      opacity: reduced ? 1 : 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (d: 1 | -1) => ({
      x: reduced ? 0 : d === 1 ? "-100%" : "100%",
      opacity: reduced ? 1 : 0,
    }),
  };
  return (
    <div
      ref={root}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setHovering(true);
      }}
      onPointerLeave={() => setHovering(false)}
      onFocusCapture={() => setFocusing(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setFocusing(false);
      }}
      className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 md:p-10 lg:p-12"
      role="region"
      aria-label={t("featuredNavigation")}
      aria-roledescription="carousel"
    >
      <div className="relative grid min-h-[39rem] md:min-h-[33rem]">
        <AnimatePresence
          custom={direction}
          initial={false}
          mode="sync"
          onExitComplete={() => setAnimating(false)}
        >
          <motion.div
            key={ids[active]}
            id={`featured-project-panel-${ids[active]}`}
            role="tabpanel"
            aria-labelledby={`featured-project-tab-${ids[active]}`}
            aria-label={names[active]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.4, 0, 0.2, 1] }}
            drag={reduced ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(
              _: MouseEvent | TouchEvent | PointerEvent,
              info: PanInfo,
            ) => {
              if (info.offset.x < -50) next();
              else if (info.offset.x > 50) previous();
            }}
            className="col-start-1 row-start-1 w-full cursor-grab touch-pan-y active:cursor-grabbing"
          >
            {children[active]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={previous}
          aria-label={t("previousProjectAriaLabel")}
          disabled={animating}
          className="inline-flex rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-wait disabled:opacity-40 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <div
          className="flex gap-0"
          role="tablist"
          aria-label={t("featuredNavigation")}
        >
          {ids.map((id, index) => (
            <button
              key={id}
              id={`featured-project-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              aria-label={`${t("goToProjectAriaLabel")} ${names[index]}`}
              onClick={() => goTo(index, index > active ? 1 : -1)}
              onKeyDown={(e) => onKey(e, index)}
              aria-disabled={animating}
              className="group flex size-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 aria-disabled:cursor-wait aria-disabled:opacity-60"
            >
              {active === index ? (
                <span className="relative block size-5">
                  <span
                    role="progressbar"
                    aria-label={t("autoplayProgress")}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                    className={`absolute inset-0 block rounded-full transition-opacity duration-300 ease-out motion-reduce:transition-none [--progress-color:#d4d4d4] [--progress-track:#eeeeee] dark:[--progress-color:#525252] dark:[--progress-track:#707070] ${
                      hovering ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                      background: `conic-gradient(var(--progress-color) 0deg ${
                        progress * 3.6
                      }deg, var(--progress-track) ${progress * 3.6}deg 360deg)`,
                    }}
                  />
                  <span
                    className="pointer-events-none absolute inset-[6px] rounded-full bg-neutral-950 dark:bg-neutral-50"
                    aria-hidden="true"
                  />
                </span>
              ) : (
                <span className="block size-2 rounded-full bg-neutral-300 transition-transform duration-200 group-hover:scale-125 group-focus-visible:scale-125 dark:bg-neutral-600" />
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label={t("nextProjectAriaLabel")}
          disabled={animating}
          className="inline-flex rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-wait disabled:opacity-40 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      <p
        className="sr-only"
        aria-live={reduced || hovering || focusing ? "polite" : "off"}
      >
        {t("currentProject", { name: names[active] })}
      </p>
    </div>
  );
}
