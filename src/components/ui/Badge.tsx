import type { ReactNode } from "react";
export function Badge({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: "neutral" | "outline" | "accent";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-control border px-3 py-1 text-xs font-medium ${
        variant === "accent"
          ? "border-accent/20 bg-accent/10 text-accent"
          : variant === "outline"
          ? "border-border text-content-muted"
          : "border-border bg-surface-sunken text-content-muted"
      }`}
    >
      {children}
    </span>
  );
}
