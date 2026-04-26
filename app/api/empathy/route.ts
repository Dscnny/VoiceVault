/**
 * POST /api/empathy
 *
 * Server-side proxy to Anthropic Claude (Haiku) for empathetic responses.
 * The API key never reaches the browser — it is read from the server env only.
 *
 * Body: { transcript?, sentimentScore?, keywords?, conversationHistory? }
 * - Single-turn: pass transcript + sentimentScore + keywords
 * - Multi-turn:  pass conversationHistory (array of {role, content} messages)
 *
 * Returns: { message: string, usage: object }
 */
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a warm, empathetic mental wellness companion. Your role is to respond to what users share about their day and wellbeing.

Rules:
- Respond like a thoughtful caring friend, not a therapist
- Keep responses to 2-4 sentences maximum
- Never use clinical language, diagnoses, or numeric scores
- Never give medical advice
- Reference specific things from the user's actual transcript when available
- If sentiment score is below -0.8, gently mention the 988 Lifeline without being alarming — something like "If things ever feel too heavy, the 988 Lifeline is always there"
- Do not act as a general assistant — only respond to what the user shares about their day and wellbeing`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: {
    transcript?: string;
    sentimentScore?: number;
    keywords?: string[];
    conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { transcript, sentimentScore, keywords, conversationHistory } = body;

  const client = new Anthropic({ apiKey });

  let messages: Anthropic.MessageParam[];

  if (conversationHistory && conversationHistory.length > 0) {
    // Multi-turn: use provided history (already capped by caller)
    messages = conversationHistory;
  } else {
    // Single-turn: build initial user message from journal context
    const parts: string[] = [];
    if (transcript) {
      parts.push(`Here is what I shared today:\n\n${transcript}`);
    }
    if (keywords && keywords.length > 0) {
      parts.push(`Key themes in what I said: ${keywords.join(", ")}`);
    }
    if (sentimentScore !== undefined && sentimentScore < -0.8) {
      parts.push("(Note for companion: this person may be struggling significantly)");
    }

    const userContent =
      parts.length > 0
        ? parts.join("\n\n")
        : "I just finished recording a journal entry.";

    messages = [{ role: "user", content: userContent }];
  }

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages,
    });

    const message =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ message, usage: response.usage });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Claude API call failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
