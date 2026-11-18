"use client";
import { useCallback, useId, useState } from "react";
import { ArrowRight, Compass, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import type { Bundle, Locale } from "./types";
import type AssistantComponent from "./Assistant";
import styles from "./Assistant.module.css";
export default function Trigger({
  locale,
  resourceUrl,
  contentVersion,
}: {
  locale: Locale;
  resourceUrl: string;
  contentVersion: string;
}) {
  const t = useTranslations("careerStrategy"),
    dialogId = useId();
  const [open, setOpen] = useState(false),
    [pending, setPending] = useState(false),
    [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState<{
    Component: typeof AssistantComponent;
    bundle: Bundle;
  } | null>(null);
  const close = useCallback(() => setOpen(false), []);
  async function launch() {
    setOpen(true);
    if (loaded || pending) return;
    setPending(true);
    setFailed(false);
    try {
      const [module, response] = await Promise.all([
        import("./Assistant"),
        fetch(resourceUrl, { credentials: "omit" }),
      ]);
      if (!response.ok) throw new Error("resource");
      const bundle = module.parseResource(
        await response.json(),
        locale,
        contentVersion,
      );
      setLoaded({ Component: module.default, bundle });
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }
  return (
    <div className={styles.entry} data-module="career-strategy-assistant">
      <span className={styles.eyebrow}>
        <Compass size={15} aria-hidden />
        {t("entryEyebrow")}
      </span>
      <h3>{t("entryTitle")}</h3>
      <p>{t("entryDescription")}</p>
      <Button
        className={styles.primary}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={open}
        onClick={launch}
      >
        {t("launch")}
        <ArrowRight size={17} aria-hidden />
      </Button>
      <Dialog
        open={open}
        onClose={close}
        title={t("dialogTitle")}
        closeLabel={t("close")}
        dialogId={dialogId}
        className={styles.dialog}
        closeOnBackdrop={false}
        lockScroll
      >
        {loaded ? (
          <loaded.Component
            bundle={loaded.bundle}
            open={open}
            onClose={close}
          />
        ) : (
          <div className={styles.loading} aria-busy={pending}>
            <Compass size={36} aria-hidden />
            <p role="status">{failed ? t("loadError") : t("loading")}</p>
            {failed && (
              <Button onClick={launch} className={styles.primary}>
                <RotateCw size={16} aria-hidden />
                {t("retry")}
              </Button>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
