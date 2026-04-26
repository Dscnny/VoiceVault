"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
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

export default function PatientPage() {
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

      const empathyResult = await services.empathy.generateResponse(sentimentResult);
      setEmpathy(empathyResult);

      const entry: JournalEntry = {
        id: crypto.randomUUID(),
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
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="text-xs text-text-tertiary tabular-nums">
            {warmupStatus === "pending" && "Loading models…"}
            {warmupStatus === "ready" && "Models ready · on-device"}
            {warmupStatus === "failed" && "Using fallback intelligence"}
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            How are you doing tonight?
          </h1>
          <p className="text-text-secondary text-sm">
            Speak for as long as you'd like. Nothing leaves this device.
          </p>
        </div>

        <div className="mb-10 flex justify-center">
          <RecordButton
            state={state}
            onClick={handleClick}
            onPause={handlePause}
            onResume={handleResume}
            onUpload={finishRecording}
          />
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-sentiment-crisis/30 bg-sentiment-crisis/10 text-sentiment-crisis p-4 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {(displayTranscript || state === "recording" || state === "paused") && (
          <div className="mb-4">
            <TranscriptDisplay
              transcript={displayTranscript}
              isLive={state === "recording"}
              isPaused={state === "paused"}
            />
          </div>
        )}

        {sentiment && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-bg-card px-5 py-4">
              <div className="text-sm text-text-secondary">Sentiment</div>
              <SentimentBadge score={sentiment.score} />
            </div>
            {empathy && <NudgeCard response={empathy} />}
            <KeywordPills keywords={sentiment.keywords} />
          </div>
        )}
      </div>
    </main>
  );
}