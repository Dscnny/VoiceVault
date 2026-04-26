"use client";

import { Mic, Pause, Play, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type RecordState = "idle" | "preparing" | "recording" | "paused" | "processing";

interface RecordButtonProps {
  state: RecordState;
  onClick: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onUpload?: () => void;
  disabled?: boolean;
}

export function RecordButton({ state, onClick, onPause, onResume, onUpload, disabled }: RecordButtonProps) {
  const isRecording = state === "recording";
  const isPaused = state === "paused";
  const isBusy = state === "preparing" || state === "processing";

  const label = (() => {
    switch (state) {
      case "idle":
        return "Tap to record";
      case "preparing":
        return "Starting…";
      case "recording":
        return "Tap to pause";
      case "paused":
        return "Wait, paused.";
      case "processing":
        return "Analyzing…";
    }
  })();

  const handleOrbClick = () => {
    if (isRecording && onPause) onPause();
    else if (!isRecording && !isPaused) onClick();
  };

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
          onClick={handleOrbClick}
          disabled={disabled || isBusy || isPaused}
          whileHover={!isPaused ? { scale: 1.08 } : undefined}
          whileTap={!isPaused ? { scale: 0.92 } : undefined}
          transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
          className={`relative w-44 h-44 rounded-full flex items-center justify-center cursor-pointer transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed
            ${isRecording
              ? "orb-3d-recording animate-orb-breathe"
              : isPaused
                ? "orb-3d-recording grayscale shadow-md"
                : "orb-3d animate-orb-breathe"
            }
          `}
          aria-label={label}
        >
          {/* Specular highlight — makes it look 3D */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-12 bg-white/30 rounded-full blur-xl" />

          {/* Icon */}
          <AnimatePresence mode="wait">
            {isRecording ? (
              <motion.div
                key="pause"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              >
                <Pause className="w-14 h-14 text-white fill-white drop-shadow-lg" />
              </motion.div>
            ) : isPaused ? (
              <motion.div
                key="paused-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              >
                <Pause className="w-14 h-14 text-white/70 fill-white/70 drop-shadow-lg" />
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              >
                <Mic
                  className={`w-16 h-16 drop-shadow-lg transition-all duration-500 ${
                    isBusy ? "text-white/50 animate-pulse-soft" : "text-white"
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Label */}
      <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 tabular-nums">
        {isPaused ? "Paused" : label}
      </div>

      {/* Resume / Upload — only when paused */}
      <AnimatePresence>
        {isPaused && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex gap-4 mt-2"
          >
            <button
              type="button"
              onClick={onResume}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl glass-strong shadow-sm hover:shadow-md hover:scale-105 active:scale-95 text-slate-700 text-sm font-bold transition-all"
            >
              <Play className="w-4 h-4 fill-slate-700" />
              Resume
            </button>
            <button
              type="button"
              onClick={onUpload}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 hover:scale-105 active:scale-95 text-sm font-bold transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}