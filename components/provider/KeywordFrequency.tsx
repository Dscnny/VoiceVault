"use client";

import type { KeywordCount } from "@/types/Intake";

interface KeywordFrequencyProps {
  keywords: KeywordCount[];
}

export function KeywordFrequency({ keywords }: KeywordFrequencyProps) {
  const max = Math.max(...keywords.map((k) => k.count), 1);

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1">
        Top Keywords
      </div>
      <div className="text-text-primary text-sm mb-4">
        Most frequent across the period
      </div>
      <div className="space-y-3">
        {keywords.map((k) => (
          <div key={k.keyword}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-text-primary">{k.keyword}</span>
              <span className="text-text-tertiary tabular-nums">{k.count}</span>
            </div>
            <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-hover rounded-full"
                style={{ width: `${(k.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {keywords.length === 0 && (
          <div className="text-text-tertiary text-sm">No keywords yet.</div>
        )}
      </div>
    </div>
  );
}
