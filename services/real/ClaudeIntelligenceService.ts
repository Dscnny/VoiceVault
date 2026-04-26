import type { SentimentResult } from "@/types/SentimentResult";
import type { IntelligenceService } from "@/services/interfaces/IntelligenceService";

export class ClaudeIntelligenceService implements IntelligenceService {
  isReady(): boolean {
    return true;
  }

  async warmup(): Promise<void> {
    // No-op for API
  }

  async analyze(transcript: string): Promise<SentimentResult> {
    if (!transcript.trim()) {
      throw new Error("Cannot analyze an empty transcript");
    }

    const response = await fetch("/api/intelligence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      throw new Error(`Intelligence API failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      score: data.score ?? 0,
      keywords: data.keywords ?? [],
      vector: [], // Vectors are kept empty since semantic search isn't implemented
    };
  }
}
