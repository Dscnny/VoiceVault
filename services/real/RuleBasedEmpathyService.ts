/**
 * RuleBasedEmpathyService — real, deterministic empathetic responses.
 *
 * For the hackathon we deliberately ship rule-based responses rather than
 * a full local LLM (WebLLM is a 1.8GB+ download). The output is bounded by
 * persona mode and selected with light variation so demos don't repeat.
 *
 * If you have time after MVP: swap this for a WebLLM-backed implementation.
 */
import type { SentimentResult } from "@/types/SentimentResult";
import type { EmpathyResponse } from "@/types/Empathy";
import type { EmpathyService } from "@/services/interfaces/EmpathyService";
import { modeForScore, type EmpathyMode } from "@/types/Empathy";

const RESPONSES: Record<EmpathyMode, string[]> = {
  crisis: [
    "I hear you. What you're feeling is real, and you are not alone in this.",
    "This sounds incredibly heavy. Please reach out to someone you trust — you don't have to carry this alone.",
    "What you're going through matters. If you're in crisis, the 988 Lifeline is available any time.",
  ],
  distress: [
    "It sounds like things have been really heavy lately. That takes a lot of strength to share.",
    "Naming what's hard is part of moving through it. Be gentle with yourself today.",
    "Some weeks just take more than they give. Resting is allowed.",
  ],
  neutral: [
    "Thank you for checking in with yourself today. That awareness matters.",
    "Just showing up to do this is something. Small steps add up.",
    "You sound steady today. That's worth noticing.",
  ],
  positive: [
    "It's wonderful to hear some brightness in your voice. You're doing something right.",
    "Whatever you did this week, keep doing it — this kind of momentum is hard-won.",
    "There's real progress in what you just described. Let yourself feel it.",
  ],
};

/**
 * Optional keyword-aware refinement: if certain clinical keywords appear,
 * we nudge the response toward something topical. Stays generic — never
 * gives medical advice.
 */
const KEYWORD_OVERRIDES: Array<{
  keywords: string[];
  message: string;
  appliesTo: EmpathyMode[];
}> = [
  {
    keywords: ["sleep", "insomnia", "sleeping"],
    message:
      "You've mentioned sleep a few times lately. It might be worth bringing this up at your next appointment.",
    appliesTo: ["distress", "neutral"],
  },
  {
    keywords: ["medication", "med", "dose", "pill"],
    message:
      "Tracking how a medication is landing matters — you're doing the right thing by noticing.",
    appliesTo: ["neutral", "distress"],
  },
  {
    keywords: ["panic", "anxiety", "anxious"],
    message:
      "Anxiety has been showing up a lot for you. That awareness is the first step in learning what triggers it.",
    appliesTo: ["distress", "neutral"],
  },
];

export class RuleBasedEmpathyService implements EmpathyService {
  isAvailable(): boolean {
    return true;
  }

  async generateResponse(sentimentResult: SentimentResult): Promise<EmpathyResponse> {
    const mode = modeForScore(sentimentResult.score);

    // Check for a keyword-driven override first
    const lowered = sentimentResult.keywords.map((k) => k.toLowerCase());
    for (const override of KEYWORD_OVERRIDES) {
      if (!override.appliesTo.includes(mode)) continue;
      if (override.keywords.some((kw) => lowered.includes(kw))) {
        return { message: override.message, mode };
      }
    }

    // Otherwise pick a random base response for this mode.
    const options = RESPONSES[mode];
    const message = options[Math.floor(Math.random() * options.length)];
    return { message, mode };
  }
}
