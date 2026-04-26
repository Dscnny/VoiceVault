/**
 * JournalEntry — the primary persistence model representing a single voice journal recording.
 *
 * Ported from Swift `Models/JournalEntry.swift`.
 *
 * Each entry captures the full lifecycle of a voice note:
 * 1. Raw audio is recorded and transcribed on-device via the Web Speech API
 *    or transformers.js Whisper.
 * 2. The transcript is analyzed locally via DistilBERT for sentiment + keywords.
 * 3. A vector embedding is computed for semantic similarity search.
 *
 * This type is intentionally decoupled from any UI or service logic.
 * All business operations on entries go through `StorageService`.
 */
export interface JournalEntry {
  /** Stable, globally unique identifier for this entry. */
  id: string;

  /** The Auth0 user ID that owns this entry. Optional for backward compatibility with old local records. */
  userId?: string;

  /** The exact date and time the recording was initiated by the user. */
  timestamp: Date;

  /**
   * The verbatim, unprocessed transcript produced by on-device speech recognition.
   * May contain filler words, false starts, and recognition artifacts.
   * An empty string indicates transcription has not yet completed or failed.
   */
  rawTranscript: string;

  /**
   * A normalized sentiment polarity score in the range [-1.0, 1.0].
   * - -1.0 indicates extremely negative sentiment (distress, crisis language)
   * -  0.0 indicates neutral or mixed sentiment
   * - +1.0 indicates extremely positive sentiment (optimism, recovery language)
   *
   * Computed locally via DistilBERT sentiment classifier.
   */
  sentimentScore: number;

  /**
   * An ordered array of clinically relevant keywords extracted from the transcript.
   * Ordered by relevance/frequency descending.
   *
   * Example: ["sleep", "anxiety", "medication", "headache", "improvement"]
   */
  extractedKeywords: string[];

  /**
   * A dense vector representation of the transcript for semantic similarity search.
   * Generated via MiniLM sentence-transformers model.
   * Empty array if embedding has not been computed.
   */
  vectorEmbedding: number[];

  /** Duration of the original audio recording in seconds. Zero if not yet determined. */
  audioDurationSeconds: number;

  /** Optional reference key for raw audio data if retained. */
  audioReferenceKey?: string;

  /**
   * Indicates whether the entry has been fully processed (transcribed + analyzed).
   * UI can use this to show a processing spinner or partial state.
   */
  isFullyProcessed: boolean;
}

// MARK: - Convenience helpers (Swift extension equivalents)

export type SentimentLabel = "Negative" | "Neutral" | "Positive";

/**
 * Human-readable sentiment label derived from the numeric score.
 *
 * Thresholds calibrated for clinical relevance:
 * - Negative (< -0.25): May indicate distress — flag for review.
 * - Neutral (-0.25 to 0.25): Baseline emotional state.
 * - Positive (> 0.25): Indicates improvement or positive coping.
 */
export function sentimentLabel(score: number): SentimentLabel {
  if (score < -0.25) return "Negative";
  if (score > 0.25) return "Positive";
  return "Neutral";
}

/** Returns the first 120 characters of the transcript with ellipsis if longer. */
export function transcriptPreview(transcript: string): string {
  if (transcript.length <= 120) return transcript;
  return transcript.slice(0, 120) + "…";
}
