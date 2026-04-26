"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Database, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "@/lib/serviceContainer";
import { SummaryCard } from "@/components/provider/SummaryCard";
import { SentimentTimeline } from "@/components/provider/SentimentTimeline";
import { KeywordFrequency } from "@/components/provider/KeywordFrequency";
import { CriticalQuotes } from "@/components/provider/CriticalQuotes";
import { MockStorageService } from "@/services/mock/MockStorageService";
import { DexieStorageService } from "@/services/real/DexieStorageService";
import type { IntakeCheatSheet } from "@/types/Intake";
import type { JournalEntry } from "@/types/JournalEntry";

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export default function ProviderPage() {
  const services = useServices();
  const [sheet, setSheet] = useState<IntakeCheatSheet | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowDays, setWindowDays] = useState(30);

  const load = async (days: number) => {
    setLoading(true);
    try {
      // For the provider dashboard we want a full picture, so analyze the
      // last `days` days of entries.
      const end = new Date();
      const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
      const all = await services.storage.fetchEntries(start, end);
      setEntries(all);
      const cheatSheet = await services.intake.generateCheatSheet(days);
      setSheet(cheatSheet);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(windowDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowDays]);

  const seedSampleData = async () => {
    // If running on the real Dexie service, seed it from the mock samples.
    if (services.storage instanceof DexieStorageService) {
      const mockSamples = MockStorageService.withSampleData();
      const samples = await mockSamples.fetchAll("newestFirst");
      await (services.storage as DexieStorageService).seedSampleDataIfEmpty(samples);
      await load(windowDays);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob w-[500px] h-[500px] bg-cyan-200 top-[-5%] left-[40%] animate-blob-morph" />
      <div className="blob w-[400px] h-[400px] bg-violet-200 bottom-[10%] right-[-5%] animate-blob-morph" style={{ animationDelay: "3s" }} />
      <div className="blob w-[350px] h-[350px] bg-fuchsia-100 top-[50%] left-[-5%] animate-blob-morph" style={{ animationDelay: "5s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24 sm:pt-12">

        {/* ─── Nav bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12 glass-strong rounded-2xl px-6 py-3.5 shadow-glass"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-cyan-600 hover:text-teal-600 text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
          <div className="flex items-center gap-3">
            <select
              value={windowDays}
              onChange={(e) => setWindowDays(Number(e.target.value))}
              className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-cyan-400 outline-none cursor-pointer hover:bg-white transition-colors"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <button
              onClick={() => load(windowDays)}
              className="p-2.5 rounded-xl glass shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </motion.div>

        {/* ─── Hero heading ─── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-12"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-800 leading-[0.9] mb-3">
            Patient
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500">
              Dossier
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl font-medium">
            Pre-session telemetry · what 5 hours of intake would have told you
          </p>
        </motion.div>

        {/* ─── Loading ─── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-24"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-400 animate-pulse-recording shadow-lg shadow-cyan-200" />
                <span className="text-slate-500 font-bold text-lg">Computing dossier…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Empty state ─── */}
        <AnimatePresence>
          {!loading && entries.length === 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="rounded-4xl glass shadow-glass-lg p-16 text-center relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-40" />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center shadow-xl shadow-cyan-200 mx-auto mb-8">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 mb-4">No entries yet</h2>
                <p className="text-slate-500 font-medium text-lg max-w-md mx-auto mb-10">
                  Record some entries from the patient view, or seed the dashboard
                  with sample clinical data to preview the experience.
                </p>
                <button
                  onClick={seedSampleData}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 text-white text-base font-bold shadow-xl shadow-cyan-200 hover:shadow-2xl hover:shadow-cyan-300 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Seed sample clinical data
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Dashboard Bento ─── */}
        <AnimatePresence>
          {!loading && sheet && entries.length > 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="space-y-5"
            >
              {/* Summary bento row */}
              <SummaryCard sheet={sheet} />

              {/* Chart + Keywords bento row */}
              <div className="grid grid-cols-4 lg:grid-cols-12 gap-5">
                <div className="col-span-4 lg:col-span-8">
                  <SentimentTimeline entries={entries} />
                </div>
                <div className="col-span-4 lg:col-span-4">
                  <KeywordFrequency keywords={sheet.topKeywords} />
                </div>
              </div>

              {/* Quotes */}
              <CriticalQuotes quotes={sheet.criticalQuotes} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
