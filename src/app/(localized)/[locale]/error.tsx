"use client";

import { useErrorMessages } from "@/components/layout/ErrorMessages";
import { Button, ButtonLink } from "@/components/ui/Button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const messages = useErrorMessages();
  const locale = messages.locale;
  const t = (key: "error" | "retry" | "home") => messages[key];
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-h2 font-bold">{t("error")}</h1>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset}>{t("retry")}</Button>
        <ButtonLink href={`/${locale}`} variant="secondary">
          {t("home")}
        </ButtonLink>
      </div>
    </main>
  );
}
