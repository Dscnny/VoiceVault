"use client";

import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import type { IntakeCheatSheet, SentimentTrend } from "@/types/Intake";

interface SummaryCardProps {
  sheet: IntakeCheatSheet;
}

export function SummaryCard({ sheet }: SummaryCardProps) {
  const days = Math.round(
    (sheet.periodEnd.getTime() - sheet.periodStart.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1">
            Pre-Session Dossier
          </div>
          <div className="text-text-primary text-lg font-medium">
            Last {days} days · {sheet.totalEntries} entries
          </div>
        </div>
        <TrendBadge trend={sheet.trend} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat
          label="Average"
          value={sheet.averageSentiment.toFixed(2)}
          tone={
            sheet.averageSentiment > 0.25
              ? "positive"
              : sheet.averageSentiment < -0.25
                ? "negative"
                : "neutral"
          }
        />
        <Stat
          label="Minimum"
          value={sheet.minimumSentiment.toFixed(2)}
          tone={sheet.minimumSentiment < -0.5 ? "crisis" : "negative"}
        />
        <Stat
          label="Maximum"
          value={sheet.maximumSentiment.toFixed(2)}
          tone={sheet.maximumSentiment > 0.5 ? "positive" : "neutral"}
        />
      </div>

      {(sheet.soapNarrative || sheet.dominantTheme || sheet.priorityFocus || (sheet.riskFlags && sheet.riskFlags.length > 0)) && (
        <div className="mt-6 space-y-4">
          {sheet.soapNarrative && (
            <div className="rounded-xl border border-border bg-bg-elevated px-5 py-4">
              <div className="text-xs uppercase tracking-wider text-text-tertiary mb-2">
                Clinical Summary
              </div>
              <p className="text-sm text-text-primary leading-relaxed">
                {sheet.soapNarrative}
              </p>
            </div>
          )}

          {sheet.dominantTheme && (
            <div className="flex items-baseline gap-3 rounded-xl border border-border bg-bg-elevated px-5 py-4">
              <div className="text-xs uppercase tracking-wider text-text-tertiary whitespace-nowrap">
                Dominant Theme
              </div>
              <div className="text-sm font-medium text-accent">
                {sheet.dominantTheme}
              </div>
            </div>
          )}

          {sheet.priorityFocus && (
            <div className="rounded-xl border border-border bg-bg-elevated px-5 py-4">
              <div className="text-xs uppercase tracking-wider text-text-tertiary mb-2">
                Priority for Next Session
              </div>
              <p className="text-sm text-text-primary">{sheet.priorityFocus}</p>
            </div>
          )}

          {sheet.riskFlags && sheet.riskFlags.length > 0 && (
            <div className="rounded-xl border border-sentiment-negative/30 bg-sentiment-negative/10 px-5 py-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-sentiment-negative mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Risk Flags
              </div>
              <ul className="space-y-1">
                {sheet.riskFlags.map((flag, i) => (
                  <li key={i} className="text-sm text-sentiment-negative">
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TrendBadge({ trend }: { trend: SentimentTrend }) {
  const config = (() => {
    switch (trend) {
      case "Improving":
        return {
          Icon: TrendingUp,
          color: "text-sentiment-positive bg-sentiment-positive/10 border-sentiment-positive/30",
        };
      case "Declining":
        return {
          Icon: TrendingDown,
          color: "text-sentiment-negative bg-sentiment-negative/10 border-sentiment-negative/30",
        };
      case "Stable":
        return {
          Icon: Minus,
          color: "text-text-secondary bg-bg-elevated border-border",
        };
    }
  })();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}
    >
      <config.Icon className="w-3.5 h-3.5" />
      {trend}
    </span>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "positive" | "negative" | "crisis" | "neutral";
}) {
  const color = {
    positive: "text-sentiment-positive",
    negative: "text-sentiment-negative",
    crisis: "text-sentiment-crisis",
    neutral: "text-text-primary",
  }[tone];
  return (
    <div>
      <div className="text-xs text-text-tertiary uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-2xl font-semibold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
