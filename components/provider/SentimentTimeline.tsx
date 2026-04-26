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
  Area,
  AreaChart,
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
    <div className="rounded-4xl glass shadow-bento p-10 sm:p-12 h-full flex flex-col relative overflow-hidden group hover:shadow-bento-hover transition-all duration-500">
      {/* Decorative blob */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-violet-100 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />

      <div className="relative z-10 flex items-center justify-between mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
            Sentiment Volatility
          </div>
          <div className="text-sm font-semibold text-slate-600">
            30-day rolling baseline
          </div>
        </div>
        <div className="text-3xl font-black tabular-nums tracking-tighter text-slate-800">
          {data.length > 0 ? data[data.length - 1].score.toFixed(2) : "—"}
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sentimentFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              domain={[-1, 1]}
              stroke="#94a3b8"
              tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              ticks={[-1, -0.5, 0, 0.5, 1]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: 16,
                color: "#0f172a",
                fontWeight: 700,
                fontSize: 13,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                padding: "10px 16px",
              }}
              formatter={(value: any) => [value, "Score"]}
            />
            <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
            <ReferenceLine y={-0.5} stroke="#f97316" strokeDasharray="2 4" strokeOpacity={0.5} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#sentimentFill)"
              dot={{ fill: "#ffffff", stroke: "#8b5cf6", strokeWidth: 2.5, r: 5 }}
              activeDot={{ r: 7, fill: "#ffffff", stroke: "#c084fc", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
