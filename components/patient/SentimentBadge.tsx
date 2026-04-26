"use client";

import type { EmpathyMode } from "@/types/Empathy";

interface SentimentBadgeProps {
  score: number;
  mode?: EmpathyMode;
}

export function SentimentBadge({ score, mode }: SentimentBadgeProps) {
  const { label, gradient } = (() => {
    if (score < -0.6 || mode === "crisis")
      return { label: "Critical", gradient: "from-rose-500 to-pink-500" };
    if (score < -0.25 || mode === "distress")
      return { label: "Negative", gradient: "from-orange-500 to-amber-500" };
    if (score > 0.25 || mode === "positive")
      return { label: "Positive", gradient: "from-emerald-500 to-teal-500" };
    return { label: "Neutral", gradient: "from-slate-400 to-slate-500" };
  })();

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-gradient-to-r ${gradient} shadow-lg tabular-nums`}
    >
      <span className="w-2 h-2 rounded-full bg-white/40" />
      {label}
    </span>
  );
}
