/**
 * RealIntakeService — computes the clinical dossier from journal entries
 * stored in the StorageService.
 *
 * Replaces the Swift IntakeService. Pure aggregation logic — no models needed.
 * This is the engine behind the Provider Telemetry Dashboard.
 */
import type {
  ClinicalQuote,
  IntakeCheatSheet,
  KeywordCount,
  SentimentTrend,
} from "@/types/Intake";
import type { IntakeService } from "@/services/interfaces/IntakeService";
import type { StorageService } from "@/services/interfaces/StorageService";

export class RealIntakeService implements IntakeService {
  constructor(private storage: StorageService) {}

  async generateCheatSheet(days = 7): Promise<IntakeCheatSheet> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    const entries = await this.storage.fetchEntries(startDate, endDate);

    if (entries.length === 0) {
      return {
        periodStart: startDate,
        periodEnd: endDate,
        totalEntries: 0,
        topKeywords: [],
        criticalQuotes: [],
        trend: "Stable",
        averageSentiment: 0,
        minimumSentiment: 0,
        maximumSentiment: 0,
      };
    }

    const scores = entries.map((e) => e.sentimentScore);
    const averageSentiment = scores.reduce((a, b) => a + b, 0) / scores.length;
    const minimumSentiment = Math.min(...scores);
    const maximumSentiment = Math.max(...scores);

    const topKeywords = aggregateKeywords(entries.flatMap((e) => e.extractedKeywords)).slice(0, 5);

    const criticalQuotes: ClinicalQuote[] = entries
      .filter((e) => e.sentimentScore < -0.3)
      .sort((a, b) => a.sentimentScore - b.sentimentScore)
      .slice(0, 3)
      .map((e) => ({
        text:
          e.rawTranscript.length > 200
            ? e.rawTranscript.slice(0, 200) + "…"
            : e.rawTranscript,
        sentimentScore: e.sentimentScore,
        timestamp: e.timestamp,
        keywords: e.extractedKeywords.slice(0, 3),
      }));

    const trend = computeTrend(
      [...entries].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .map((e) => e.sentimentScore)
    );

    return {
      periodStart: startDate,
      periodEnd: endDate,
      totalEntries: entries.length,
      topKeywords,
      criticalQuotes,
      trend,
      averageSentiment,
      minimumSentiment,
      maximumSentiment,
    };
  }

  async topKeywords(
    startDate: Date,
    endDate: Date,
    limit = 5
  ): Promise<KeywordCount[]> {
    const entries = await this.storage.fetchEntries(startDate, endDate);
    return aggregateKeywords(entries.flatMap((e) => e.extractedKeywords)).slice(0, limit);
  }

  async sentimentTrend(startDate: Date, endDate: Date): Promise<SentimentTrend> {
    const entries = await this.storage.fetchEntries(startDate, endDate);
    const ordered = [...entries].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return computeTrend(ordered.map((e) => e.sentimentScore));
  }
}

function aggregateKeywords(all: string[]): KeywordCount[] {
  const counts = new Map<string, number>();
  for (const k of all) {
    const key = k.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Linear regression slope of scores; classify against ±0.05 thresholds.
 * Replicates the Swift `SentimentTrend` semantics from the Swift codebase.
 */
function computeTrend(scores: number[]): SentimentTrend {
  if (scores.length < 2) return "Stable";
  const n = scores.length;
  const xs = Array.from({ length: n }, (_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = scores.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (scores[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  if (slope > 0.05) return "Improving";
  if (slope < -0.05) return "Declining";
  return "Stable";
}
