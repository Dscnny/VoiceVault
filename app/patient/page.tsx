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
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-800 leading-[0.9] mb-4">
            How are you
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400">
              doing tonight?
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl font-medium">
            Speak for as long as you'd like. Nothing leaves this device.
          </p>
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

        {/* ─── Transcript + Results Bento ─── */}
        <AnimatePresence>
          {(displayTranscript || state === "recording" || state === "paused") && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="mb-8"
            >
              <TranscriptDisplay
                transcript={displayTranscript}
                isLive={state === "recording"}
                isPaused={state === "paused"}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sentiment && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
            >
              {/* Bento grid for results */}
              <div className="grid grid-cols-4 gap-4">
                {/* Sentiment score — big tile */}
                <div className="col-span-4 sm:col-span-2 rounded-4xl glass shadow-bento p-10 relative overflow-hidden group hover:shadow-bento-hover transition-all duration-500">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-100 rounded-full blur-3xl opacity-40" />
                  <div className="relative z-10">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Sentiment</div>
                    <div className={`text-6xl sm:text-7xl font-black tabular-nums tracking-tighter mb-3 ${
                      sentiment.score > 0.25 ? "text-emerald-600" :
                      sentiment.score < -0.25 ? "text-rose-600" : "text-slate-800"
                    }`}>
                      {sentiment.score >= 0 ? "+" : ""}{sentiment.score.toFixed(2)}
                    </div>
                    <SentimentBadge score={sentiment.score} />
                  </div>
                </div>

                {/* Keywords — smaller tiles */}
                <div className="col-span-4 sm:col-span-2 rounded-4xl glass shadow-bento p-10 relative overflow-hidden">
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-100 rounded-full blur-3xl opacity-40" />
                  <KeywordPills keywords={sentiment.keywords} />
                </div>

                {/* Nudge — full width */}
                {empathy && (
                  <div className="col-span-4">
                    <NudgeCard response={empathy} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}