/**
 * MockIntakeService — ported from Swift `Mocks/MockIntakeService.swift`.
 *
 * Returns realistic clinical sample data so the Provider Dashboard can be
 * developed and demoed without a populated database.
 */
import type {
  IntakeCheatSheet,
  KeywordCount,
  SentimentTrend,
} from "@/types/Intake";
import type { IntakeService } from "@/services/interfaces/IntakeService";

export class MockIntakeService implements IntakeService {
  async generateCheatSheet(userId: string, days: number = 30): Promise<IntakeCheatSheet> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    const ago = (n: number) =>
      new Date(endDate.getTime() - n * 24 * 60 * 60 * 1000);

    return {
      periodStart: startDate,
      periodEnd: endDate,
      totalEntries: 12,
      topKeywords: [
        { keyword: "anxiety", count: 8 },
        { keyword: "sleep", count: 6 },
        { keyword: "headache", count: 4 },
        { keyword: "stress", count: 3 },
        { keyword: "fatigue", count: 2 },
      ],
      criticalQuotes: [
        {
          text: "I've been having these panic attacks every night before bed and I don't know what to do anymore",
          sentimentScore: -0.85,
          timestamp: ago(2),
          keywords: ["panic", "anxiety", "sleep"],
        },
        {
          text: "The headaches are getting worse and the medication doesn't seem to help at all",
          sentimentScore: -0.65,
          timestamp: ago(4),
          keywords: ["headache", "medication"],
        },
        {
          text: "I feel so exhausted all the time even when I sleep for eight hours",
          sentimentScore: -0.45,
          timestamp: ago(6),
          keywords: ["fatigue", "sleep"],
        },
      ],
      trend: "Declining",
      averageSentiment: -0.35,
      minimumSentiment: -0.85,
      maximumSentiment: 0.15,
    };
  }

  async topKeywords(userId: string, startDate: Date, endDate: Date, limit: number = 10): Promise<KeywordCount[]> {
    return [
      { keyword: "anxiety", count: 8 },
      { keyword: "sleep", count: 6 },
      { keyword: "headache", count: 4 },
    ].slice(0, limit);
  }

  async sentimentTrend(userId: string, startDate: Date, endDate: Date): Promise<SentimentTrend> {
    return "Declining";
  }
}
