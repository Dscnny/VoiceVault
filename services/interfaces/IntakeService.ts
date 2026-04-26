/**
 * IntakeService interface — ported from Swift
 * `Protocols/IntakeServiceProtocol.swift`.
 *
 * Generates the "Diagnostic Dossier" / "Intake Cheat Sheet" for providers.
 * This is the winning differentiator for the Catalyst for Care track.
 */
import type {
  IntakeCheatSheet,
  KeywordCount,
  SentimentTrend,
} from "@/types/Intake";

export interface IntakeService {
  /**
   * Generate a clinical intake cheat sheet from the last N days of entries.
   *
   * @param userId - Auth0 user ID
   * @param days — how many days back to analyze (default: 7)
   */
  generateCheatSheet(userId: string, days?: number): Promise<IntakeCheatSheet>;

  /** Top-N keywords across the analysis window, ordered by frequency. */
  topKeywords(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit?: number
  ): Promise<KeywordCount[]>;

  /** Linear-regression trend on chronologically ordered sentiment scores. */
  sentimentTrend(userId: string, startDate: Date, endDate: Date): Promise<SentimentTrend>;
}
