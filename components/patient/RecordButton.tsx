"use client";

import { Mic, Square } from "lucide-react";
import { motion } from "framer-motion";

export type RecordState = "idle" | "preparing" | "recording" | "processing";

interface RecordButtonProps {
  state: RecordState;
  onClick: () => void;
  disabled?: boolean;
}

export function RecordButton({ state, onClick, disabled }: RecordButtonProps) {
  const isRecording = state === "recording";
  const isBusy = state === "preparing" || state === "processing";

  const label = (() => {
    switch (state) {
      case "idle":
        return "Tap to record";
      case "preparing":
        return "Starting…";
      case "recording":
        return "Tap to stop";
      case "processing":
        return "Analyzing…";
    }
  })();

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Orb container */}
      <div className="relative">
        {/* Outer animated ring 1 */}
        <div
          className={`absolute inset-[-16px] rounded-full border-2 transition-all duration-700 ${
            isRecording
              ? "border-rose-300/50 animate-orb-ring"
              : "border-violet-300/30 animate-orb-ring"
          }`}
        />
        {/* Outer animated ring 2 */}
        <div
          className={`absolute inset-[-30px] rounded-full border transition-all duration-700 ${
            isRecording
              ? "border-rose-200/30 animate-orb-ring-2"
              : "border-violet-200/20 animate-orb-ring-2"
          }`}
        />

        {/* The 3D Orb itself */}
        <motion.button
          type="button"
          onClick={onClick}
          disabled={disabled || isBusy}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`relative w-44 h-44 rounded-full flex items-center justify-center cursor-pointer transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed
            ${isRecording
              ? "orb-3d-recording animate-orb-breathe"
              : "orb-3d animate-orb-breathe"
            }
          `}
          aria-label={label}
        >
          {/* Specular highlight — makes it look 3D */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-12 bg-white/30 rounded-full blur-xl" />

          {/* Icon */}
          {isRecording ? (
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Square className="w-14 h-14 text-white fill-white drop-shadow-lg" />
            </motion.div>
          ) : (
            <Mic
              className={`w-16 h-16 drop-shadow-lg transition-all duration-500 ${
                isBusy ? "text-white/50 animate-pulse-soft" : "text-white"
              }`}
            />
          )}
        </motion.button>
      </div>

      {/* Label */}
      <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 tabular-nums">
        {label}
      </div>
    </div>
  );
}
