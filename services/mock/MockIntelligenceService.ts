/**
 * MockIntelligenceService — heuristic, no-model implementation of the NLP pipeline.
 *
 * Used for previews and the 6 AM Failsafe. Produces "good enough" sentiment
 * scores via a simple lexicon and keyword extraction via stopword filtering.
 */
import type { SentimentResult } from "@/types/SentimentResult";
import type { IntelligenceService } from "@/services/interfaces/IntelligenceService";

const POSITIVE_WORDS = new Set([
  "good",
  "great",
  "wonderful",
  "happy",
  "better",
  "improvement",
  "improved",
  "improving",
  "progress",
  "milestone",
  "optimistic",
  "hopeful",
  "grateful",
  "calm",
  "peaceful",
  "relief",
  "energized",
  "strong",
  "confident",
  "proud",
  "love",
  "excited",
  "joy",
  "succeeded",
  "accomplished",
  "managed",
  "celebrate",
]);

const NEGATIVE_WORDS = new Set([
  "bad",
  "terrible",
  "awful",
  "anxious",
  "anxiety",
  "depressed",
  "depression",
  "sad",
  "tired",
  "exhausted",
  "fatigue",
  "pain",
  "hurt",
  "headache",
  "migraine",
  "panic",
  "scared",
  "worried",
  "frustrated",
  "stressed",
  "stress",
  "overwhelmed",
  "lonely",
  "isolated",
  "crying",
  "cried",
  "hopeless",
  "lost",
  "struggling",
  "difficult",
  "nausea",
  "vomited",
  "insomnia",
  "crisis",
  "grief",
]);

const STOPWORDS = new Set([
  "the","a","an","is","was","were","are","be","been","being","i","you","he","she","it","we",
  "they","my","your","his","her","its","our","their","this","that","these","those","of","in",
  "on","at","by","for","with","about","against","between","into","through","during","before",
  "after","above","below","to","from","up","down","out","off","over","under","again","further",
  "then","once","here","there","when","where","why","how","all","any","both","each","few","more",
  "most","other","some","such","no","nor","not","only","own","same","so","than","too","very",
  "s","t","can","will","just","don","should","now","and","but","or","if","because","as","until",
  "while","do","does","did","have","has","had","having","am","ll","ve","re","m","d","ain",
  "aren","couldn","didn","doesn","hadn","hasn","haven","isn","ma","mightn","mustn","needn",
  "shan","shouldn","wasn","weren","won","wouldn","also","really","still","get","got","like",
  "would","could","one","two","three","four","five","six","seven","eight","nine","ten",
]);

export class MockIntelligenceService implements IntelligenceService {
  isReady(): boolean {
    return true;
  }

  async warmup(): Promise<void> {
    // No-op for mock.
  }

  async analyze(transcript: string): Promise<SentimentResult> {
    if (!transcript.trim()) {
      throw new Error("Cannot analyze an empty transcript");
    }

    const tokens = transcript
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    // Sentiment: lexicon-based score in [-1, 1]
    let pos = 0;
    let neg = 0;
    for (const t of tokens) {
      if (POSITIVE_WORDS.has(t)) pos++;
      if (NEGATIVE_WORDS.has(t)) neg++;
    }
    const total = pos + neg;
    const score = total === 0 ? 0 : (pos - neg) / Math.max(total, 5);

    // Keywords: filter stopwords, count, take top by frequency
    const counts = new Map<string, number>();
    for (const t of tokens) {
      if (t.length < 4 || STOPWORDS.has(t)) continue;
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    const keywords = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k]) => k);

    return {
      score: Math.max(-1, Math.min(1, score)),
      keywords,
      vector: [],
    };
  }
}

