"use client";

/* The base ESLint rule does not distinguish these TypeScript-only API members. */
/* eslint-disable no-unused-vars */

import { Play, VideoOff, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ProjectCaseStudyManifest } from "@/content/projects/types";

type YouTubePlayer = {
  destroy: () => void;
  playVideo: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
};

type YouTubePlayerStateEvent = {
  data: number;
  target: YouTubePlayer;
};

type YouTubeApi = {
  PlayerState: {
    ENDED: number;
  };
  Player: new (
    element: HTMLElement,
    options: {
      width: string;
      height: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: { target: YouTubePlayer }) => void;
        onStateChange: (event: YouTubePlayerStateEvent) => void;
      };
    },
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("YouTube API is only available in a browser."),
    );
  }

  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  const pendingApi = new Promise<YouTubeApi>((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      if (window.YT?.Player) {
        resolve(window.YT);
      } else {
        reject(new Error("YouTube IFrame API did not expose a player."));
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("Unable to load the YouTube API."));
    document.head.appendChild(script);
  });

  youtubeApiPromise = pendingApi.catch((error: unknown) => {
    youtubeApiPromise = null;
    throw error;
  });

  return youtubeApiPromise;
}

function getYouTubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1);
    }
    const embedMatch = parsedUrl.pathname.match(/\/embed\/([^/]+)/);
    return embedMatch?.[1] ?? parsedUrl.searchParams.get("v") ?? undefined;
  } catch {
    return undefined;
  }
}

export default function ProjectVideoSection({
  video,
  title,
  facadeBadge,
  facadeTitle,
  playLabel,
  closeLabel,
  regionLabel,
  unavailable,
}: {
  video: NonNullable<ProjectCaseStudyManifest["video"]>;
  title: string;
  facadeBadge: string;
  facadeTitle: string;
  playLabel: string;
  closeLabel: string;
  regionLabel: string;
  unavailable: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const restoreFocusRef = useRef(false);
  const isOpenRef = useRef(false);
  const isClosingRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const videoId =
    video.provider === "youtube" && video.url
      ? getYouTubeVideoId(video.url)
      : undefined;
  const canPlay = Boolean(video.verified && video.url && videoId);

  const closeVideo = useCallback(() => {
    if (!isOpenRef.current || isClosingRef.current) return;

    isClosingRef.current = true;
    restoreFocusRef.current = true;
    setIsPlayerVisible(false);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const closeDelay = reducedMotion ? 0 : 360;

    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      playerRef.current?.destroy();
      playerRef.current = null;
      isOpenRef.current = false;
      isClosingRef.current = false;
      setIsOpen(false);
      closeTimerRef.current = null;
    }, closeDelay);
  }, []);

  const openVideo = useCallback(() => {
    if (!canPlay || isOpenRef.current) return;

    restoreFocusRef.current = false;
    isOpenRef.current = true;
    isClosingRef.current = false;
    setIsOpen(true);
    setIsPlayerVisible(false);
  }, [canPlay]);

  useLayoutEffect(() => {
    if (isOpen || !restoreFocusRef.current) return;

    restoreFocusRef.current = false;
    playButtonRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => {
      const section = sectionRef.current;
      if (section) {
        window.scrollTo({
          top: section.getBoundingClientRect().top + window.scrollY,
          behavior: "auto",
        });
      }
      setIsPlayerVisible(true);
      closeButtonRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !videoId || !playerHostRef.current) return;

    let cancelled = false;
    const playerHost = playerHostRef.current;

    loadYouTubeApi()
      .then((youtube) => {
        if (cancelled || !playerHost || playerRef.current) return;

        playerRef.current = new youtube.Player(playerHost, {
          width: "100%",
          height: "100%",
          videoId,
          playerVars: {
            autoplay: 1,
            enablejsapi: 1,
            mute: 0,
            playsinline: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target }) => {
              target.unMute();
              target.setVolume(100);
              target.playVideo();
              playerHost.querySelector("iframe")?.setAttribute("title", title);
            },
            onStateChange: ({ data, target }) => {
              if (data === youtube.PlayerState.ENDED) {
                target.setVolume(0);
                closeVideo();
              }
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) closeVideo();
      });

    return () => {
      cancelled = true;
    };
  }, [closeVideo, isOpen, title, videoId]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeVideo();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeVideo, isOpen]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      playerRef.current?.destroy();
    },
    [],
  );

  if (!canPlay) {
    return (
      <section className="border-b border-neutral-200 bg-neutral-50 py-24 dark:border-neutral-900 dark:bg-[#111111] md:py-32">
        <div data-reveal className="mx-auto max-w-6xl px-6">
          <div
            className="flex aspect-video flex-col items-center justify-center gap-4 rounded-[2rem] bg-neutral-950 text-center text-white/70"
            role="img"
            aria-label={unavailable}
          >
            <VideoOff size={24} aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              {title}
            </span>
            <span className="text-sm text-white/50">{unavailable}</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label={regionLabel}
      className={
        isOpen
          ? "relative z-[60] w-full bg-black"
          : "border-b border-neutral-200 bg-neutral-50 py-24 dark:border-neutral-900 dark:bg-[#111111] md:py-32"
      }
    >
      {isOpen ? (
        <div
          className={`relative aspect-video w-screen max-w-none bg-black transition-opacity duration-[360ms] ease-out motion-reduce:transition-none ${
            isPlayerVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div ref={playerHostRef} className="size-full" />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeVideo}
            aria-label={closeLabel}
            className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-neutral-950/80 text-white backdrop-blur transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 sm:right-6 sm:top-6"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div data-reveal className="mx-auto max-w-6xl px-6">
          <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-950 shadow-[0_30px_90px_rgba(23,23,23,0.18)] dark:border-neutral-800 dark:shadow-[0_30px_90px_rgba(0,0,0,0.4)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(239,68,68,0.28),transparent_24%),linear-gradient(135deg,#171717,#050505)] dark:bg-[radial-gradient(circle_at_50%_38%,rgba(239,68,68,0.2),transparent_24%),linear-gradient(135deg,#262626,#050505)]" />
            <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur sm:left-8 sm:top-8">
              {facadeBadge}
            </span>
            <button
              ref={playButtonRef}
              type="button"
              onClick={openVideo}
              aria-label={playLabel}
              data-video-play-trigger="true"
              className="group absolute inset-0 grid place-items-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-400"
            >
              <span className="relative grid size-20 place-items-center rounded-full border border-white/30 bg-white/15 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-md transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105 sm:size-24">
                <span className="pointer-events-none absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <Play
                  className="relative ml-1"
                  fill="currentColor"
                  size={28}
                  aria-hidden="true"
                />
              </span>
            </button>
            <h2 className="absolute bottom-6 left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 text-center text-2xl font-semibold tracking-[-0.04em] text-white sm:bottom-10 sm:text-4xl">
              <span className="inline-block whitespace-nowrap px-3 italic">
                {facadeTitle}
              </span>
            </h2>
          </div>
        </div>
      )}
    </section>
  );
}
