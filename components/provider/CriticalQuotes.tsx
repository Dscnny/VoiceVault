"use client";

import { Quote } from "lucide-react";
import type { ClinicalQuote } from "@/types/Intake";

interface CriticalQuotesProps {
  quotes: ClinicalQuote[];
}

export function CriticalQuotes({ quotes }: CriticalQuotesProps) {
  return (
    <div className="rounded-4xl glass shadow-bento p-10 sm:p-12 relative overflow-hidden group hover:shadow-bento-hover transition-all duration-500">
      {/* Decorative blob */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-rose-100 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

      <div className="relative z-10">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
          Flagged Excerpts
        </div>
        <div className="text-sm font-semibold text-slate-600 mb-8">
          Sorted by severity · raw, never paraphrased
        </div>

        <div className="space-y-5">
          {quotes.map((q, idx) => (
            <div
              key={idx}
              className="relative pl-7 py-5 pr-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Gradient accent line */}
              <div className="absolute left-0 top-4 bottom-4 w-1.5 rounded-full bg-gradient-to-b from-rose-400 to-orange-400" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0 mt-0.5">
                  <Quote className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-base font-medium leading-relaxed italic mb-4">
                    &ldquo;{q.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg tabular-nums">
                      {q.timestamp.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg tabular-nums">
                      {q.sentimentScore.toFixed(2)}
                    </span>
                    {q.keywords.map((k) => (
                      <span
                        key={k}
                        className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-lg"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {quotes.length === 0 && (
            <div className="text-slate-400 font-medium text-sm py-4">
              No flagged excerpts in this window.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
