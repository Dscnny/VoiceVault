/**
 * EmpathyService interface — ported from Swift
 * `Protocols/EmpathyServiceProtocol.swift`.
 *
 * Generates short, warm, mode-aware "nudges" after each journal entry.
 * Never clinical, never numeric, never advisory.
 */
import type { SentimentResult } from "@/types/SentimentResult";
import type { EmpathyResponse } from "@/types/Empathy";

export interface EmpathyService {
  /** Whether the response generator is available on this device. */
  isAvailable(): boolean;

  /**
   * Generate an empathetic response keyed off sentiment severity.
   * Mode is selected by the SentimentResult.score and bounds the tone.
   */
  generateResponse(sentimentResult: SentimentResult): Promise<EmpathyResponse>;
}
