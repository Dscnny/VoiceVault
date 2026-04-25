"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { JournalEntry } from "@/types/JournalEntry";

interface SentimentTimelineProps {
  entries: JournalEntry[];
}

export function SentimentTimeline({ entries }: SentimentTimelineProps) {
  const data = [...entries]
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map((e) => ({
      date: e.timestamp.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      score: Number(e.sentimentScore.toFixed(2)),
      transcript: e.rawTranscript.slice(0, 80) + "…",
    }));

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-tertiary mb-1">
            Sentiment Volatility
          </div>
          <div className="text-text-primary text-sm">
            30-day rolling baseline
          </div>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262a" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: "#26262a" }}
              tickLine={false}
            />
            <YAxis
              domain={[-1, 1]}
              stroke="#71717a"
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: "#26262a" }}
              tickLine={false}
              ticks={[-1, -0.5, 0, 0.5, 1]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#141416",
                border: "1px solid #26262a",
                borderRadius: 8,
                color: "#f5f5f7",
                fontSize: 12,
              }}
              formatter={(value: any) => [value, "Score"]}
            />
            <ReferenceLine y={0} stroke="#3a3a40" strokeDasharray="3 3" />
            <ReferenceLine y={-0.5} stroke="#f59e0b" strokeDasharray="2 4" strokeOpacity={0.4} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
