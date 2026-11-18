"use client";
import { useCallback, useId, useState } from "react";
import { ArrowRight, Compass, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import type AssistantComponent from "./Assistant";
import styles from "./Assistant.module.css";
export default function Trigger() {
  const t = useTranslations("careerStrategy"),
    dialogId = useId();
  const [open, setOpen] = useState(false),
    [pending, setPending] = useState(false),
    [failed, setFailed] = useState(false);
  const [Component, setComponent] = useState<typeof AssistantComponent | null>(
    null,
  );
  // The backdrop closes the dialog only once the two questions are behind us.
  const [revealed, setRevealed] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  async function launch() {
    setOpen(true);
    if (Component || pending) return;
    setPending(true);
    setFailed(false);
    try {
      const loaded = await import("./Assistant");
      setComponent(() => loaded.default);
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
        closeOnBackdrop={revealed}
        lockScroll
      >
        {Component ? (
          <Component open={open} onClose={close} onReveal={setRevealed} />
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
