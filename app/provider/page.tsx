"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Database, RefreshCw } from "lucide-react";
import { useServices } from "@/lib/serviceContainer";
import { SummaryCard } from "@/components/provider/SummaryCard";
import { SentimentTimeline } from "@/components/provider/SentimentTimeline";
import { KeywordFrequency } from "@/components/provider/KeywordFrequency";
import { CriticalQuotes } from "@/components/provider/CriticalQuotes";
import { MockStorageService } from "@/services/mock/MockStorageService";
import { DexieStorageService } from "@/services/real/DexieStorageService";
import type { IntakeCheatSheet } from "@/types/Intake";
import type { JournalEntry } from "@/types/JournalEntry";

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
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <select
              value={windowDays}
              onChange={(e) => setWindowDays(Number(e.target.value))}
              className="bg-bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-accent outline-none"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <button
              onClick={() => load(windowDays)}
              className="p-2 rounded-lg border border-border bg-bg-card hover:bg-bg-elevated transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-1">
            Patient Dossier
          </h1>
          <p className="text-text-secondary text-sm">
            Pre-session telemetry · what 5 hours of intake would have told you
          </p>
        </div>

        {loading && (
          <div className="text-text-tertiary text-sm py-12 text-center">
            Computing dossier…
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="rounded-2xl border border-border bg-bg-card p-10 text-center">
            <Database className="w-10 h-10 text-text-tertiary mx-auto mb-4" />
            <h2 className="text-text-primary font-medium mb-2">No entries yet</h2>
            <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
              Record some entries from the patient view, or seed the dashboard
              with sample clinical data to preview the experience.
            </p>
            <button
              onClick={seedSampleData}
              className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              Seed sample clinical data
            </button>
          </div>
        )}

        {!loading && sheet && entries.length > 0 && (
          <div className="space-y-6">
            <SummaryCard sheet={sheet} />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SentimentTimeline entries={entries} />
              </div>
              <KeywordFrequency keywords={sheet.topKeywords} />
            </div>
            <CriticalQuotes quotes={sheet.criticalQuotes} />
          </div>
        )}
      </div>
    </main>
  );
}
