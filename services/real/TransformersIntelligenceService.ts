/**
 * TransformersIntelligenceService — real on-device NLP using transformers.js.
 *
 * Pipeline:
 *  1. DistilBERT sentiment classifier (Xenova/distilbert-base-uncased-finetuned-sst-2-english)
 *     → POSITIVE/NEGATIVE label with confidence, mapped to score in [-1, 1]
 *  2. MiniLM sentence embeddings (Xenova/all-MiniLM-L6-v2) → 384-dim vector
 *  3. Heuristic keyword extraction (TF-style + medical-aware stopwords)
 *
 * All models run in the browser via WebGPU (when available) or WASM fallback.
 * Models are cached after first download.
 */
import type { SentimentResult } from "@/types/SentimentResult";
import type { IntelligenceService } from "@/services/interfaces/IntelligenceService";

// Lazy import — transformers.js is heavy and we only want it client-side.
type Pipeline = (...args: any[]) => Promise<any>;

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
  "would","could","one","two","three","four","five","six","seven","eight","nine","ten","today",
  "yesterday","tomorrow","day","week","month","year","time","know","think","feel","felt","feels",
  "going","gonna","want","wanted","need","needed","make","made","take","took","taking",
]);

export class TransformersIntelligenceService implements IntelligenceService {
  private sentimentPipeline: Pipeline | null = null;
  private embeddingPipeline: Pipeline | null = null;
  private warmupPromise: Promise<void> | null = null;

  isReady(): boolean {
    return this.sentimentPipeline !== null && this.embeddingPipeline !== null;
  }

  async warmup(): Promise<void> {
    if (this.isReady()) return;
    if (this.warmupPromise) return this.warmupPromise;

    // Hard guard: transformers.js must only load in the browser. If this is
    // ever called server-side (e.g. accidental SSR), bail without throwing.
    if (typeof window === "undefined") {
      return;
    }

    this.warmupPromise = (async () => {
      // Dynamic import so transformers.js only loads in the browser
      const { pipeline, env } = await import("@xenova/transformers");

      // Use the CDN for model files; tell the runtime to cache them.
      env.allowRemoteModels = true;
      env.allowLocalModels = false;

      // Try WebGPU first; fall back to WASM if unavailable.
      const device = await detectBestDevice();

      const [sentiment, embedding] = await Promise.all([
        pipeline(
          "sentiment-analysis",
          "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
          { device }
        ),
        pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { device }),
      ]);

      this.sentimentPipeline = sentiment as Pipeline;
      this.embeddingPipeline = embedding as Pipeline;
    })();

    return this.warmupPromise;
  }

  async analyze(transcript: string): Promise<SentimentResult> {
    if (!transcript.trim()) {
      throw new Error("Cannot analyze an empty transcript");
    }
    await this.warmup();
    if (!this.sentimentPipeline || !this.embeddingPipeline) {
      throw new Error("Intelligence pipelines not initialized");
    }

    // Sentiment: DistilBERT outputs {label: "POSITIVE"|"NEGATIVE", score: 0..1}
    // Map to a normalized polarity in [-1, 1].
    const sentimentOutput = await this.sentimentPipeline(transcript);
    const first = Array.isArray(sentimentOutput) ? sentimentOutput[0] : sentimentOutput;
    const label: string = first.label;
    const confidence: number = first.score;
    const score = label.toUpperCase() === "POSITIVE" ? confidence : -confidence;

    // Embedding: mean-pooled, normalized 384-dim vector
    const embeddingOutput = await this.embeddingPipeline(transcript, {
      pooling: "mean",
      normalize: true,
    });
    const vector: number[] = Array.from(embeddingOutput.data as Float32Array);

    // Keywords: heuristic extraction
    const keywords = extractKeywords(transcript);

    return { score, keywords, vector };
  }
}

async function detectBestDevice(): Promise<"webgpu" | "wasm"> {
  if (typeof navigator !== "undefined" && (navigator as any).gpu) {
    try {
      const adapter = await (navigator as any).gpu.requestAdapter();
      if (adapter) return "webgpu";
    } catch {
      /* fall through */
    }
  }
  return "wasm";
}

function extractKeywords(transcript: string): string[] {
  const tokens = transcript
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const counts = new Map<string, number>();
  for (const t of tokens) {
    if (t.length < 4) continue;
    if (STOPWORDS.has(t)) continue;
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k]) => k);
}