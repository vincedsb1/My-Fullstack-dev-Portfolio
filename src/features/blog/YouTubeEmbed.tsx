"use client";

import { SurfaceButton } from "@/components/ui/Button";

import Image from "next/image";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function YouTubeEmbed({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const t = useTranslations("blog");
  const [playing, setPlaying] = useState(false);

  if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) {
    return <p role="note">{t("invalidVideo")}</p>;
  }

  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-neutral-200 bg-black dark:border-neutral-800">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="aspect-video w-full"
        />
      ) : (
        <div className="relative aspect-video">
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 760px"
            loading="lazy"
            unoptimized
            className="absolute inset-0 size-full object-cover opacity-80"
          />
          <SurfaceButton
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 grid place-items-center bg-black/20 text-white    "
            aria-label={t("playVideo", { title })}
          >
            <span className="grid size-16 place-items-center rounded-full bg-red-600 shadow-lg">
              <Play aria-hidden="true" fill="currentColor" size={24} />
            </span>
          </SurfaceButton>
        </div>
      )}
      <figcaption className="sr-only">{title}</figcaption>
      <a
        href={`https://www.youtube.com/watch?v=${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-3 py-2 text-xs text-white underline underline-offset-4    "
      >
        {t("openYouTube")}
      </a>
    </figure>
  );
}
