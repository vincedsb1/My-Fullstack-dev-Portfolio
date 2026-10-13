import { createHash, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EPUB_PATH = path.join(
  process.cwd(),
  "docs",
  "Julie_Dieris-Le_Silence_de_la_Nuit.epub",
);
const MAX_BODY_BYTES = 4_096;
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1_000;
const ACCESS_CODE_PATTERN = /^[A-Z0-9]{3}-[A-Z0-9]{3}$/;

const attempts = new Map<string, { count: number; resetAt: number }>();

function requestKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();

  attempts.forEach((value, storedKey) => {
    if (value.resetAt <= now) attempts.delete(storedKey);
  });

  const previous = attempts.get(key);
  if (!previous || previous.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }

  previous.count += 1;
  attempts.set(key, previous);

  return {
    limited: previous.count > MAX_ATTEMPTS,
    retryAfter: Math.max(1, Math.ceil((previous.resetAt - now) / 1_000)),
  };
}

function hash(value: string) {
  return createHash("sha256").update(value).digest();
}

function hasValidCode(candidate: string, configuredCode: string) {
  const candidateHash = hash(candidate.trim().toUpperCase());
  const configuredHash = hash(configuredCode.trim().toUpperCase());
  return timingSafeEqual(candidateHash, configuredHash);
}

export async function POST(request: NextRequest) {
  const key = requestKey(request);
  const rateLimit = isRateLimited(key);

  if (rateLimit.limited) {
    return Response.json(
      { message: "Trop de tentatives. Réessayez dans quelques minutes." },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(rateLimit.retryAfter),
        },
      },
    );
  }

  const configuredCode = process.env.JULIEDIERIS_ACCESS_CODE;
  if (!configuredCode) {
    console.error("JULIEDIERIS_ACCESS_CODE is not configured");
    return Response.json(
      { message: "Le téléchargement est momentanément indisponible." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json(
      { message: "Requête invalide." },
      { status: 413, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "Requête invalide." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const candidate =
    typeof body === "object" && body !== null && "code" in body
      ? (body as { code?: unknown }).code
      : undefined;

  if (typeof candidate !== "string" || candidate.length === 0) {
    return Response.json(
      { message: "Veuillez saisir votre code d'accès." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const normalizedCandidate = candidate.trim().toUpperCase();
  if (!ACCESS_CODE_PATTERN.test(normalizedCandidate)) {
    return Response.json(
      { message: "Le code doit respecter le format XXX-XXX." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!hasValidCode(normalizedCandidate, configuredCode)) {
    return Response.json(
      {
        message:
          "Le code saisi est incorrect. Vérifiez votre saisie puis réessayez.",
      },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  let file: Buffer;
  try {
    file = await readFile(EPUB_PATH);
  } catch (error) {
    console.error("Unable to read the Julie Dieris EPUB", error);
    return Response.json(
      { message: "Le téléchargement est momentanément indisponible." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  return new Response(new Uint8Array(file), {
    status: 200,
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition":
        'attachment; filename="Julie_Dieris-Le_Silence_de_la_Nuit.epub"',
      "Content-Length": String(file.byteLength),
      "Content-Type": "application/epub+zip",
      "Content-Security-Policy": "default-src 'none'",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
