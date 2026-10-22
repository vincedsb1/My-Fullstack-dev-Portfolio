"use client";

import { useTranslations } from "next-intl";
import { CopyButton as Copy } from "@/components/ui/CopyButton";
export default function CopyButton({ code }: { code: string }) {
  const t = useTranslations("common");
  const s = useTranslations("site");
  return (
    <Copy
      value={code}
      label={t("copy")}
      copiedLabel={t("copied")}
      errorLabel={s("copyError")}
    />
  );
}
