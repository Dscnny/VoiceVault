"use client";

import { Sparkles, Heart, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { EmpathyResponse } from "@/types/Empathy";

interface NudgeCardProps {
  response: EmpathyResponse;
}

export function NudgeCard({ response }: NudgeCardProps) {
  const { Icon, gradient, iconBg, label } = (() => {
    switch (response.mode) {
      case "crisis":
        return {
          Icon: AlertCircle,
          gradient: "from-rose-500 to-pink-500",
          iconBg: "bg-rose-500",
          label: "Reaching out matters",
        };
      case "distress":
        return {
          Icon: Heart,
          gradient: "from-orange-500 to-amber-500",
          iconBg: "bg-orange-500",
          label: "Be gentle with yourself",
        };
      case "positive":
        return {
          Icon: Sparkles,
          gradient: "from-emerald-500 to-teal-500",
          iconBg: "bg-emerald-500",
          label: "Worth noticing",
        };
      default:
        return {
          Icon: Sparkles,
          gradient: "from-violet-500 to-fuchsia-500",
          iconBg: "bg-violet-500",
          label: "A gentle nudge",
        };
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="rounded-4xl glass shadow-glass-lg p-10 relative overflow-hidden group hover:shadow-glass-xl transition-all duration-500"
    >
      {/* Gradient accent bar at top */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient} rounded-t-4xl`} />

      {/* Decorative blob */}
      <div className={`absolute -bottom-16 -right-16 w-48 h-48 ${iconBg} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-700`} />

      <div className="relative z-10 flex items-start gap-5">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 pt-0.5">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
            {label}
          </div>
          <p className="text-slate-700 text-lg sm:text-xl font-semibold leading-relaxed">
            {response.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
