/**
 * MockEmpathyService — ported from Swift `Mocks/MockEmpathyService.swift`.
 *
 * Deterministic mock returning canned empathetic responses based on sentiment
 * thresholds. No LLM, no latency, instant results.
 */
import type { SentimentResult } from "@/types/SentimentResult";
import type { EmpathyResponse } from "@/types/Empathy";
import type { EmpathyService } from "@/services/interfaces/EmpathyService";
import { modeForScore } from "@/types/Empathy";

export class MockEmpathyService implements EmpathyService {
  /** Set true to test the unavailable code path. */
  simulateUnavailable = false;

  isAvailable(): boolean {
    return !this.simulateUnavailable;
  }

  async generateResponse(sentimentResult: SentimentResult): Promise<EmpathyResponse> {
    if (this.simulateUnavailable) {
      throw new Error("Empathy model unavailable");
    }

    const mode = modeForScore(sentimentResult.score);
    const message = (() => {
      switch (mode) {
        case "crisis":
          return "I hear you. What you're feeling is real, and you are not alone in this.";
        case "distress":
          return "It sounds like things have been really heavy lately. That takes a lot of strength to share.";
        case "neutral":
          return "Thank you for checking in with yourself today. That awareness matters.";
        case "positive":
          return "It's wonderful to hear some brightness in your voice. You're doing something right.";
      }
    })();

    return { message, mode };
  }
}
