/**
 * Empathy types — ported from Swift `Protocols/EmpathyServiceProtocol.swift`.
 */

/**
 * Persona mode that governs the response tone and constraints.
 *
 * Determined by SentimentResult.score:
 * - crisis:   score < -0.8  → Validation-only. Acknowledge pain. No advice.
 * - distress: score < -0.4  → Gentle support. Normalize feelings.
 * - neutral:  score in [-0.4, 0.4] → Warm acknowledgment. Encourage reflection.
 * - positive: score > 0.4   → Celebrate progress. Reinforce growth.
 */
export type EmpathyMode = "crisis" | "distress" | "neutral" | "positive";

export interface EmpathyResponse {
  /** Short, warm message (1-2 sentences). Never clinical, never numeric. */
  message: string;
  /** The persona mode used for generation. */
  mode: EmpathyMode;
}

export function modeForScore(score: number): EmpathyMode {
  if (score < -0.8) return "crisis";
  if (score < -0.4) return "distress";
  if (score > 0.4) return "positive";
  return "neutral";
}
