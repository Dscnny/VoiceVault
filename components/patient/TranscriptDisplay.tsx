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
    <div className="rounded-4xl glass shadow-glass-lg p-10 sm:p-12 min-h-[200px] relative overflow-hidden transition-all duration-500">
      {/* Decorative glow */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-violet-100 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Transcript
          </div>
          {isLive && (
            <div className="flex items-center gap-2.5 text-xs font-bold text-rose-500 bg-rose-50/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-rose-100">
              <span className="relative flex w-2.5 h-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-rose-500" />
              </span>
              Recording
            </div>
          )}
        </div>

        <div className="text-slate-700 text-lg sm:text-xl font-medium leading-relaxed whitespace-pre-wrap min-h-[100px]">
          {transcript || (
            <span className="text-slate-300 font-normal italic">{placeholder}</span>
          )}
          {isLive && transcript && (
            <span className="inline-block w-0.5 h-6 ml-1 bg-violet-500 rounded-full animate-pulse-soft align-middle" />
          )}
        </div>
      </div>
    </div>
  );
}
