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
import type { IntakeCheatSheet, KeywordCount, SentimentTrend, PatientDossier } from "@/types/Intake";
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
  async generateCheatSheet(userId: string, days = 7): Promise<IntakeCheatSheet> {
    // 1. Compute all quantitative fields via the rule-based service
    const base = await this.realIntake.generateCheatSheet(userId, days);

    if (base.totalEntries === 0) {
      return base;
    }

    // 2. Fetch the existing dossier to support incremental updates
    const existingDossier = await this.storage.fetchDossier(userId);
    
    // 3. Find only new entries that occurred after the dossier was last updated
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    const allEntries = await this.storage.fetchEntries(startDate, endDate, userId);
    
    const newEntries = existingDossier 
      ? allEntries.filter(e => e.timestamp > existingDossier.lastUpdated)
      : allEntries;

    // If there's an existing dossier and no new entries, just return the existing narrative
    if (existingDossier && newEntries.length === 0) {
      return {
        ...base,
        soapNarrative: existingDossier.soapNarrative,
        dominantTheme: existingDossier.dominantTheme,
        priorityFocus: existingDossier.priorityFocus,
        riskFlags: existingDossier.riskFlags,
      };
    }

    // 4. Call Claude to update or generate the narrative
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ existingDossier, newEntries, days }),
      });

      if (!res.ok) {
        // Non-2xx: return base result without narrative, or with old narrative if exists
        return existingDossier ? {
          ...base,
          soapNarrative: existingDossier.soapNarrative,
          dominantTheme: existingDossier.dominantTheme,
          priorityFocus: existingDossier.priorityFocus,
          riskFlags: existingDossier.riskFlags,
        } : base;
      }

      const narrative: {
        summary?: string;
        dominantTheme?: string;
        priorityFocus?: string;
        riskFlags?: string[];
      } = await res.json();

      // 5. Save the updated dossier back to Dexie
      const updatedDossier: PatientDossier = {
        userId,
        soapNarrative: narrative.summary || "",
        dominantTheme: narrative.dominantTheme || "",
        priorityFocus: narrative.priorityFocus || "",
        riskFlags: narrative.riskFlags || [],
        lastUpdated: new Date(),
      };
      await this.storage.saveDossier(updatedDossier);

      return {
        ...base,
        soapNarrative: updatedDossier.soapNarrative,
        dominantTheme: updatedDossier.dominantTheme,
        priorityFocus: updatedDossier.priorityFocus,
        riskFlags: updatedDossier.riskFlags,
      };
    } catch {
      // Network or parse error: return base result
      return existingDossier ? {
        ...base,
        soapNarrative: existingDossier.soapNarrative,
        dominantTheme: existingDossier.dominantTheme,
        priorityFocus: existingDossier.priorityFocus,
        riskFlags: existingDossier.riskFlags,
      } : base;
    }
  }

  async topKeywords(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit?: number
  ): Promise<KeywordCount[]> {
    return this.realIntake.topKeywords(userId, startDate, endDate, limit);
  }

  async sentimentTrend(userId: string, startDate: Date, endDate: Date): Promise<SentimentTrend> {
    return this.realIntake.sentimentTrend(userId, startDate, endDate);
  }
}
