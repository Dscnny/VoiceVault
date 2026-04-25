"use client";

import { Sparkles, Heart, AlertCircle } from "lucide-react";
import type { EmpathyResponse } from "@/types/Empathy";

interface NudgeCardProps {
  response: EmpathyResponse;
}

export function NudgeCard({ response }: NudgeCardProps) {
  const { Icon, accent, label } = (() => {
    switch (response.mode) {
      case "crisis":
        return {
          Icon: AlertCircle,
          accent: "text-sentiment-crisis bg-sentiment-crisis/10 border-sentiment-crisis/30",
          label: "Reaching out matters",
        };
      case "distress":
        return {
          Icon: Heart,
          accent: "text-sentiment-negative bg-sentiment-negative/10 border-sentiment-negative/30",
          label: "Be gentle",
        };
      case "positive":
        return {
          Icon: Sparkles,
          accent: "text-sentiment-positive bg-sentiment-positive/10 border-sentiment-positive/30",
          label: "Worth noticing",
        };
      default:
        return {
          Icon: Sparkles,
          accent: "text-accent bg-accent/10 border-accent/30",
          label: "A gentle nudge",
        };
    }
  })();

  return (
    <div className={`rounded-2xl border p-5 ${accent}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider opacity-70 mb-1">
            {label}
          </div>
          <p className="text-text-primary leading-relaxed">{response.message}</p>
        </div>
      </div>
    </div>
  );
}
