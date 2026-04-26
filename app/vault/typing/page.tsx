"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useServices } from "@/lib/serviceContainer";
import { TypingQuote } from "@/components/patient/TypingQuote";
import { SentimentBadge } from "@/components/patient/SentimentBadge";
import { NudgeCard } from "@/components/patient/NudgeCard";
import { getRandomQuote } from "@/lib/affirmationQuotes";
import type { SentimentResult } from "@/types/SentimentResult";
import type { EmpathyResponse } from "@/types/Empathy";
import type { JournalEntry } from "@/types/JournalEntry";

type Phase = "idle" | "typing" | "complete" | "analyzing";

export default function VaultTypingPage() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();
  const services = useServices();
  const [quote, setQuote] = useState<string>(() => getRandomQuote());
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [empathy, setEmpathy] = useState<EmpathyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const phaseRef = useRef<Phase>(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/");
  }, [isLoading, isAuthenticated, router]);

  const loadNewQuote = useCallback(() => {
    setQuote(getRandomQuote());
    setTyped("");
    setPhase("idle");
    setSentiment(null);
    setEmpathy(null);
    setError(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const current = phaseRef.current;
      if (current === "analyzing" || current === "complete") return;

      if (e.key === "Escape") {
        loadNewQuote();
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        if (current !== "typing") return;
        setTyped((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (current === "idle") setPhase("typing");
        setTyped((prev) => (prev.length < quote.length ? prev + e.key : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quote, loadNewQuote]);

  useEffect(() => {
    if (phaseRef.current !== "typing" || typed.length !== quote.length) return;

    let cancelled = false;

    const run = async () => {
      setPhase("analyzing");
      try {
        const sr = await services.intelligence.analyze(quote);
        if (cancelled) return;
        setSentiment(sr);

        const empathyService = services.empathy as unknown as {
          generateResponse(r: SentimentResult, t?: string): Promise<EmpathyResponse>;
        };
        const er = await empathyService.generateResponse(sr, quote);
        if (cancelled) return;
        setEmpathy(er);

        const entry: JournalEntry = {
          id: crypto.randomUUID(),
          userId: user?.sub,
          timestamp: new Date(),
          rawTranscript: quote,
          sentimentScore: sr.score,
          extractedKeywords: sr.keywords,
          vectorEmbedding: sr.vector,
          audioDurationSeconds: 0,
          isFullyProcessed: true,
        };
        await services.storage.save(entry);
        if (cancelled) return;
        setPhase("complete");
      } catch (err: unknown) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong while analyzing");
        setPhase("complete");
      }
    };

    run();
    return () => { cancelled = true; };
  }, [typed, quote, services, user]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 animate-pulse shadow-lg shadow-blue-200" />
      </main>
    );
  }

  const accuracy =
    typed.length > 0 && quote.length > 0
      ? Math.round(
          (typed.split("").filter((c, i) => c === quote[i]).length / quote.length) * 100
        )
      : 0;

  const progressPct = quote.length > 0 ? (typed.length / quote.length) * 100 : 0;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="blob w-[400px] h-[400px] bg-blue-200 top-[-5%] right-[10%] animate-blob-morph" />
      <div className="blob w-[350px] h-[350px] bg-violet-200 bottom-[10%] left-[-5%] animate-blob-morph" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-8 pb-24 sm:pt-12">

        {/* ─── Nav bar ─── */}
        <div className="flex items-center justify-between mb-12 glass-strong rounded-2xl px-6 py-3.5 shadow-glass">
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 font-bold text-blue-500 hover:text-blue-600 text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Vault
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Typing Journal
          </span>
        </div>

        {/* ─── IDLE phase ─── */}
        {phase === "idle" && (
          <div className="space-y-10">
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-slate-800 leading-[0.9] mb-4">
                Words of
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500">
                  affirmation
                </span>
              </h1>
            </div>
            <div className="glass rounded-4xl shadow-glass p-10">
              <TypingQuote quote={quote} typed="" isComplete={false} />
            </div>
            <div className="text-center space-y-1.5">
              <p className="text-text-secondary font-medium">Start typing to begin</p>
              <p className="text-text-tertiary text-sm">Your thoughts stay on this device</p>
            </div>
          </div>
        )}

        {/* ─── TYPING phase ─── */}
        {phase === "typing" && (
          <div className="space-y-6">
            <div className="glass rounded-4xl shadow-glass p-10">
              <TypingQuote quote={quote} typed={typed} isComplete={false} />
            </div>
            <div className="w-full h-1 bg-bg-card rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-75"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={loadNewQuote}
                className="text-text-tertiary hover:text-text-secondary text-sm transition-colors"
              >
                skip →
              </button>
            </div>
          </div>
        )}

        {/* ─── ANALYZING phase ─── */}
        {phase === "analyzing" && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <p className="text-text-secondary font-semibold animate-pulse-soft">
              Reading between the lines…
            </p>
            <p className="text-text-tertiary text-sm">On device · nothing uploaded</p>
          </div>
        )}

        {/* ─── COMPLETE phase ─── */}
        {phase === "complete" && (
          <div className="space-y-6">
            <div className="glass rounded-4xl shadow-glass p-10">
              <TypingQuote quote={quote} typed={typed} isComplete={true} />
            </div>

            <div className="glass rounded-3xl shadow-glass px-8 py-5 flex items-center justify-between">
              <span className="text-text-tertiary text-sm font-bold uppercase tracking-wider">
                Accuracy
              </span>
              <span className="text-text-primary text-3xl font-black tabular-nums">
                {accuracy}%
              </span>
            </div>

            {error && (
              <div className="rounded-3xl border border-rose-200/60 bg-rose-50/60 text-rose-600 p-5 text-sm font-semibold">
                {error}
              </div>
            )}

            {sentiment && (
              <div className="flex justify-center">
                <SentimentBadge score={sentiment.score} />
              </div>
            )}

            {empathy && <NudgeCard response={empathy} />}

            <button
              onClick={loadNewQuote}
              className="w-full rounded-xl border border-border bg-bg-card hover:bg-bg-elevated transition-colors py-4 font-bold text-text-secondary text-sm"
            >
              Try another
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
