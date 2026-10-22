import type { HTMLAttributes } from "react";
export function Container({
  size = "default",
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { size?: "narrow" | "default" | "wide" }) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 ${
        { narrow: "max-w-3xl", default: "max-w-5xl", wide: "max-w-7xl" }[size]
      } ${className}`}
      {...props}
    />
  );
}
export function Section({
  labelledBy,
  tone = "default",
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  labelledBy?: string;
  tone?: "default" | "sunken";
}) {
  return (
    <section
      {...props}
      aria-labelledby={labelledBy}
      className={`py-16 sm:py-24 ${
        tone === "sunken" ? "bg-surface-sunken" : ""
      }`}
    >
      <Container>{children}</Container>
    </section>
  );
}
