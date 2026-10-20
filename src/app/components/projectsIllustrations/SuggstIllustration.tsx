import {
  Code2,
  Command,
  MessageSquare,
  Mic,
  MousePointer2,
  Sparkles,
} from "lucide-react";

export default function SuggstIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      data-project-illustration="suggst"
      aria-hidden="true"
      className={`relative isolate h-full min-h-64 w-full overflow-hidden rounded-[1.5rem] bg-[#111113] text-white ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(127,29,29,0.66),transparent_36%),radial-gradient(circle_at_90%_90%,rgba(120,113,108,0.38),transparent_38%),linear-gradient(135deg,#281113_0%,#111112_52%,#27211c_100%)]" />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      <div className="relative flex h-full min-h-64 flex-col p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/55 sm:text-[10px]">
          <span className="flex items-center gap-2">
            <span className="flex gap-1">
              <span className="size-2 rounded-full bg-white/30" />
              <span className="size-2 rounded-full bg-white/20" />
              <span className="size-2 rounded-full bg-white/10" />
            </span>
            Suggst
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 backdrop-blur">
            <Command size={11} /> ⌘ K
          </span>
        </div>

        <div className="mt-5 grid flex-1 grid-cols-[minmax(0,0.55fr)_minmax(0,1.65fr)_minmax(0,0.8fr)] gap-3 sm:mt-8 sm:gap-5">
          <div className="hidden min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 sm:flex">
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-white/55">
              <Sparkles size={12} className="text-red-300" /> Context
            </div>
            <div className="space-y-2">
              <span className="block h-1.5 w-4/5 rounded-full bg-white/25" />
              <span className="block h-1.5 w-full rounded-full bg-white/10" />
              <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
            </div>
            <div className="mt-auto flex items-center gap-2 text-white/45">
              <MousePointer2 size={12} />
              <span className="text-[8px] uppercase tracking-[0.16em]">
                Active window
              </span>
            </div>
          </div>

          <div className="relative flex min-w-0 flex-col justify-center rounded-[1.35rem] border border-white/15 bg-white/[0.09] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
              <Mic size={12} className="text-orange-200" /> Listening
            </div>
            <div className="mt-5 flex items-center gap-1.5 sm:mt-7">
              {Array.from({ length: 16 }, (_, index) => (
                <span
                  key={index}
                  className="w-1 rounded-full bg-gradient-to-b from-red-300 to-orange-200"
                  style={{
                    height: `${12 + ((index * 17) % 30)}px`,
                    opacity: 0.35 + (index % 4) * 0.15,
                  }}
                />
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-3 sm:mt-7">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-white/45">
                <MessageSquare size={12} /> Suggested context
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                Focused help for this document.
              </p>
            </div>
          </div>

          <div className="hidden min-w-0 flex-col justify-end gap-2 sm:flex">
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-3 backdrop-blur">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-white/55">
                <Code2 size={12} className="text-red-300" /> Shortcuts
              </div>
              <div className="mt-3 space-y-2 text-[10px] text-white/55">
                <div className="flex items-center justify-between gap-2">
                  <span>Show suggst</span>
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-white/75">
                    ⌘ S
                  </kbd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Pause</span>
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-white/75">
                    ⌘ P
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/50 sm:mt-6 sm:text-[10px]">
          <span>Contextual macOS assistant</span>
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="size-1.5 rounded-full bg-emerald-300" /> Ready
          </span>
        </div>
      </div>
    </div>
  );
}
