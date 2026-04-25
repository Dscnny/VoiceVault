"use client";

interface TranscriptDisplayProps {
  transcript: string;
  isLive?: boolean;
  placeholder?: string;
}

export function TranscriptDisplay({
  transcript,
  isLive,
  placeholder = "Your words will appear here as you speak…",
}: TranscriptDisplayProps) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-6 min-h-[160px]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-wider text-text-tertiary">
          Transcript
        </div>
        {isLive && (
          <div className="flex items-center gap-2 text-xs text-sentiment-crisis">
            <span className="w-1.5 h-1.5 rounded-full bg-sentiment-crisis animate-pulse" />
            Live · on device
          </div>
        )}
      </div>
      <div className="text-text-primary leading-relaxed whitespace-pre-wrap">
        {transcript || (
          <span className="text-text-tertiary">{placeholder}</span>
        )}
        {isLive && transcript && (
          <span className="inline-block w-1.5 h-4 ml-0.5 bg-accent animate-pulse-soft align-middle" />
        )}
      </div>
    </div>
  );
}
