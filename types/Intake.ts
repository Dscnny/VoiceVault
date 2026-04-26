/**
 * Intake types — ported from Swift `Protocols/IntakeServiceProtocol.swift`.
 *
 * These types power the Provider Telemetry Dashboard ("Diagnostic Dossier"),
 * the winning differentiator for the Catalyst for Care track.
 */

/** Mathematical direction of patient sentiment over a time window. */
export type SentimentTrend = "Improving" | "Stable" | "Declining";

/**
 * A direct quote from a journal entry associated with an extreme sentiment marker.
 * Designed for providers to review raw patient language without interpretation.
 * Never paraphrased, summarized, or modified by any model.
 */
export interface ClinicalQuote {
  /** The raw transcript excerpt (first ~200 characters). */
  text: string;
  /** The sentiment score that flagged this quote. */
  sentimentScore: number;
  /** When the entry was recorded. */
  timestamp: Date;
  /** Keywords extracted from the entry. */
  keywords: string[];
}

/** Aggregated keyword frequency across the analysis window. */
export interface KeywordCount {
  keyword: string;
  count: number;
}

/**
 * The clinical "intake dossier" handed to a provider before a session.
 *
 * Replaces 5+ hours of $150/hour intake with a quantitative, citation-rich
 * summary the provider can read in 90 seconds.
 */
export interface IntakeCheatSheet {
  periodStart: Date;
  periodEnd: Date;
  totalEntries: number;
  topKeywords: KeywordCount[];
  /** Quotes flagged for review — typically the most negative-sentiment entries. */
  criticalQuotes: ClinicalQuote[];
  trend: SentimentTrend;
  averageSentiment: number;
  minimumSentiment: number;
  maximumSentiment: number;
  /** Claude-generated SOAP-lite narrative for the provider. Optional — absent in fallback mode. */
  soapNarrative?: string;
  /** Dominant emotional theme across the analysis period. Optional — absent in fallback mode. */
  dominantTheme?: string;
  /** Most important topic for the provider to address in the upcoming session. Optional. */
  priorityFocus?: string;
  /** Risk flags: crisis-level sentiment, self-harm language, medication concerns. Optional. */
  riskFlags?: string[];
}
