"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { IconButton } from "@/components/ui/Button";
import styles from "./SiteHeader.module.css";
export default function HeaderNavigation({
  links,
  label,
  menuLabel,
}: {
  links: { href: string; label: string }[];
  label: string;
  menuLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <IconButton
        ref={button}
        className="md:hidden"
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
      </IconButton>
      <nav
        id="site-navigation"
        aria-label={label}
        className={`${
          open ? "flex" : "hidden"
        } absolute left-0 top-full min-w-48 flex-col gap-1 rounded-card border border-border bg-surface-raised p-3 shadow-card md:static md:flex md:min-w-0 md:flex-row md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            aria-current={link.href === path ? "page" : undefined}
            className={`${styles.navigationLink} rounded-control px-3 py-2 text-small text-content-muted aria-[current=page]:font-bold aria-[current=page]:text-content`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
