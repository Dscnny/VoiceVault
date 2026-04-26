/**
 * ClaudeIntakeService — clinical dossier generation with Claude Sonnet narrative.
 *
 * Composes RealIntakeService for quantitative fields (averageSentiment, topKeywords,
 * criticalQuotes, trend, min/max) and enriches the result with a Claude Sonnet-
 * generated narrative via /api/intake.
 *
 * Falls back gracefully to the RealIntakeService result if the Claude API call
 * fails — the dashboard never breaks due to an API error.
 */
import type { IntakeCheatSheet, KeywordCount, SentimentTrend } from "@/types/Intake";
import type { IntakeService } from "@/services/interfaces/IntakeService";
import type { StorageService } from "@/services/interfaces/StorageService";
import { RealIntakeService } from "@/services/real/RealIntakeService";

// MARK: - Service

export class ClaudeIntakeService implements IntakeService {
  private realIntake: RealIntakeService;

  constructor(private storage: StorageService) {
    this.realIntake = new RealIntakeService(storage);
  }

  /**
   * Generate a cheat sheet with quantitative stats + Claude narrative.
   * Falls back to quantitative-only if the Claude API call fails.
   */
  async generateCheatSheet(days = 7): Promise<IntakeCheatSheet> {
    // 1. Compute all quantitative fields via the rule-based service
    const base = await this.realIntake.generateCheatSheet(days);

    if (base.totalEntries === 0) {
      return base;
    }

    // 2. Fetch the same entries for the Claude prompt
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    const entries = await this.storage.fetchEntries(startDate, endDate);

    // 3. Call Claude for narrative fields; fall back on any error
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries, days }),
      });

      if (!res.ok) {
        // Non-2xx: return base result without narrative
        return base;
      }

      const narrative: {
        summary?: string;
        dominantTheme?: string;
        priorityFocus?: string;
        riskFlags?: string[];
      } = await res.json();

      return {
        ...base,
        soapNarrative: narrative.summary,
        dominantTheme: narrative.dominantTheme,
        priorityFocus: narrative.priorityFocus,
        riskFlags: narrative.riskFlags,
      };
    } catch {
      // Network or parse error: return base result without narrative
      return base;
    }
  }

  async topKeywords(
    startDate: Date,
    endDate: Date,
    limit?: number
  ): Promise<KeywordCount[]> {
    return this.realIntake.topKeywords(startDate, endDate, limit);
  }

  async sentimentTrend(startDate: Date, endDate: Date): Promise<SentimentTrend> {
    return this.realIntake.sentimentTrend(startDate, endDate);
  }
}
