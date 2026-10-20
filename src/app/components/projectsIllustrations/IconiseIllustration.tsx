import {
  Check,
  Download,
  Grid3X3,
  Layers3,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

export default function IconiseIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      data-project-illustration="iconise"
      aria-hidden="true"
      className={`relative isolate h-full min-h-64 w-full overflow-hidden rounded-[1.5rem] bg-[#120e10] text-white ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(239,68,68,0.44),transparent_32%),radial-gradient(circle_at_86%_84%,rgba(251,146,60,0.28),transparent_34%),linear-gradient(135deg,#211014_0%,#0f0d0e_54%,#19130f_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:36px_36px]" />

      <div className="relative flex h-full min-h-64 flex-col p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/55 sm:text-[10px]">
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-white text-[11px] font-black text-[#191011]">
              i
            </span>
            Iconise
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-white/70 backdrop-blur">
            Creative workspace
          </span>
        </div>

        <div className="mt-5 grid flex-1 grid-cols-[0.7fr_1.7fr_0.7fr] items-center gap-3 sm:mt-8 sm:gap-5">
          <div className="hidden h-[72%] flex-col justify-between rounded-2xl border border-white/10 bg-black/20 p-3 text-[8px] uppercase tracking-[0.16em] text-white/45 backdrop-blur sm:flex">
            <div className="space-y-3">
              <span className="block text-white/80">Project brief</span>
              <span className="flex items-center gap-2 text-white/70">
                <span className="size-1.5 rounded-full bg-red-400" /> Direction
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white/30" /> Explore
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white/30" /> Refine
              </span>
            </div>
            <div className="h-px bg-white/10" />
            <span className="flex items-center gap-1.5 text-white/65">
              <Download size={11} /> Export
            </span>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute size-36 rounded-full bg-red-500/30 blur-3xl sm:size-56" />
            <div className="relative flex aspect-square w-[72%] max-w-64 items-center justify-center rounded-[28%] border border-white/20 bg-gradient-to-br from-red-300 via-red-500 to-orange-500 p-3 shadow-[0_24px_80px_rgba(239,68,68,0.35)] sm:w-[68%] sm:max-w-72">
              <div className="flex size-full items-center justify-center rounded-[23%] border border-white/35 bg-black/10 shadow-inner">
                <svg
                  viewBox="0 0 120 120"
                  className="size-[58%] text-white drop-shadow-lg"
                >
                  <path
                    d="M60 13 97 34v43L60 98 23 77V34L60 13Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m41 57 13 13 26-28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="hidden flex-col gap-2 sm:flex">
            <div className="rounded-2xl border border-white/12 bg-white/[0.08] p-3 backdrop-blur">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-white/55">
                <Sparkles size={12} className="text-orange-300" /> Direction
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/15">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-red-400 to-orange-300" />
              </div>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.08] p-3 backdrop-blur">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-white/55">
                <Grid3X3 size={12} className="text-red-300" /> Iteration A–I
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }, (_, index) => (
                  <span
                    key={index}
                    className={`aspect-square rounded-md border ${
                      index === 4
                        ? "border-red-300 bg-red-400/70"
                        : "border-white/10 bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/50 sm:mt-6 sm:text-[10px]">
          <span className="flex items-center gap-2">
            <Layers3 size={13} /> Visual identity workflow
          </span>
          <span className="flex items-center gap-1.5 text-white/75">
            <SlidersHorizontal size={12} />
            <Check size={12} className="text-red-300" />
          </span>
        </div>
      </div>
    </div>
  );
}
