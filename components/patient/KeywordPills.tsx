"use client";

interface KeywordPillsProps {
  keywords: string[];
  label?: string;
}

export function KeywordPills({ keywords, label = "Keywords" }: KeywordPillsProps) {
  if (keywords.length === 0) return null;
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-text-tertiary mb-3">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((k) => (
          <span
            key={k}
            className="px-2.5 py-1 rounded-full bg-bg-elevated border border-border text-xs text-text-secondary"
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
