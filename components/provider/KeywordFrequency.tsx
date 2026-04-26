"use client";

import type { KeywordCount } from "@/types/Intake";

interface KeywordFrequencyProps {
  keywords: KeywordCount[];
}

export function KeywordFrequency({ keywords }: KeywordFrequencyProps) {
  const max = Math.max(...keywords.map((k) => k.count), 1);

  return (
    <div className="rounded-4xl glass shadow-bento p-10 sm:p-12 h-full relative overflow-hidden group hover:shadow-bento-hover transition-all duration-500">
      {/* Decorative blob */}
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-fuchsia-100 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />

      <div className="relative z-10">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
          Top Keywords
        </div>
        <div className="text-sm font-semibold text-slate-600 mb-8">
          Most frequent across the period
        </div>
        <div className="space-y-5">
          {keywords.map((k) => (
            <div key={k.keyword} className="group/bar">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-bold text-slate-700">{k.keyword}</span>
                <span className="text-xs font-black text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg tabular-nums">
                  {k.count}
                </span>
              </div>
              <div className="h-2.5 bg-slate-100/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-400 rounded-full transition-all duration-700 group-hover/bar:from-fuchsia-500 group-hover/bar:to-violet-500"
                  style={{ width: `${(k.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {keywords.length === 0 && (
            <div className="text-slate-400 font-medium text-sm">No keywords yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
