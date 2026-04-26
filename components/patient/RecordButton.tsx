"use client";

import { Mic, Pause, Play, Upload } from "lucide-react";

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
      case "idle":       return "Tap to record";
      case "preparing":  return "Starting…";
      case "recording":  return "Tap to pause";
      case "paused":     return "Paused";
      case "processing": return "Analyzing…";
    }
  })();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Idle / preparing */}
      {!isRecording && !isPaused && (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled || isBusy}
          className="relative w-32 h-32 rounded-full border flex items-center justify-center transition-all
            bg-bg-card border-border hover:bg-bg-elevated hover:border-accent/40
            disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={label}
        >
          <Mic className={`w-12 h-12 ${isBusy ? "text-text-tertiary animate-pulse-soft" : "text-accent"}`} />
        </button>
      )}

      {/* Recording — tap to pause */}
      {isRecording && (
        <button
          type="button"
          onClick={onPause}
          className="relative w-32 h-32 rounded-full border flex items-center justify-center transition-all
            bg-sentiment-crisis/15 border-sentiment-crisis/40 animate-pulse-recording"
          aria-label="Pause recording"
        >
          <Pause className="w-10 h-10 text-sentiment-crisis fill-sentiment-crisis" />
          <span className="absolute inset-0 rounded-full border-2 border-sentiment-crisis/30 animate-ping" />
        </button>
      )}

      {/* Paused — static indicator */}
      {isPaused && (
        <div className="relative w-32 h-32 rounded-full border border-border bg-bg-card flex items-center justify-center">
          <Pause className="w-10 h-10 text-text-tertiary" />
        </div>
      )}

      <div className="text-text-secondary text-sm tabular-nums">{label}</div>

      {/* Resume / Upload — only when paused */}
      {isPaused && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onResume}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border
              bg-bg-card text-text-secondary text-sm hover:bg-bg-elevated hover:text-text-primary transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            Resume
          </button>
          <button
            type="button"
            onClick={onUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
              bg-accent text-white text-sm hover:bg-accent/90 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
        </div>
      )}
    </div>
  );
}