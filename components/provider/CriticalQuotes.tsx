"use client";

import { Quote } from "lucide-react";
import type { ClinicalQuote } from "@/types/Intake";

interface CriticalQuotesProps {
  quotes: ClinicalQuote[];
}

export function CriticalQuotes({ quotes }: CriticalQuotesProps) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1">
        Flagged Excerpts
      </div>
      <div className="text-text-primary text-sm mb-4">
        Sorted by sentiment severity · raw, never paraphrased
      </div>
      <div className="space-y-4">
        {quotes.map((q, idx) => (
          <div
            key={idx}
            className="border-l-2 border-sentiment-negative/60 pl-4 py-1"
          >
            <div className="flex items-start gap-2">
              <Quote className="w-4 h-4 text-sentiment-negative mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-text-primary text-sm leading-relaxed italic">
                  "{q.text}"
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-text-tertiary tabular-nums">
                    {q.timestamp.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-sentiment-negative tabular-nums">
                    score {q.sentimentScore.toFixed(2)}
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {q.keywords.map((k) => (
                      <span
                        key={k}
                        className="px-1.5 py-0.5 rounded bg-bg-elevated text-text-tertiary"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {quotes.length === 0 && (
          <div className="text-text-tertiary text-sm">
            No flagged excerpts in this window.
          </div>
        )}
      </div>
    </div>
  );
}
