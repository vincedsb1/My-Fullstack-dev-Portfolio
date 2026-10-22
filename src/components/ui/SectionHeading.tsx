import type { ReactNode } from "react";
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  icon,
  introClassName = "text-neutral-500 dark:text-neutral-400",
  as: Tag = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  icon?: ReactNode;
  introClassName?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && (
        <p className="mb-3 text-eyebrow uppercase text-accent">{eyebrow}</p>
      )}
      <Tag id={id} className="flex items-center text-h2 font-bold text-content">
        {icon && (
          <span className="flex w-12 shrink-0 items-center" aria-hidden="true">
            {icon}
          </span>
        )}
        {title}
      </Tag>
      {intro && (
        <p
          className={`mt-3 text-lead ${icon ? "pl-12 " : ""}${introClassName}`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
