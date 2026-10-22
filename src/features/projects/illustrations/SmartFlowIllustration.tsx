/**
 * Illustration SmartFlow portable.
 *
 * Dépendances : React/JSX et les utilitaires Tailwind standards uniquement.
 * Ce fichier ne dépend ni des tokens `sf-*`, ni de `globals.css`, ni du
 * domaine métier SmartFlow. Il peut être copié tel quel dans un autre projet
 * Next.js équipé de Tailwind.
 */

type SmartFlowIllustrationProps = {
  className?: string;
};

const queueRows = [
  {
    id: "current",
    primaryWidth: "w-20",
    secondaryWidth: "w-12",
    active: true,
  },
  {
    id: "next",
    primaryWidth: "w-24",
    secondaryWidth: "w-16",
    active: false,
  },
] as const;

export default function SmartFlowIllustration({
  className = "",
}: SmartFlowIllustrationProps) {
  return (
    <figure
      aria-hidden="true"
      className={`mx-auto block w-full max-w-[33rem] min-w-0 ${className}`}
      data-smartflow-illustration="portable"
    >
      <div className="mx-1 min-w-0 origin-center rotate-[0.35deg] rounded-[24px] border border-[#e5e7eb] bg-[#f9fafb] shadow-[0_34px_74px_-40px_rgba(17,24,39,0.45)] dark:border-[#353535] dark:bg-[#2a2a2a] dark:shadow-[0_30px_66px_-44px_rgba(0,0,0,0.72)] sm:rotate-[0.75deg]">
        <div className="min-w-0 overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-[#fcfbfa] dark:border-[#353535] dark:bg-[#1a1a1a]">
          <div className="flex min-w-0 items-center gap-3 border-b border-[#e5e7eb] bg-white px-3 py-2.5 dark:border-[#353535] dark:bg-[#202020] sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="flex shrink-0 items-center gap-1"
                aria-hidden="true"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#df6035]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#2f4b79]/45 dark:bg-[#a9c7f5]/45" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#646c7a]/35 dark:bg-[#a3a3a3]/35" />
              </span>
              <span className="truncate text-[0.8125rem] font-semibold leading-[1.45] tracking-[0.01em] text-[#111827] dark:text-[#e5e5e5]">
                Aujourd&apos;hui
              </span>
            </div>
          </div>

          <div className="grid min-w-0 gap-3 p-3 sm:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] sm:gap-4 sm:p-4">
            <aside className="hidden min-w-0 flex-col sm:flex">
              <div className="flex items-end justify-between gap-2">
                <p className="whitespace-nowrap text-sm font-semibold leading-[1.3] tracking-[-0.005em] text-[#111827] dark:text-[#e5e5e5]">
                  À réciter
                </p>
                <span className="font-mono text-[0.625rem] tabular-nums text-[#646c7a] dark:text-[#a3a3a3]">
                  1/3
                </span>
              </div>

              <ol className="mt-3 space-y-2">
                {queueRows.map((row) => (
                  <li
                    key={row.id}
                    className={`min-w-0 rounded-[10px] border px-2.5 py-2.5 ${
                      row.active
                        ? "border-[#df6035] bg-[#fbefea] dark:bg-[#3b2016]"
                        : "border-[#e5e7eb] bg-white dark:border-[#353535] dark:bg-[#202020]"
                    }`}
                  >
                    <div className="space-y-2">
                      <span
                        className={`block h-1.5 max-w-full rounded-full ${
                          row.primaryWidth
                        } ${
                          row.active
                            ? "bg-[#9a3412]/30 dark:bg-[#fdba74]/35"
                            : "bg-[#111827]/15 dark:bg-white/15"
                        }`}
                      />
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`block h-1.5 max-w-full rounded-full ${
                            row.secondaryWidth
                          } ${
                            row.active
                              ? "bg-[#9a3412]/20 dark:bg-[#fdba74]/25"
                              : "bg-[#646c7a]/25 dark:bg-[#a3a3a3]/25"
                          }`}
                        />
                        {row.active ? (
                          <span className="shrink-0 text-[0.75rem] font-semibold leading-[1.35] tracking-[0.02em] text-[#9a3412] dark:text-[#fdba74]">
                            En cours
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <span className="mt-auto inline-flex min-h-9 items-center justify-center rounded-[12px] bg-[#c54d24] px-3 text-[0.6875rem] font-semibold text-white">
                Réciter
              </span>
            </aside>

            <div className="min-w-0 rounded-[16px] border border-[#e5e7eb] bg-white p-3 dark:border-[#353535] dark:bg-[#202020] sm:p-4">
              <div className="rounded-[10px] border border-[#e5e7eb] bg-[#fcfbfa] px-3 py-3 text-center dark:border-[#353535] dark:bg-[#1a1a1a] sm:px-4">
                <p className="text-[0.625rem] font-extrabold uppercase leading-[1.4] tracking-[0.2em] text-[#646c7a] dark:text-[#a3a3a3]">
                  Question
                </p>
                <div className="mt-2 flex w-full flex-col items-center">
                  <span className="block h-2.5 w-4/5 rounded-full bg-[#111827]/15 dark:bg-white/15" />
                </div>
              </div>

              <div className="mt-2 rounded-[10px] bg-[#f9fafb] px-3 py-3 dark:bg-[#2a2a2a] sm:px-4">
                <p className="text-[0.625rem] font-extrabold uppercase leading-[1.4] tracking-[0.2em] text-[#646c7a] dark:text-[#a3a3a3]">
                  Réponse
                </p>
                <div className="mt-2 space-y-2">
                  <span className="block h-1.5 w-full rounded-full bg-[#111827]/15 dark:bg-white/15" />
                  <span className="block h-1.5 w-11/12 rounded-full bg-[#111827]/15 dark:bg-white/15" />
                  <span className="block h-1.5 w-3/4 rounded-full bg-[#111827]/10 dark:bg-white/10" />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ef4444] text-xs font-bold text-[#111827]">
                  ×
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-xs font-bold text-[#111827] dark:bg-[#4ade80]">
                  ✓
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
