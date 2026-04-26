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
      <div className="relative">
        <div
          className={`absolute inset-[-16px] rounded-full border-2 transition-all duration-700 ${
            isRecording
              ? "border-cyan-300/50 animate-orb-ring"
              : "border-cyan-200/30 animate-orb-ring"
          }`}
        />
        <div
          className={`absolute inset-[-30px] rounded-full border transition-all duration-700 ${
            isRecording
              ? "border-cyan-200/30 animate-orb-ring-2"
              : "border-cyan-100/20 animate-orb-ring-2"
          }`}
        />

        <motion.button
          type="button"
          onClick={handleOrbClick}
          disabled={disabled || isBusy || isPaused}
          whileHover={!isPaused ? { scale: 1.08 } : undefined}
          whileTap={!isPaused ? { scale: 0.92 } : undefined}
          transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
          className={`relative w-44 h-44 rounded-full flex items-center justify-center cursor-pointer transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed
            backdrop-blur-md border-4 border-white/20
            ${isRecording
              ? "bg-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.6)] animate-pulse"
              : isPaused
                ? "bg-slate-400/50 grayscale shadow-md"
                : "bg-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            }
          `}
          aria-label={label}
        >
          {/* Bubble specular highlight */}
          <div className="absolute top-2 left-4 w-12 h-6 bg-white/40 rounded-full blur-[2px] transform -rotate-12" />
          <div className="absolute bottom-4 right-6 w-8 h-8 bg-white/20 rounded-full blur-[4px]" />

          <AnimatePresence mode="wait">
            {isRecording ? (
              <motion.div
                key="pause"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              >
                <Pause className="w-14 h-14 text-white fill-white drop-shadow-md" />
              </motion.div>
            ) : isPaused ? (
              <motion.div
                key="paused-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              >
                <Pause className="w-14 h-14 text-white/70 fill-white/70 drop-shadow-md" />
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
                  className={`w-16 h-16 drop-shadow-md transition-all duration-500 ${
                    isBusy ? "text-white/50 animate-pulse-soft" : "text-white"
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-800/60 tabular-nums">
        {isPaused ? "Paused" : label}
      </div>

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
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/50 backdrop-blur-md shadow-sm hover:shadow-md hover:scale-105 active:scale-95 text-cyan-900 text-sm font-bold border border-white/40 transition-all"
            >
              <Play className="w-4 h-4 fill-cyan-900" />
              Resume
            </button>
            <button
              type="button"
              onClick={onUpload}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-200/50 hover:shadow-xl hover:shadow-cyan-300/50 hover:scale-105 active:scale-95 text-sm font-bold transition-all"
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