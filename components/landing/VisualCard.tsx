"use client";

import { ReactNode } from "react";
import { Mic, TrendingUp, FileText, MessageCircle } from "lucide-react";

interface VisualCardProps {
  variant: "microphone" | "mood" | "therapist" | "reflection";
}

const CARD_CONFIG: Record<
  VisualCardProps["variant"],
  {
    icon: ReactNode;
    label: string;
    sublabel: string;
    accent: string;
    extra: ReactNode;
  }
> = {
  microphone: {
    icon: <Mic className="w-8 h-8 text-blue-400" />,
    label: "Voice Journal",
    sublabel: "2 min recording · last night",
    accent: "from-blue-400/20 to-indigo-400/20",
    extra: (
      /* Waveform bars */
      <div className="flex items-end gap-[3px] mt-4 h-10">
        {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3, 0.7, 0.5, 0.85, 0.4, 0.6, 0.75, 0.5, 0.65].map(
          (h, i) => (
            <div
              key={i}
              className="w-[4px] rounded-full bg-gradient-to-t from-blue-400 to-indigo-300"
              style={{
                height: `${h * 100}%`,
                opacity: 0.5 + h * 0.5,
                animation: `waveBar 1.5s ease-in-out ${i * 0.1}s infinite alternate`,
              }}
            />
          )
        )}
      </div>
    ),
  },
  mood: {
    icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
    label: "Mood Trends",
    sublabel: "Past 7 days",
    accent: "from-emerald-400/20 to-teal-400/20",
    extra: (
      /* Mini mood chart */
      <div className="mt-4 flex items-end gap-2 h-12">
        {[
          { val: 0.3, color: "#f59e0b" },
          { val: 0.5, color: "#a78bfa" },
          { val: 0.45, color: "#a78bfa" },
          { val: 0.7, color: "#34d399" },
          { val: 0.6, color: "#34d399" },
          { val: 0.8, color: "#34d399" },
          { val: 0.75, color: "#34d399" },
        ].map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full rounded-md"
              style={{
                height: `${d.val * 100}%`,
                backgroundColor: d.color,
                opacity: 0.7,
              }}
            />
            <span className="text-[9px] text-slate-400 font-medium">
              {["M", "T", "W", "T", "F", "S", "S"][i]}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  therapist: {
    icon: <FileText className="w-8 h-8 text-violet-400" />,
    label: "Session Summary",
    sublabel: "Ready for your therapist",
    accent: "from-violet-400/20 to-purple-400/20",
    extra: (
      /* Fake text summary lines */
      <div className="mt-4 space-y-2">
        <div className="h-2 rounded-full bg-violet-200/60 w-full" />
        <div className="h-2 rounded-full bg-violet-200/40 w-4/5" />
        <div className="h-2 rounded-full bg-violet-200/30 w-3/5" />
        <div className="flex gap-2 mt-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-600 font-semibold">
            anxiety
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-semibold">
            sleep
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-semibold">
            hopeful
          </span>
        </div>
      </div>
    ),
  },
  reflection: {
    icon: <MessageCircle className="w-8 h-8 text-sky-400" />,
    label: "Reflection Prompt",
    sublabel: "Today's gentle nudge",
    accent: "from-sky-400/20 to-cyan-400/20",
    extra: (
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100">
        <p className="text-sm text-slate-600 italic leading-relaxed">
          &ldquo;What felt different about today compared to yesterday?&rdquo;
        </p>
      </div>
    ),
  },
};

export default function VisualCard({ variant }: VisualCardProps) {
  const config = CARD_CONFIG[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl border border-white/30 shadow-lg
        bg-gradient-to-br ${config.accent} bg-white/40
        hover:shadow-xl hover:-translate-y-1 transition-all duration-500 w-full max-w-[280px]`}
    >
      {/* Glow blob */}
      <div
        className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-40 bg-gradient-to-br ${config.accent}`}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-1">
          {config.icon}
          <div>
            <div className="text-sm font-bold text-slate-700">
              {config.label}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {config.sublabel}
            </div>
          </div>
        </div>
        {config.extra}
      </div>
    </div>
  );
}
