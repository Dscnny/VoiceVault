/**
 * ClaudeEmpathyService — empathetic responses powered by Claude Haiku via /api/empathy.
 *
 * Never imports @anthropic-ai/sdk directly — all API calls go through the
 * server-side proxy route so the API key stays server-side only.
 *
 * Implements the EmpathyService interface with an optional `transcript` second
 * parameter that passes the raw journal text to Claude for context-aware responses.
 *
 * Also exposes `continueConversation()` for multi-turn follow-up chat after
 * the initial journal response.
 */
import type { SentimentResult } from "@/types/SentimentResult";
import type { EmpathyResponse } from "@/types/Empathy";
import type { EmpathyService } from "@/services/interfaces/EmpathyService";
import { modeForScore } from "@/types/Empathy";

// MARK: - Types

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_HISTORY = 20;

// MARK: - Service

export class ClaudeEmpathyService implements EmpathyService {
  isAvailable(): boolean {
    return true;
  }

  /**
   * Generate an empathetic response for a journal entry.
   *
   * @param sentimentResult - NLP output (score + keywords)
   * @param transcript - Optional raw transcript for context-aware responses
   */
  async generateResponse(
    sentimentResult: SentimentResult,
    transcript?: string
  ): Promise<EmpathyResponse> {
    const mode = modeForScore(sentimentResult.score);

    const res = await fetch("/api/empathy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: transcript ?? "",
        sentimentScore: sentimentResult.score,
        keywords: sentimentResult.keywords,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(
        `Empathy API error ${res.status}: ${err.error ?? "unknown"}`
      );
    }

    const data: { message: string } = await res.json();
    return { message: data.message, mode };
  }

  /**
   * Continue the empathetic conversation after the initial journal response.
   *
   * @param userMessage - The user's follow-up message
   * @param history - Existing conversation history (capped to last 20 messages)
   */
  async continueConversation(
    userMessage: string,
    history: ConversationMessage[]
  ): Promise<EmpathyResponse> {
    const capped = history.slice(-MAX_HISTORY);
    const conversationHistory: ConversationMessage[] = [
      ...capped,
      { role: "user", content: userMessage },
    ];

    const res = await fetch("/api/empathy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationHistory }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(
        `Empathy API error ${res.status}: ${err.error ?? "unknown"}`
      );
    }

    const data: { message: string } = await res.json();
    return { message: data.message, mode: "neutral" };
  }
}
