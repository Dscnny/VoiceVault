/**
 * MockStorageService — ported from Swift `Mocks/MockStorageService.swift`.
 *
 * In-memory implementation of StorageService for development, tests, and the
 * 6 AM Failsafe (per AI_ARCHITECT_RULES.md §13).
 *
 * Includes a `withSampleData()` factory pre-populated with 7 realistic,
 * medical-grade journal entries spanning the past 30 days.
 */
import type { JournalEntry } from "@/types/JournalEntry";
import type {
  JournalSortOrder,
  StorageService,
} from "@/services/interfaces/StorageService";

export class MockStorageService implements StorageService {
  private entries: JournalEntry[] = [];

  async save(entry: JournalEntry): Promise<void> {
    const index = this.entries.findIndex((e) => e.id === entry.id);
    if (index >= 0) {
      this.entries[index] = entry;
    } else {
      this.entries.push(entry);
    }
  }

  async fetchById(id: string): Promise<JournalEntry> {
    const entry = this.entries.find((e) => e.id === id);
    if (!entry) throw new Error(`Journal entry not found: ${id}`);
    return entry;
  }

  async fetchAll(sortedBy: JournalSortOrder = "newestFirst"): Promise<JournalEntry[]> {
    const sorted = [...this.entries];
    sorted.sort((a, b) =>
      sortedBy === "newestFirst"
        ? b.timestamp.getTime() - a.timestamp.getTime()
        : a.timestamp.getTime() - b.timestamp.getTime()
    );
    return sorted;
  }

  async fetchEntries(startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    return this.entries
      .filter((e) => e.timestamp >= startDate && e.timestamp <= endDate)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async searchEntries(query: string): Promise<JournalEntry[]> {
    const lowered = query.toLowerCase();
    return this.entries.filter((e) =>
      e.rawTranscript.toLowerCase().includes(lowered)
    );
  }

  async deleteById(id: string): Promise<void> {
    const index = this.entries.findIndex((e) => e.id === id);
    if (index < 0) throw new Error(`Journal entry not found: ${id}`);
    this.entries.splice(index, 1);
  }

  async entryCount(): Promise<number> {
    return this.entries.length;
  }

  /**
   * Pre-populated factory: 7 medical-grade journal entries spanning ~30 days.
   *
   * Covers diverse clinical scenarios:
   * 1. Post-surgical recovery (positive)
   * 2. Chronic migraine management (negative)
   * 3. Anxiety/SSRI medication adjustment (mixed/neutral)
   * 4. Physical therapy progress (positive)
   * 5. Sleep disorder documentation (negative)
   * 6. Cardiovascular health monitoring (positive)
   * 7. Mental health crisis + recovery (mixed)
   */
  static withSampleData(): MockStorageService {
    const service = new MockStorageService();
    const now = Date.now();
    const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000);

    // Deterministic mock embedding generator
    const mockVector = (seed: number, dimensions = 128): number[] => {
      let s = seed;
      const out: number[] = [];
      for (let i = 0; i < dimensions; i++) {
        s = (s * 6364136223846793005 + 1442695040888963407 + i) | 0;
        out.push((s % 2000) / 1000.0 - 1.0);
      }
      return out;
    };

    service.entries = [
      // 1. Post-surgical recovery — Positive
      {
        id: "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
        timestamp: daysAgo(1),
        rawTranscript:
          "Day twelve post knee arthroscopy. The swelling has reduced significantly and I can now bend my knee to about ninety degrees which is right on track with my recovery timeline. Physical therapy sessions are going well. My PT says my range of motion is better than expected for this stage. I managed to walk without crutches for short distances around the house today. Pain is manageable with just acetaminophen now. I stopped the oxycodone five days ago with no issues. Sleeping is still uncomfortable but improving. I'm cautiously optimistic about being back to light activity within the next two weeks. Follow up with Dr. Martinez is scheduled for next Thursday.",
        sentimentScore: 0.72,
        extractedKeywords: [
          "arthroscopy",
          "recovery",
          "physical therapy",
          "range of motion",
          "acetaminophen",
          "oxycodone",
          "swelling",
          "optimistic",
        ],
        vectorEmbedding: mockVector(101),
        audioDurationSeconds: 48.5,
        isFullyProcessed: true,
      },

      // 2. Chronic migraine management — Negative
      {
        id: "B2C3D4E5-F6A7-8901-BCDE-F12345678901",
        timestamp: daysAgo(3),
        rawTranscript:
          "Third migraine this week. This one started around two PM with the usual visual aura, the zigzag lines in my peripheral vision. Within thirty minutes the pain escalated to about an eight out of ten. Took sumatriptan fifty milligrams at onset but it only brought relief down to about a five. Had to lie down in a dark room for three hours. The nausea was severe this time and I vomited once. Light sensitivity is extreme. I'm noticing a pattern: all three episodes this week happened in the afternoon after prolonged screen time at work. I need to discuss this pattern with my neurologist. The topiramate prophylaxis doesn't seem to be working at the current dose of fifty milligrams.",
        sentimentScore: -0.68,
        extractedKeywords: [
          "migraine",
          "aura",
          "sumatriptan",
          "nausea",
          "photosensitivity",
          "topiramate",
          "neurologist",
          "vomited",
          "pain",
        ],
        vectorEmbedding: mockVector(202),
        audioDurationSeconds: 62.3,
        isFullyProcessed: true,
      },

      // 3. Anxiety & SSRI adjustment — Mixed/Neutral
      {
        id: "C3D4E5F6-A7B8-9012-CDEF-123456789012",
        timestamp: daysAgo(7),
        rawTranscript:
          "Week three on the increased dose of escitalopram, going from ten to twenty milligrams. The side effects are finally starting to subside. The first two weeks were rough with increased anxiety, jaw clenching, and those vivid dreams. The vivid dreams are still happening but less disturbing. My baseline anxiety does feel lower than before the adjustment. I went to the grocery store yesterday without having to do my grounding exercises first which is a first in months. Still avoiding crowded places though. The anticipatory anxiety before social events is still significant. GAD seven score this week is probably around a twelve, down from sixteen two weeks ago.",
        sentimentScore: 0.15,
        extractedKeywords: [
          "escitalopram",
          "anxiety",
          "side effects",
          "grounding exercises",
          "GAD-7",
          "jaw clenching",
          "vivid dreams",
          "social",
        ],
        vectorEmbedding: mockVector(303),
        audioDurationSeconds: 55.7,
        isFullyProcessed: true,
      },

      // 4. Physical therapy progress — Positive
      {
        id: "D4E5F6A7-B8C9-0123-DEFA-234567890123",
        timestamp: daysAgo(10),
        rawTranscript:
          "Great session with my physical therapist today. We focused on scapular stabilization and rotator cuff strengthening. I was able to do three sets of fifteen external rotations with the two pound weight without pain which is a big milestone. Last month I couldn't even do five reps. She also introduced some new exercises for thoracic mobility that felt really good. My posture has improved noticeably since starting PT eight weeks ago. The chronic upper back pain that was at a seven is now consistently around a three. I'm sleeping better because I'm not waking up from shoulder pain anymore. Next goal is to get back to swimming laps by end of next month.",
        sentimentScore: 0.81,
        extractedKeywords: [
          "physical therapy",
          "rotator cuff",
          "scapular stabilization",
          "milestone",
          "posture",
          "improvement",
          "swimming",
          "pain reduction",
        ],
        vectorEmbedding: mockVector(404),
        audioDurationSeconds: 44.2,
        isFullyProcessed: true,
      },

      // 5. Sleep disorder documentation — Negative
      {
        id: "E5F6A7B8-C9D0-1234-EFAB-345678901234",
        timestamp: daysAgo(14),
        rawTranscript:
          "Sleep study results came back and I've been diagnosed with moderate obstructive sleep apnea. My AHI was twenty three events per hour which explains a lot. The excessive daytime sleepiness, the morning headaches, the brain fog. My wife has been telling me for years that I stop breathing in my sleep. I feel frustrated that I didn't get tested sooner. They want me to start CPAP therapy and I'm anxious about it. The idea of sleeping with a mask every night is daunting. I have a fitting appointment next week for the mask. My blood oxygen was dropping to eighty two percent during episodes which Dr. Chen said is concerning. I'm also supposed to lose fifteen pounds which will help. Starting a referral to a nutritionist.",
        sentimentScore: -0.42,
        extractedKeywords: [
          "sleep apnea",
          "AHI",
          "CPAP",
          "oxygen saturation",
          "brain fog",
          "daytime sleepiness",
          "headaches",
          "nutritionist",
          "frustrated",
        ],
        vectorEmbedding: mockVector(505),
        audioDurationSeconds: 71.8,
        isFullyProcessed: true,
      },

      // 6. Cardiovascular health — Positive
      {
        id: "F6A7B8C9-D0E1-2345-FABC-456789012345",
        timestamp: daysAgo(21),
        rawTranscript:
          "Six month cardiovascular follow up with Dr. Patel went really well today. My LDL cholesterol dropped from one hundred sixty two to one hundred eighteen since starting rosuvastatin. Total cholesterol is now two hundred and five. My A1C is five point seven which is still pre-diabetic range but improved from six point one last time. Blood pressure was one twenty eight over seventy eight in office today. The combination of amlodipine and lifestyle changes has been effective. I've been exercising four times a week consistently doing a mix of cardio and resistance training. Lost eleven pounds since January. Dr. Patel was very pleased with my progress and we're going to recheck everything in three months.",
        sentimentScore: 0.88,
        extractedKeywords: [
          "LDL cholesterol",
          "rosuvastatin",
          "A1C",
          "blood pressure",
          "amlodipine",
          "pre-diabetic",
          "exercise",
          "progress",
          "weight loss",
        ],
        vectorEmbedding: mockVector(606),
        audioDurationSeconds: 58.1,
        isFullyProcessed: true,
      },

      // 7. Mental health crisis + recovery — Mixed
      {
        id: "A7B8C9D0-E1F2-3456-ABCD-567890123456",
        timestamp: daysAgo(28),
        rawTranscript:
          "Recording this a few days after a really difficult weekend. I had a severe depressive episode on Saturday that was triggered by the anniversary of my mother's passing. The grief hit me harder than I expected. I isolated myself completely for about thirty six hours. I did use my safety plan and texted my crisis contact. I also called the nine eight eight lifeline on Saturday evening and spoke with a counselor for about twenty minutes. That helped me get through the worst of it. By Monday I was functional again and made it to work. I've been taking my medications consistently which I think prevented it from spiraling further. My therapist and I are going to focus on grief processing techniques in our next few sessions. I'm also adding the anniversary date to my mental health calendar so I can plan ahead next year.",
        sentimentScore: -0.28,
        extractedKeywords: [
          "depressive episode",
          "grief",
          "safety plan",
          "crisis contact",
          "988 lifeline",
          "isolation",
          "medication adherence",
          "therapy",
          "coping",
          "anniversary",
        ],
        vectorEmbedding: mockVector(707),
        audioDurationSeconds: 82.4,
        isFullyProcessed: true,
      },
    ];

    return service;
  }
}
