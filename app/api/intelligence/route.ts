import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a clinical NLP engine.
Analyze the user's journal entry transcript.
Respond ONLY with valid JSON matching this exact shape:
{
  "score": <number between -1.0 (extremely negative/crisis) and 1.0 (extremely positive)>,
  "keywords": ["<keyword1>", "<keyword2>", ... up to 8]
}
If the user mentions crisis, suicide, self-harm, severe depression, or hopelessness, the score MUST be highly negative (e.g., -0.8 to -1.0).
Do not add any markdown formatting, preamble, or trailing explanation.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
  }

  let body: { transcript: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.transcript || !body.transcript.trim()) {
    return NextResponse.json({ error: "Transcript is empty" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      // Using the latest 4.5 Haiku model available in 2026
      model: "claude-haiku-4-5-20251001",
      max_tokens: 128,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: body.transcript }],
    });

    let rawText = response.content[0].type === "text" ? response.content[0].text : "{}";
    rawText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

    const parsed: { score?: number; keywords?: string[] } = JSON.parse(rawText);

    return NextResponse.json({
      score: typeof parsed.score === "number" ? parsed.score : 0,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Claude API call failed";
    console.error("[/api/intelligence] error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
