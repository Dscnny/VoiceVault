"use client";

interface KeywordPillsProps {
  keywords: string[];
  label?: string;
}

export function KeywordPills({ keywords, label = "Extracted Keywords" }: KeywordPillsProps) {
  if (keywords.length === 0) return null;
  return (
    <div className="relative z-10">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">
        {label}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {keywords.map((k, i) => (
          <span
            key={k}
            className="px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/40 text-sm font-bold text-violet-700 shadow-sm hover:bg-white hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-default"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
