"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "@/lib/serviceContainer";
import { RecordButton, type RecordState } from "@/components/patient/RecordButton";
import { TranscriptDisplay } from "@/components/patient/TranscriptDisplay";
import { NudgeCard } from "@/components/patient/NudgeCard";
import { KeywordPills } from "@/components/patient/KeywordPills";
import { SentimentBadge } from "@/components/patient/SentimentBadge";
import { CrabIndicator } from "@/components/patient/CrabIndicator";
import { StarfishIndicator } from "@/components/patient/StarfishIndicator";
import type { RecordingController } from "@/services/interfaces/AudioTranscriptionService";
import type { JournalEntry } from "@/types/JournalEntry";
import type { SentimentResult } from "@/types/SentimentResult";
import type { EmpathyResponse } from "@/types/Empathy";

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export default function PatientPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const services = useServices();
  const [state, setState] = useState<RecordState>("idle");
  const [transcript, setTranscript] = useState("");
  const [partial, setPartial] = useState("");
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [empathy, setEmpathy] = useState<EmpathyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warmupStatus, setWarmupStatus] = useState<"pending" | "ready" | "failed">("pending");
  const controllerRef = useRef<RecordingController | null>(null);

  useEffect(() => {
    let cancelled = false;
    services.intelligence
      .warmup()
      .then(() => { if (!cancelled) setWarmupStatus("ready"); })
      .catch((e) => {
        console.warn("Intelligence warmup failed", e);
        if (!cancelled) setWarmupStatus("failed");
      });
    return () => { cancelled = true; };
  }, [services]);

  const reset = () => {
    setTranscript("");
    setPartial("");
    setSentiment(null);
    setEmpathy(null);
    setError(null);
  };

  const startRecording = async () => {
    reset();
    setState("preparing");
    try {
      const controller = await services.transcription.startRecording(
        { enablePartialResults: true, locale: "en-US" },
        (p) => setPartial(p)
      );
      controllerRef.current = controller;
      setState("recording");
    } catch (e: any) {
      setError(e?.message ?? "Could not start recording");
      setState("idle");
    }
  };

  const handlePause = () => {
    controllerRef.current?.pause?.();
    setState("paused");
  };

  const handleResume = () => {
    controllerRef.current?.resume?.();
    setState("recording");
  };

  const finishRecording = async () => {
    const controller = controllerRef.current;
    if (!controller) return;
    setState("processing");
    try {
      const result = await controller.stop();
      controllerRef.current = null;
      const finalText = (transcript || partial).trim();
      setTranscript(finalText);
      setPartial("");

      if (!finalText) {
        setError("No speech detected. Try again in a quieter environment.");
        setState("idle");
        return;
      }

      const sentimentResult = await services.intelligence.analyze(finalText);
      setSentiment(sentimentResult);

      // Generate empathetic nudge — cast through unknown so the optional
      // transcript arg (added in ClaudeEmpathyService) can be passed without
      // modifying the locked EmpathyService interface.
      const empathyService = services.empathy as unknown as {
        generateResponse(r: SentimentResult, t?: string): Promise<EmpathyResponse>;
      };
      const empathyResult = await empathyService.generateResponse(sentimentResult, finalText);
      setEmpathy(empathyResult);

      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        userId: user?.sub, // Tie to auth account
        timestamp: new Date(),
        rawTranscript: finalText,
        sentimentScore: sentimentResult.score,
        extractedKeywords: sentimentResult.keywords,
        vectorEmbedding: sentimentResult.vector,
        audioDurationSeconds: result.durationSeconds,
        isFullyProcessed: true,
      };
      await services.storage.save(entry);
      setState("idle");
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong while analyzing");
      setState("idle");
    }
  };

  const handleClick = () => {
    if (state === "idle") return startRecording();
  };

  const displayTranscript = transcript || partial;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob w-[400px] h-[400px] bg-violet-200 top-[-5%] right-[10%] animate-blob-morph" />
      <div className="blob w-[350px] h-[350px] bg-fuchsia-200 bottom-[10%] left-[-5%] animate-blob-morph" style={{ animationDelay: "3s" }} />
      <div className="blob w-[300px] h-[300px] bg-cyan-100 top-[40%] right-[-5%] animate-blob-morph" style={{ animationDelay: "5s" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-8 pb-24 sm:pt-12">

        {/* ─── Nav bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12 glass-strong rounded-2xl px-6 py-3.5 shadow-glass"
        >
          <Link
            href="/"
            className="inline-flex items-center font-black tracking-tight text-violet-600 hover:text-fuchsia-600 text-lg transition-colors"
          >
            VoiceVault
          </Link>
          <div className="flex items-center gap-2.5 text-xs font-bold tabular-nums uppercase tracking-wider">
            <span className={`w-2 h-2 rounded-full ${
              warmupStatus === "ready" ? "bg-emerald-400" :
              warmupStatus === "pending" ? "bg-amber-400 animate-pulse" : "bg-slate-300"
            }`} />
            <span className="text-slate-500">
              {warmupStatus === "pending" && "Loading models…"}
              {warmupStatus === "ready" && "On-device · ready"}
              {warmupStatus === "failed" && "Fallback mode"}
            </span>
          </div>
        </motion.div>

        {/* ─── Hero text ─── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-800 mb-4">
            click the bubble to talk!
          </h1>
        </motion.div>

        {/* ─── The Orb ─── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-16"
        >
          <RecordButton
            state={state}
            onClick={handleClick}
            onPause={handlePause}
            onResume={handleResume}
            onUpload={finishRecording}
          />
        </motion.div>

        {/* ─── Error ─── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-8 rounded-3xl border border-rose-200/60 bg-rose-50/60 backdrop-blur-xl text-rose-600 p-6 text-sm font-semibold flex items-start gap-3 shadow-glass"
            >
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Conversation Box ─── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="relative mt-12 mb-8 bg-white/40 backdrop-blur-md rounded-3xl border-4 border-indigo-400 shadow-[0_0_40px_rgba(129,140,248,0.3)] p-6 sm:p-10 min-h-[400px] flex flex-col justify-between"
        >
          {/* User Transcript Area (Upper Right) */}
          <div className="flex flex-col items-end w-full mb-8 relative z-30">
            <div className="max-w-[85%] sm:max-w-[70%] bg-blue-100/90 backdrop-blur-sm p-5 rounded-3xl rounded-tr-sm shadow-sm border border-blue-200 text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
              {displayTranscript || state === "recording" || state === "paused" ? (
                <>
                  {displayTranscript}
                  {state === "recording" && (
                    <span className="inline-block w-1.5 h-5 ml-1 bg-blue-500 rounded-full animate-pulse align-middle" />
                  )}
                </>
              ) : (
                <span className="text-slate-400 italic">your words will appear here.</span>
              )}
            </div>
          </div>

          {/* AI Response Area (Lower Left) */}
          <div className="flex flex-col items-start w-full relative z-30">
            <div className="max-w-[85%] sm:max-w-[70%] bg-white/90 backdrop-blur-sm p-5 rounded-3xl rounded-tl-sm shadow-sm border border-white/50 text-slate-700 text-lg leading-relaxed">
              {state === "processing" ? (
                <span className="text-slate-400 italic flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              ) : empathy ? (
                <div className="flex flex-col gap-3">
                  <p className="font-medium text-slate-700">{empathy.message}</p>
                  {sentiment && (
                    <div className="flex flex-wrap gap-2 items-center mt-2">
                      <SentimentBadge score={sentiment.score} mode={empathy.mode} />
                      <KeywordPills keywords={sentiment.keywords} label="" />
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-slate-400 italic">VoiceVault will respond here.</span>
              )}
            </div>
          </div>

          {/* Crab (Bottom Left) */}
          <div className="absolute -bottom-10 -left-6 z-40 pointer-events-none">
            <CrabIndicator isActive={state === "processing" || empathy !== null} />
          </div>

          {/* Starfish (Bottom Right) */}
          <div className="absolute -bottom-8 -right-6 z-40 pointer-events-none">
            <StarfishIndicator isActive={state === "recording"} />
          </div>
        </motion.div>

      </div>
    </main>
  );
}