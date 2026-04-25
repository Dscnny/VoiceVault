/**
 * IntelligenceService interface — ported from Swift
 * `Protocols/IntelligenceServiceProtocol.swift`.
 *
 * Defines the contract for the on-device NLP intelligence pipeline:
 * sentiment analysis, keyword extraction, vector embedding generation.
 *
 * ALL processing MUST happen on-device. No network calls.
 */
import type { SentimentResult } from "@/types/SentimentResult";

export interface IntelligenceService {
  /**
   * Analyze a transcript and return sentiment + keywords + embedding.
   *
   * @param transcript — raw speech-to-text output
   * @returns SentimentResult with score in [-1, 1], keywords, and vector
   * @throws if transcript is empty or model fails to load
   */
  analyze(transcript: string): Promise<SentimentResult>;

  /** Whether the underlying ML models are loaded and ready. */
  isReady(): boolean;

  /**
   * Pre-warm the models. Call this on app start to avoid first-recording
   * latency. Resolves once models are downloaded and ready.
   */
  warmup(): Promise<void>;
}
