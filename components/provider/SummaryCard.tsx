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
    <div className="grid grid-cols-4 sm:grid-cols-12 gap-4">
      {/* Hero stat — spans wide */}
      <div className="col-span-4 sm:col-span-5 rounded-4xl glass shadow-bento p-10 sm:p-12 relative overflow-hidden group hover:shadow-bento-hover transition-all duration-500">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-100 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Pre-Session Dossier
            </div>
            <TrendBadge trend={sheet.trend} />
          </div>
          <div className="text-5xl sm:text-6xl font-black tracking-tighter text-slate-800 mb-2 tabular-nums">
            {sheet.totalEntries}
          </div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            entries · {days} days
          </div>
        </div>
      </div>

      {/* Average */}
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
        blobColor="bg-emerald-100"
        className="col-span-2 sm:col-span-3"
      />

      {/* Minimum */}
      <Stat
        label="Low"
        value={sheet.minimumSentiment.toFixed(2)}
        tone={sheet.minimumSentiment < -0.5 ? "crisis" : "negative"}
        blobColor="bg-rose-100"
        className="col-span-2 sm:col-span-2"
      />

      {/* Maximum */}
      <Stat
        label="High"
        value={sheet.maximumSentiment.toFixed(2)}
        tone={sheet.maximumSentiment > 0.5 ? "positive" : "neutral"}
        blobColor="bg-cyan-100"
        className="col-span-4 sm:col-span-2"
      />

      {(sheet.soapNarrative || sheet.dominantTheme || sheet.priorityFocus || (sheet.riskFlags && sheet.riskFlags.length > 0)) && (
        <div className="col-span-4 sm:col-span-12 space-y-4">
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
          gradient: "from-emerald-500 to-teal-500",
        };
      case "Declining":
        return {
          Icon: TrendingDown,
          gradient: "from-orange-500 to-red-500",
        };
      case "Stable":
        return {
          Icon: Minus,
          gradient: "from-slate-400 to-slate-500",
        };
    }
  })();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${config.gradient} shadow-lg`}
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
  blobColor,
  className = "",
}: {
  label: string;
  value: string;
  tone: "positive" | "negative" | "crisis" | "neutral";
  blobColor: string;
  className?: string;
}) {
  const color = {
    positive: "text-emerald-600",
    negative: "text-orange-600",
    crisis: "text-rose-600",
    neutral: "text-slate-800",
  }[tone];

  return (
    <div className={`rounded-4xl glass shadow-bento p-8 sm:p-10 relative overflow-hidden group hover:shadow-bento-hover hover:-translate-y-1 transition-all duration-500 ${className}`}>
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${blobColor} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700`} />
      <div className="relative z-10">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
          {label}
        </div>
        <div className={`text-4xl sm:text-5xl font-black tabular-nums tracking-tighter ${color}`}>
          {value}
        </div>
      </div>
    </div>
  );
}
