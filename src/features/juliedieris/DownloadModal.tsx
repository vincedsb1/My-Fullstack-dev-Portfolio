"use client";

import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowUpRight, Download, KeyRound, Loader2, X } from "lucide-react";

import { AndroidIcon, WindowsIcon } from "./PlatformIcons";
import styles from "@/app/juliedieris/page.module.css";

const EPUB_FILENAME = "Julie_Dieris-Le_Silence_de_la_Nuit.epub";
const PLAY_BOOKS_URL =
  "https://play.google.com/store/apps/details?hl=fr&id=com.google.android.apps.books";
const CALIBRE_WINDOWS_URL = "https://calibre-ebook.com/dist/win64";
const ACCESS_CODE_LENGTH = 6;

function formatAccessCode(value: string) {
  const alphanumeric = value
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase()
    .slice(0, ACCESS_CODE_LENGTH);

  return alphanumeric.length > 3
    ? `${alphanumeric.slice(0, 3)}-${alphanumeric.slice(3)}`
    : alphanumeric;
}

function isAndroidDevice() {
  return /Android/i.test(navigator.userAgent);
}

function isWindowsDevice() {
  return /Windows/i.test(navigator.userAgent);
}

type DownloadState = "idle" | "loading" | "error";
type DialogView = "android" | "windows" | "code" | null;

export default function DownloadModal() {
  const [dialogView, setDialogView] = useState<DialogView>(null);
  const [code, setCode] = useState("");
  const [state, setState] = useState<DownloadState>("idle");
  const [error, setError] = useState("");
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const installRef = useRef<HTMLAnchorElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const isSubmittingRef = useRef(false);

  const closeModal = useCallback((force = false) => {
    if (isSubmittingRef.current && !force) return;
    if (force) isSubmittingRef.current = false;

    setDialogView(null);
    setCode("");
    setError("");
    setState("idle");
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!dialogView) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    if (dialogView === "code") {
      inputRef.current?.focus();
    } else {
      installRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeModal, dialogView]);

  const openDownloadFlow = () => {
    setCode("");
    setError("");
    setState("idle");
    const nextView = isAndroidDevice()
      ? "android"
      : isWindowsDevice()
      ? "windows"
      : "code";
    setDialogView(nextView);
  };

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusableElements?.length) {
      event.preventDefault();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const submitCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    const normalizedCode = formatAccessCode(code);
    if (!normalizedCode) {
      setError("Veuillez saisir votre code d'accès.");
      setState("error");
      return;
    }

    if (!/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(normalizedCode)) {
      setError("Le code doit respecter le format XXX-XXX.");
      setState("error");
      return;
    }

    isSubmittingRef.current = true;
    setState("loading");
    setError("");

    try {
      const response = await fetch("/api/juliedieris/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ code: normalizedCode }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        setError(
          payload?.message ||
            "Le code saisi est incorrect. Vérifiez votre saisie puis réessayez.",
        );
        setState("error");
        return;
      }

      const file = await response.blob();
      const objectUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = EPUB_FILENAME;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);

      closeModal(true);
      setHasDownloaded(true);
    } catch {
      setError(
        "Le téléchargement a échoué. Vérifiez votre connexion puis réessayez.",
      );
      setState("error");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const isOpen = dialogView !== null;

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        className={styles.downloadButton}
        onClick={openDownloadFlow}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={styles.downloadButtonInner}>
          <Download aria-hidden="true" size={24} strokeWidth={1.8} />
          <span>Télécharger le livre</span>
        </span>
      </button>

      {hasDownloaded && (
        <p className={styles.statusMessage} role="status">
          Votre téléchargement a démarré.
        </p>
      )}

      {isOpen && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            ref={dialogRef}
            className={`${styles.modal} ${
              dialogView === "android" || dialogView === "windows"
                ? styles.platformModal
                : ""
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={
              dialogView === "android"
                ? "juliedieris-android-title"
                : dialogView === "windows"
                ? "juliedieris-windows-title"
                : "juliedieris-download-title"
            }
            onKeyDown={handleDialogKeyDown}
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => closeModal()}
              aria-label="Fermer"
            >
              <X aria-hidden="true" size={24} />
            </button>

            {dialogView === "android" ? (
              <>
                <div className={styles.androidPromptIcon} aria-hidden="true">
                  <AndroidIcon className={styles.androidMark} />
                </div>
                <div className={styles.modalHeader}>
                  <p className={styles.modalKicker}>Conseil pour Android</p>
                  <h2
                    id="juliedieris-android-title"
                    className={styles.modalHeading}
                  >
                    Une application pour lire votre ePub
                  </h2>
                  <p className={styles.modalIntro}>
                    Nous vous conseillons Google Play Livres pour ouvrir et lire
                    votre livre après le téléchargement.
                  </p>
                </div>

                <div className={styles.modalActions}>
                  <a
                    ref={installRef}
                    className={styles.modalButton}
                    href={PLAY_BOOKS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AndroidIcon className={styles.androidMark} />
                    Installer Google Play Livres
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </a>
                  <button
                    type="button"
                    className={styles.modalButtonSecondary}
                    onClick={() => setDialogView("code")}
                  >
                    J&apos;ai déjà un lecteur
                  </button>
                </div>
                <p className={styles.modalFootnote}>
                  Vous pourrez aussi choisir un autre lecteur ePub compatible.
                </p>
              </>
            ) : dialogView === "windows" ? (
              <>
                <div className={styles.windowsPromptIcon} aria-hidden="true">
                  <WindowsIcon className={styles.windowsMark} />
                </div>
                <div className={styles.modalHeader}>
                  <p
                    className={`${styles.modalKicker} ${styles.windowsKicker}`}
                  >
                    Conseil pour Windows
                  </p>
                  <h2
                    id="juliedieris-windows-title"
                    className={styles.modalHeading}
                  >
                    Une application pour lire votre ePub
                  </h2>
                  <p className={styles.modalIntro}>
                    Nous vous conseillons Calibre pour ouvrir et lire votre
                    livre après le téléchargement.
                  </p>
                </div>

                <div className={styles.modalActions}>
                  <a
                    ref={installRef}
                    className={styles.modalButton}
                    href={CALIBRE_WINDOWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WindowsIcon className={styles.windowsMark} />
                    Télécharger Calibre
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </a>
                  <button
                    type="button"
                    className={styles.modalButtonSecondary}
                    onClick={() => setDialogView("code")}
                  >
                    J&apos;ai déjà un lecteur
                  </button>
                </div>
                <p className={styles.modalFootnote}>
                  Vous pourrez aussi choisir un autre lecteur ePub compatible.
                </p>
              </>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <h2
                    id="juliedieris-download-title"
                    className={styles.modalHeading}
                  >
                    Code d&apos;accès
                  </h2>
                  <p className={styles.modalIntro}>
                    Entrez le code fourni pour télécharger votre exemplaire de
                    <em> Le Silence de la Nuit</em>.
                  </p>
                </div>

                <form className={styles.modalForm} onSubmit={submitCode}>
                  <label
                    className={styles.srOnly}
                    htmlFor="juliedieris-access-code"
                  >
                    Code d&apos;accès
                  </label>
                  <input
                    ref={inputRef}
                    id="juliedieris-access-code"
                    name="accessCode"
                    className={`${styles.codeInput} ${
                      state === "error" ? styles.codeInputError : ""
                    }`}
                    type="text"
                    value={code}
                    onChange={(event) => {
                      setCode(formatAccessCode(event.target.value));
                      if (state === "error") {
                        setState("idle");
                        setError("");
                      }
                    }}
                    placeholder="XXX-XXX"
                    maxLength={7}
                    pattern="[A-Za-z0-9]{3}-[A-Za-z0-9]{3}"
                    title="Format attendu : XXX-XXX"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    required
                  />

                  {error && (
                    <p className={styles.errorMessage} role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className={styles.modalButton}
                    disabled={state === "loading"}
                  >
                    {state === "loading" ? (
                      <Loader2
                        aria-hidden="true"
                        className="animate-spin"
                        size={20}
                      />
                    ) : (
                      <KeyRound aria-hidden="true" size={20} />
                    )}
                    {state === "loading"
                      ? "Préparation…"
                      : "Déverrouiller et télécharger"}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
