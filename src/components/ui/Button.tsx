import type {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
  Ref,
} from "react";
const variants = {
  primary: "bg-content text-surface hover:opacity-85",
  secondary:
    "border border-border text-content hover:border-accent hover:text-accent",
  ghost: "text-content-muted hover:bg-surface-sunken hover:text-content",
  accent: "bg-red-600 text-white hover:bg-red-700",
};
type Variant = keyof typeof variants;
export function buttonClass(variant: Variant = "primary", className = "") {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 py-2 text-sm font-semibold transition-colors duration-fast disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`;
}
export function Button({
  variant = "primary",
  className,
  icon,
  size = "md",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      className={buttonClass(
        variant,
        `${
          size === "sm" ? "min-h-9" : size === "lg" ? "min-h-12" : "min-h-11"
        } ${className ?? ""}`,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
export function ButtonLink({
  variant = "primary",
  className,
  icon,
  size = "md",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <a
      className={buttonClass(
        variant,
        `${
          size === "sm" ? "min-h-9" : size === "lg" ? "min-h-12" : "min-h-11"
        } ${className ?? ""}`,
      )}
      {...props}
    >
      {icon}
      {children}
    </a>
  );
}
export function IconButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  "aria-label": string;
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-control text-content-muted transition-colors hover:bg-surface-sunken hover:text-content ${className}`}
      {...props}
    />
  );
}

// Tabs, media overlays and interactive product modules provide their own layout.
// Native behavior, disabled state and the global focus style stay shared.
export function SurfaceButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> }) {
  return (
    <button
      type="button"
      className={`disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
