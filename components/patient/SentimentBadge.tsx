"use client";

import type { EmpathyMode } from "@/types/Empathy";

interface SentimentBadgeProps {
  score: number;
  mode?: EmpathyMode;
}

export function SentimentBadge({ score, mode }: SentimentBadgeProps) {
  const { label, color, bg, border } = (() => {
    if (score < -0.6 || mode === "crisis")
      return {
        label: "Critical",
        color: "text-sentiment-crisis",
        bg: "bg-sentiment-crisis/10",
        border: "border-sentiment-crisis/30",
      };
    if (score < -0.25 || mode === "distress")
      return {
        label: "Negative",
        color: "text-sentiment-negative",
        bg: "bg-sentiment-negative/10",
        border: "border-sentiment-negative/30",
      };
    if (score > 0.25 || mode === "positive")
      return {
        label: "Positive",
        color: "text-sentiment-positive",
        bg: "bg-sentiment-positive/10",
        border: "border-sentiment-positive/30",
      };
    return {
      label: "Neutral",
      color: "text-sentiment-neutral",
      bg: "bg-sentiment-neutral/10",
      border: "border-sentiment-neutral/30",
    };
  })();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tabular-nums border ${bg} ${color} ${border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${color.replace("text-", "bg-")}`} />
      {label} · {score >= 0 ? "+" : ""}
      {score.toFixed(2)}
    </span>
  );
}
