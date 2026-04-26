/**
 * SentimentResult — the complete output of the on-device NLP pipeline.
 *
 * Ported from Swift `Models/SentimentResult.swift`.
 *
 * Returned by `IntelligenceService.analyze(transcript)` after processing a
 * raw transcript through sentiment analysis, keyword extraction, and vector
 * embedding generation.
 */
export interface SentimentResult {
  /**
   * Normalized sentiment polarity in [-1.0, 1.0].
   * -1.0 = extremely negative (crisis language)
   *  0.0 = neutral or mixed
   * +1.0 = extremely positive (recovery language)
   */
  score: number;

  /**
   * Clinically relevant keywords ordered by relevance descending.
   * Typically includes: medical terms, emotional descriptors, behavioral markers.
   */
  keywords: string[];

  /**
   * Always [] until semantic search feature is implemented.
   * Reserved for future MiniLM or Claude-based similarity search.
   */
  vector: number[];
}

export const emptySentimentResult: SentimentResult = {
  score: 0,
  keywords: [],
  vector: [],
};

export function sentimentResultLabel(result: SentimentResult): "Negative" | "Neutral" | "Positive" {
  if (result.score < -0.25) return "Negative";
  if (result.score > 0.25) return "Positive";
  return "Neutral";
}
