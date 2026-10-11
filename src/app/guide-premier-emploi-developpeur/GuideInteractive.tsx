"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

const checklistStorageKey = "vd_guide_checklist_v1";

export default function GuideInteractive({ html }: { html: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const progressBar = document.getElementById("reading-progress");
    const backToTopButton = document.getElementById("back-to-top");
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    const checkboxes = Array.from(
      document.querySelectorAll<HTMLInputElement>(".checkbox-custom"),
    );
    const progressText = document.getElementById("checklist-progress-text");
    const checklistProgressBar = document.getElementById(
      "checklist-progress-bar",
    );
    const copyButtonTimers = new Map<HTMLButtonElement, number>();
    let toastTimer: number | undefined;

    const showToast = (message: string) => {
      if (!toast || !toastMessage) return;

      toastMessage.textContent = message;
      toast.classList.remove("translate-y-20", "opacity-0");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => {
        toast.classList.add("translate-y-20", "opacity-0");
      }, 3000);
    };

    const updateChecklist = () => {
      const checkedCount = checkboxes.filter((checkbox) => checkbox.checked)
        .length;

      checkboxes.forEach((checkbox) => {
        checkbox.closest("label")?.classList.toggle("checked", checkbox.checked);
      });

      if (progressText) {
        progressText.textContent = `${checkedCount}/${checkboxes.length} étapes terminées`;
      }

      if (checklistProgressBar) {
        const progress = checkboxes.length
          ? (checkedCount / checkboxes.length) * 100
          : 0;
        checklistProgressBar.style.width = `${progress}%`;
      }
    };

    try {
      const savedState = JSON.parse(
        window.localStorage.getItem(checklistStorageKey) || "{}",
      ) as Record<string, boolean>;
      checkboxes.forEach((checkbox) => {
        checkbox.checked = Boolean(
          checkbox.dataset.id && savedState[checkbox.dataset.id],
        );
      });
    } catch {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
    updateChecklist();

    const saveChecklist = () => {
      const savedState = Object.fromEntries(
        checkboxes
          .filter((checkbox) => checkbox.checked && checkbox.dataset.id)
          .map((checkbox) => [checkbox.dataset.id as string, true]),
      );

      try {
        window.localStorage.setItem(
          checklistStorageKey,
          JSON.stringify(savedState),
        );
      } catch {
        showToast("La progression n'a pas pu être enregistrée");
      }
      updateChecklist();
    };

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", saveChecklist);
    });

    const updateScrollState = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

      if (progressBar) {
        progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
      }

      backToTopButton?.classList.toggle("opacity-0", window.scrollY <= 500);
      backToTopButton?.classList.toggle("invisible", window.scrollY <= 500);
      backToTopButton?.classList.toggle("translate-y-4", window.scrollY <= 500);
    };

    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    const sections = document.querySelectorAll<HTMLElement>(
      ".guide-page section[id]",
    );
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".toc-link");
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const activeHref = `#${entry.target.id}`;
                navLinks.forEach((link) => {
                  link.classList.toggle(
                    "active",
                    link.getAttribute("href") === activeHref,
                  );
                });
              });
            },
            { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
          )
        : null;
    sections.forEach((section) => observer?.observe(section));

    const copyText = async (text: string) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch {
        // Try the selection-based fallback below.
      }

      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      textArea.remove();
      return copied;
    };

    const handleClick = async (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target;

      if (target.closest("[data-guide-print]")) {
        window.print();
        return;
      }

      if (target.closest("#theme-toggle")) {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        return;
      }

      if (target.closest("#back-to-top")) {
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        });
        return;
      }

      if (target.closest("#reset-checklist")) {
        if (!window.confirm("Veux-tu vraiment réinitialiser ta progression ?")) {
          return;
        }
        window.localStorage.removeItem(checklistStorageKey);
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
        updateChecklist();
        showToast("Progression réinitialisée");
        return;
      }

      if (target.closest("#share-btn")) {
        const shareData = {
          title: "Guide : Premier emploi de développeur",
          text: "Découvre ce guide complet pour décrocher ton premier emploi dans le dev.",
          url: window.location.href,
        };

        if (navigator.share) {
          try {
            await navigator.share(shareData);
            return;
          } catch (error) {
            if (error instanceof Error && error.name === "AbortError") return;
          }
        }

        const copied = await copyText(window.location.href);
        showToast(
          copied
            ? "Lien copié dans le presse-papier"
            : "Impossible de copier le lien",
        );
        return;
      }

      const copyButton = target.closest<HTMLButtonElement>("[data-guide-copy]");
      if (!copyButton) return;

      const source = document.getElementById(
        copyButton.dataset.guideCopy || "",
      );
      if (!source) return;

      const copied = await copyText(
        source.innerText || source.textContent || "",
      );
      if (!copied) {
        showToast("Impossible de copier le texte");
        return;
      }

      const originalMarkup = copyButton.innerHTML;
      copyButton.innerHTML =
        '<i class="ph-bold ph-check text-green-500" aria-hidden="true"></i><span class="text-green-500">Copié</span>';
      window.clearTimeout(copyButtonTimers.get(copyButton));
      const timer = window.setTimeout(() => {
        copyButton.innerHTML = originalMarkup;
        copyButtonTimers.delete(copyButton);
      }, 2000);
      copyButtonTimers.set(copyButton, timer);
      showToast("Texte copié dans le presse-papier");
    };

    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      document.removeEventListener("click", handleClick);
      observer?.disconnect();
      checkboxes.forEach((checkbox) => {
        checkbox.removeEventListener("change", saveChecklist);
      });
      window.clearTimeout(toastTimer);
      copyButtonTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [resolvedTheme, setTheme]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
