/**
 * POST /api/intake
 *
 * Server-side proxy to Anthropic Claude Sonnet for clinical pre-session dossier
 * generation. Uses claude-sonnet-4-6 because the dossier requires more reasoning
 * than a simple empathy response.
 *
 * Body: { entries: JournalEntry[], days: number }
 * Returns: { summary, dominantTheme, priorityFocus, riskFlags }
 *
 * Claude is instructed to respond ONLY with valid JSON matching that shape.
 * The route parses it and returns structured fields to the caller.
 */
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { JournalEntry } from "@/types/JournalEntry";

const SYSTEM_PROMPT = `You are a clinical documentation assistant helping therapists prepare for patient sessions.
Your output is read by busy clinicians — be concise, factual, and precise.
Write as if summarizing patient notes for a provider who has 90 seconds to read before a session.
Do not add fluff, hedging, or pleasantries.

You MUST respond ONLY with valid JSON. No markdown, no preamble, no trailing explanation.
The JSON must match this exact shape:
{
  "summary": "<3-5 sentence SOAP-lite narrative for the provider>",
  "dominantTheme": "<the single dominant emotional theme across the period>",
  "priorityFocus": "<the single most important thing the provider should address>",
  "riskFlags": ["<flag 1>", "<flag 2>"]
}

riskFlags should be an empty array [] if no risk factors are present.
Include a risk flag if you detect: crisis-level sentiment, self-harm language, medication concerns, or mentions of suicidality.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: { entries: JournalEntry[]; days: number };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { entries, days } = body;

  if (!Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json(
      { error: "entries must be a non-empty array" },
      { status: 400 }
    );
  }

  // Build a compact representation of entries for the prompt
  const entryLines = entries
    .slice()
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    .map((e, i) => {
      const date = new Date(e.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const score = e.sentimentScore.toFixed(2);
      const keywords = e.extractedKeywords.slice(0, 4).join(", ");
      const preview =
        e.rawTranscript.length > 300
          ? e.rawTranscript.slice(0, 300) + "…"
          : e.rawTranscript;
      return `Entry ${i + 1} [${date}, score: ${score}]${keywords ? `, keywords: ${keywords}` : ""}:\n"${preview}"`;
    })
    .join("\n\n");

  const userMessage = `Here are ${entries.length} journal entries from the past ${days} days. Generate a clinical pre-session summary.\n\n${entryLines}`;

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    let rawText =
      response.content[0].type === "text" ? response.content[0].text : "{}";

    // Strip markdown code fences if Claude wraps the JSON despite instructions
    rawText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

    // Parse Claude's JSON response
    const parsed: {
      summary?: string;
      dominantTheme?: string;
      priorityFocus?: string;
      riskFlags?: string[];
    } = JSON.parse(rawText);

    return NextResponse.json({
      summary: parsed.summary ?? "",
      dominantTheme: parsed.dominantTheme ?? "",
      priorityFocus: parsed.priorityFocus ?? "",
      riskFlags: Array.isArray(parsed.riskFlags) ? parsed.riskFlags : [],
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Claude API call failed";
    console.error("[/api/intake] error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
