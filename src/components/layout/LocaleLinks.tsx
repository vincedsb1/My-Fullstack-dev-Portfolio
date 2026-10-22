"use client";

import { usePathname as useActualPathname } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";
export default function LocaleLinks({
  locale,
  articles,
  paths,
  label,
}: {
  locale: Locale;
  paths: Record<Locale, Record<string, string>>;
  label: string;
  articles: { locale: Locale; slug: string; key?: string }[];
}) {
  const actual = useActualPathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  const segments = actual.split("/").filter(Boolean).slice(1);
  const section = segments[0];
  const path =
    section === "projets"
      ? "/projects" +
        (segments[1] === "archives"
          ? "/archive"
          : segments[1]
          ? `/${segments.slice(1).join("/")}`
          : "")
      : "/" + segments.join("/");
  const params = {
    slug:
      (section === "projects" || section === "projets" || section === "blog") &&
      segments[1] !== "archive" &&
      segments[1] !== "archives"
        ? segments[1]
        : undefined,
    variant: segments[2],
  };
  const slug = String(params.slug ?? "");
  const current = articles.find((a) => a.locale === locale && a.slug === slug);
  function href(l: Locale): string {
    const route = params.variant
      ? "/projects/preview/[variant]"
      : params.slug && path.startsWith("/projects/")
      ? "/projects/[slug]"
      : params.slug && path.startsWith("/blog/")
      ? "/blog/[slug]"
      : path;
    switch (route) {
      case "/projects/[slug]":
        return paths[l].project.replace("__slug__", encodeURIComponent(slug));
      case "/projects/preview/[variant]":
        return paths[l].preview.replace(
          "__variant__",
          encodeURIComponent(String(params.variant)),
        );
      case "/blog/[slug]": {
        const target = articles.find(
          (a) =>
            a.locale === l &&
            (l === locale
              ? a.slug === slug
              : current?.key && a.key === current.key),
        );
        return target ? `/${l}/blog/${target.slug}` : paths[l].blog;
      }
      case "/blog":
        return paths[l].blog;
      case "/projects":
      case "/projects/archive":
      case "/preview/ui":
      case "/":
        return paths[l][
          (
            {
              "/projects": "projects",
              "/projects/archive": "archive",
              "/preview/ui": "ui",
              "/": "home",
            } as const
          )[route]
        ];
      default:
        return paths[l].home;
    }
  }
  return (
    <div ref={menuRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${label} : ${locale === "fr" ? "Français" : "English"}`}
        aria-expanded={open}
        aria-controls="locale-menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-control border border-border bg-surface-raised px-3 text-small font-semibold text-content transition-colors hover:border-accent"
      >
        <Globe aria-hidden="true" size={18} />
        <span>{locale.toUpperCase()}</span>
        <ChevronDown
          aria-hidden="true"
          size={16}
          className={`transition-transform duration-fast ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <nav
          id="locale-menu"
          aria-label={label}
          className="absolute right-0 top-full z-[60] mt-2 flex min-w-40 flex-col rounded-card border border-border bg-surface-raised p-2 shadow-overlay"
        >
          {(["fr", "en"] as const).map((l) => (
            <a
              key={l}
              href={href(l)}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "page" : undefined}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-small text-content transition-colors hover:bg-surface-sunken hover:text-accent aria-[current=page]:font-bold"
            >
              {l === "fr" ? "🇫🇷 Français" : "🇬🇧 English"}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
