import {
  Atom,
  Braces,
  Code2,
  CreditCard,
  Database,
  FileCode2,
  ImageIcon,
  Languages,
  Laptop,
  LineChart,
  Mail,
  Palette,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  TestTube2,
  type LucideIcon,
} from "lucide-react";
import type { TechnologyId } from "@/content/projects/types";

const technologyMeta: Record<
  TechnologyId,
  { label: string; shortLabel?: string; icon?: LucideIcon }
> = {
  nextjs: { label: "Next.js", icon: FileCode2 },
  react: { label: "React", icon: Atom },
  vue: { label: "Vue.js", icon: Code2 },
  typescript: { label: "TypeScript", shortLabel: "TS", icon: Code2 },
  javascript: { label: "JavaScript", shortLabel: "JS", icon: Code2 },
  tailwind: { label: "Tailwind CSS", shortLabel: "Tailwind", icon: Palette },
  nodejs: { label: "Node.js", icon: Server },
  drizzle: { label: "Drizzle ORM", shortLabel: "Drizzle", icon: Database },
  "better-auth": {
    label: "Better Auth",
    shortLabel: "Auth",
    icon: ShieldCheck,
  },
  mongodb: { label: "MongoDB", icon: Database },
  postgresql: { label: "PostgreSQL", shortLabel: "Postgre", icon: Database },
  mysql: { label: "MySQL", icon: Database },
  json: { label: "JSON", icon: Braces },
  python: { label: "Python", icon: Code2 },
  swift: { label: "Swift", icon: Code2 },
  xcode: { label: "Xcode", icon: Laptop },
  bash: { label: "Bash", icon: Terminal },
  symfony: { label: "Symfony" },
  css: { label: "CSS" },
  recharts: { label: "Recharts", icon: LineChart },
  gemini: { label: "Google Gemini", shortLabel: "Gemini", icon: Sparkles },
  openai: { label: "OpenAI API", shortLabel: "OpenAI", icon: Sparkles },
  stripe: { label: "Stripe", icon: CreditCard },
  ses: { label: "Amazon SES", shortLabel: "SES", icon: Mail },
  "next-intl": { label: "next-intl", icon: Languages },
  sharp: { label: "Sharp", icon: ImageIcon },
  vectorizer: { label: "Vectorizer", shortLabel: "Vector", icon: ImageIcon },
  umami: { label: "Umami", icon: LineChart },
  playwright: { label: "Playwright", icon: TestTube2 },
  "node-test": {
    label: "Node test runner",
    shortLabel: "Node tests",
    icon: TestTube2,
  },
  vercel: { label: "Vercel", icon: Code2 },
};

export function getTechnologyLabel(technology: TechnologyId) {
  return technologyMeta[technology].label;
}

export function TechnologyBadges({
  technologies,
  compact = false,
  label = "Technologies",
}: {
  technologies: TechnologyId[];
  compact?: boolean;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" aria-label={label}>
      {technologies.map((technology) => {
        const meta = technologyMeta[technology];
        const Icon = meta.icon;
        return (
          <span
            key={technology}
            className={`inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 ${
              compact ? "px-2.5 py-1" : ""
            }`}
          >
            {Icon ? <Icon size={compact ? 13 : 15} aria-hidden="true" /> : null}
            <span className="hidden 2xs:inline">
              {compact ? meta.shortLabel ?? meta.label : meta.label}
            </span>
            <span className="2xs:hidden">{meta.shortLabel ?? meta.label}</span>
          </span>
        );
      })}
    </div>
  );
}
