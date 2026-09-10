/**
 * Illustration Truthify portable.
 *
 * Dépendances : React/JSX, `lucide-react` et les utilitaires Tailwind standards.
 * L'animation `animate-pulse-subtle` est déclarée dans `tailwind.config.ts`
 * (theme.extend.keyframes / animation).
 */

import { Activity, AlertTriangle, ArrowDown, FileText } from "lucide-react";

type TruthifyIllustrationProps = {
  className?: string;
};

export default function TruthifyIllustration({
  className = "",
}: TruthifyIllustrationProps) {
  return (
    <figure
      aria-hidden="true"
      className={`mx-auto block w-full max-w-[400px] min-w-0 ${className}`}
      data-truthify-illustration="portable"
    >
      <div className="relative w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_20px_50px_rgb(0,0,0,0.12)] -rotate-3 dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Effet de reflet en haut */}
        <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        <div className="relative flex items-center justify-center border-b border-slate-100 bg-slate-50/50 px-4 py-2.5 dark:border-neutral-700 dark:bg-neutral-800/50">
          <div className="absolute left-4 flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-neutral-600" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-neutral-600" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-neutral-600" />
          </div>
          <div className="opacity-60">
            <span className="text-xs font-semibold tracking-wide text-slate-500 dark:text-neutral-300">
              Truthify
            </span>
          </div>
        </div>

        <div className="space-y-3 p-4 pb-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-neutral-400">
              <FileText className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-xs font-medium">Texte analysé</span>
            </div>

            <div className="mt-1 space-y-2.5">
              <div className="h-3 w-full rounded-md bg-slate-200 dark:bg-neutral-700" />
              <div className="h-3 w-[80%] rounded-md border border-dashed border-orange-200 bg-orange-100 dark:border-orange-900/60 dark:bg-orange-900/30" />
            </div>
          </div>

          <div className="relative z-10 -my-1 flex justify-center">
            <div className="rounded-full border border-slate-100 bg-white p-1.5 text-slate-400 shadow-sm animate-pulse-subtle dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
              <ArrowDown className="h-4 w-4" strokeWidth={2} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-b-slate-200 border-l-[4px] border-l-red-500 border-r-slate-200 border-t-slate-200 bg-white p-3.5 shadow-sm dark:border-b-neutral-700 dark:border-r-neutral-700 dark:border-t-neutral-700 dark:bg-neutral-800">
            <div className="pointer-events-none absolute inset-0 bg-red-50 opacity-30 dark:bg-red-950 dark:opacity-40" />

            <div className="relative z-10">
              {/* En-tête de la carte avec icône et note */}
              <div className="mb-2 flex items-start justify-between">
                <div className="mt-1 flex items-center gap-1.5">
                  <Activity
                    className="h-3.5 w-3.5 text-slate-400 dark:text-neutral-400"
                    strokeWidth={2}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                    Résultat
                  </span>
                </div>

                <div className="flex items-baseline gap-0.5 rounded-md border border-red-100 bg-white px-2 py-1 font-bold text-red-600 shadow-sm dark:border-red-900/60 dark:bg-neutral-900 dark:text-red-400">
                  <span className="text-2xl leading-none">4</span>
                  <span className="text-xs font-semibold leading-none text-slate-400 dark:text-neutral-400">
                    /10
                  </span>
                </div>
              </div>

              <div className="mb-2 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} />
                  <span className="text-xs">Biais cognitif</span>
                </div>
                <span className="text-xs text-slate-300 dark:text-neutral-600">
                  •
                </span>
                <span className="inline-flex items-center rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-700 dark:bg-red-900/50 dark:text-red-300">
                  Généralisation hâtive
                </span>
              </div>

              {/* Skeleton explication */}
              <div className="mt-2 space-y-2">
                <div className="h-2.5 w-[90%] rounded bg-slate-100 dark:bg-neutral-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="h-3" />
      </div>
    </figure>
  );
}
