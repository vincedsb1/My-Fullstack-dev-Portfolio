"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { IconButton } from "./Button";
export function CopyButton({
  value,
  label,
  copiedLabel,
  errorLabel,
  eventName,
}: {
  value: string;
  label: string;
  copiedLabel: string;
  errorLabel: string;
  eventName?: string;
}) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fallback = useRef<HTMLSpanElement>(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(copiedLabel);
    } catch {
      setMessage(errorLabel);
      requestAnimationFrame(() => {
        const node = fallback.current;
        if (node) {
          const range = document.createRange();
          range.selectNodeContents(node);
          const selection = getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      });
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 4000);
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <IconButton
        aria-label={label}
        onClick={copy}
        data-umami-event={eventName}
      >
        {message === copiedLabel ? (
          <Check aria-hidden size={20} />
        ) : (
          <Copy aria-hidden size={20} />
        )}
      </IconButton>
      <span role="status" className="text-small text-content-muted">
        {message}
        {message === errorLabel && (
          <>
            {" "}
            <span ref={fallback} className="select-all">
              {value}
            </span>
          </>
        )}
      </span>
    </span>
  );
}
