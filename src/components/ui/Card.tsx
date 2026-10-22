import type { HTMLAttributes, AnchorHTMLAttributes } from "react";
export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-border bg-surface-raised p-6 shadow-card ${className}`}
      {...props}
    />
  );
}
export function CardLink({
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`block rounded-card border border-border bg-surface-raised p-6 shadow-card transition-shadow hover:shadow-card-hover ${className}`}
      {...props}
    />
  );
}
