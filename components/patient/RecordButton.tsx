"use client";

import { Mic, Square } from "lucide-react";

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
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isBusy}
        className={`relative w-32 h-32 rounded-full border flex items-center justify-center transition-all
          ${
            isRecording
              ? "bg-sentiment-crisis/15 border-sentiment-crisis/40 animate-pulse-recording"
              : "bg-bg-card border-border hover:bg-bg-elevated hover:border-accent/40"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label={label}
      >
        {isRecording ? (
          <Square className="w-10 h-10 text-sentiment-crisis fill-sentiment-crisis" />
        ) : (
          <Mic
            className={`w-12 h-12 ${
              isBusy ? "text-text-tertiary animate-pulse-soft" : "text-accent"
            }`}
          />
        )}
        {isRecording && (
          <span className="absolute inset-0 rounded-full border-2 border-sentiment-crisis/30 animate-ping" />
        )}
      </button>
      <div className="text-text-secondary text-sm tabular-nums">{label}</div>
    </div>
  );
}
