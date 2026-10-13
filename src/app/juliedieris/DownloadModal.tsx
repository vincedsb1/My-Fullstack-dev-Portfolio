"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Download, KeyRound, Loader2, X } from "lucide-react";

import styles from "./page.module.css";

const EPUB_FILENAME = "Julie_Dieris-Le_Silence_de_la_Nuit.epub";
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

type DownloadState = "idle" | "loading" | "error";

export default function DownloadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [state, setState] = useState<DownloadState>("idle");
  const [error, setError] = useState("");
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeModal = useCallback(() => {
    if (state === "loading") return;
    setIsOpen(false);
    setCode("");
    setError("");
    setState("idle");
  }, [state]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeModal, isOpen]);

  const openModal = () => {
    setError("");
    setState("idle");
    setIsOpen(true);
  };

  const submitCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "loading") return;

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
      URL.revokeObjectURL(objectUrl);

      closeModal();
      setHasDownloaded(true);
    } catch {
      setError(
        "Le code saisi est incorrect. Vérifiez votre saisie puis réessayez.",
      );
      setState("error");
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.downloadButton}
        onClick={openModal}
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
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="juliedieris-download-title"
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={closeModal}
              aria-label="Fermer"
            >
              <X aria-hidden="true" size={24} />
            </button>

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
          </section>
        </div>
      )}
    </>
  );
}
