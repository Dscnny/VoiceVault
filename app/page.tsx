"use client";

import dynamic from "next/dynamic";

import { LogIn, Mic, Brain, Keyboard } from "lucide-react";
import { useState, useEffect } from "react";
import Hero from "@/components/landing/Hero";
import StickyTitle from "@/components/landing/StickyTitle";
import FeatureSection from "@/components/landing/FeatureSection";
import { AuthButtons } from "@/components/auth/AuthButtons";

// Dynamic import to avoid SSR issues with getPointAtLength
const ScrollFishPath = dynamic(
  () => import("@/components/landing/ScrollFishPath"),
  { ssr: false }
);

/* ─── Section data ─── */
const SECTIONS = [
  {
    title: "A space between sessions",
    body: "Therapy does not end after one hour. VoiceVault helps you reflect, process, and capture what happens between appointments.",
    buttons: [],
    cardVariant: "microphone" as const,
  },
  {
    title: "When thoughts don\u2019t wait",
    body: "Late nights, stressful moments, and emotional check-ins can be saved before they disappear.",
    buttons: [],
    cardVariant: "mood" as const,
  },
  {
    title: "Patterns, not just moments",
    body: "VoiceVault turns conversations into gentle summaries, mood trends, and therapist-ready insights.",
    buttons: [],
    cardVariant: "therapist" as const,
  },
  {
    title: "Guided, not alone",
    body: "A calm fish companion guides users through reflection and makes progress feel visual, gentle, and alive.",
    buttons: [],
    cardVariant: "reflection" as const,
  },
];

import Link from "next/link";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main
      className="relative w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(to bottom, #dbeafe 0%, #d4e4fe 15%, #cdd9fe 30%, #d5d3fe 50%, #ddd6fe 70%, #e4dff8 85%, #ede9fe 100%)",
      }}
    >
      {/* ─── Login button fixed top-right ─── */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110]">
        <AuthButtons />
      </div>

      {/* ─── Sticky title (appears after scrolling past hero) ─── */}
      <StickyTitle />

      {/* ─── Hero section ─── */}
      <Hero />

      {/* ─── Fish path overlay (full page) ─── */}
      <ScrollFishPath />

      {/* ─── Content sections ─── */}
      <div className="relative z-10">
        {/* Underwater decorative background — kept minimal */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute w-64 h-80 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-[0.06]"
            style={{
              background: "radial-gradient(ellipse, rgba(147,197,253,0.8), transparent 70%)",
              top: "8%",
              left: "5%",
              animation: "float 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-48 h-64 rounded-[50%_60%_30%_60%/30%_60%_70%_40%] opacity-[0.05]"
            style={{
              background: "radial-gradient(ellipse, rgba(196,181,253,0.8), transparent 70%)",
              top: "45%",
              right: "8%",
              animation: "float 10s ease-in-out 3s infinite",
            }}
          />
          {/* Subtle scattered bubbles */}
          {mounted && [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/8"
              style={{
                width: 3 + Math.random() * 6,
                height: 3 + Math.random() * 6,
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
            />
          ))}
        </div>

        {SECTIONS.map((section, i) => (
          <FeatureSection key={i} index={i} {...section} />
        ))}

        {/* ─── Quick access cards ─── */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-center text-3xl font-black tracking-tight text-slate-800 mb-3">
            Jump right in
          </h2>
          <p className="text-center text-slate-400 text-base mb-10">
            Choose how you want to check in today.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Patient Vault */}
            <Link
              href="/patient"
              className="block group rounded-3xl glass shadow-bento p-8 hover:shadow-bento-hover hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-25 bg-gradient-to-br from-violet-400 to-fuchsia-400" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1.5">Patient Vault</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Speak your thoughts aloud and let the app listen, analyze, and save them privately.
                </p>
                <span className="text-sm font-bold text-accent group-hover:text-accent-hover transition-colors">
                  Open →
                </span>
              </div>
            </Link>

            {/* Provider Dashboard */}
            <Link
              href="/provider"
              className="block group rounded-3xl glass shadow-bento p-8 hover:shadow-bento-hover hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-25 bg-gradient-to-br from-emerald-400 to-teal-400" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1.5">Provider Dashboard</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Review mood trends, keywords, and sentiment patterns across journal entries.
                </p>
                <span className="text-sm font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  Open →
                </span>
              </div>
            </Link>

            {/* Typing Journal */}
            <Link
              href="/typing"
              className="block group rounded-3xl glass shadow-bento p-8 hover:shadow-bento-hover hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-25 bg-gradient-to-br from-blue-400 to-cyan-400" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Keyboard className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1.5">Typing Journal</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Type through words of affirmation. A quieter way to check in when you can&apos;t speak out loud.
                </p>
                <span className="text-sm font-bold text-blue-400 group-hover:text-blue-500 transition-colors">
                  Open →
                </span>
              </div>
            </Link>

          </div>
        </section>

        {/* ─── Footer with anchor & seaweed ─── */}
        <footer className="relative z-10 pt-12 pb-20 text-center overflow-hidden">
          {/* Anchor & Seaweed decoration */}
          <div className="flex items-end justify-center gap-5 mb-8 pointer-events-none" aria-hidden="true">
            {/* Left seaweed */}
            <svg width="24" height="70" viewBox="0 0 28 80" fill="none" className="opacity-35">
              <path d="M14 80 Q4 65, 14 50 Q24 35, 14 20 Q8 10, 12 0" stroke="#86efac" strokeWidth="3.5" fill="none" strokeLinecap="round" style={{ animation: "seaweedSway 4s ease-in-out infinite" }} />
              <path d="M20 80 Q28 62, 20 45 Q12 30, 18 14" stroke="#6ee7b7" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: "seaweedSway 5s ease-in-out 1s infinite" }} />
            </svg>

            {/* Red anchor */}
            <svg width="36" height="50" viewBox="0 0 48 64" fill="none" className="opacity-45">
              <circle cx="24" cy="10" r="5" stroke="#f87171" strokeWidth="2.5" fill="none" />
              <line x1="24" y1="15" x2="24" y2="50" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="14" y1="26" x2="34" y2="26" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M10 50 Q10 40, 24 40" stroke="#f87171" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M38 50 Q38 40, 24 40" stroke="#f87171" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="10" cy="50" r="2" fill="#f87171" />
              <circle cx="38" cy="50" r="2" fill="#f87171" />
            </svg>

            {/* Right seaweed */}
            <svg width="24" height="70" viewBox="0 0 28 80" fill="none" className="opacity-35">
              <path d="M14 80 Q24 65, 14 50 Q4 35, 14 20 Q20 10, 16 0" stroke="#86efac" strokeWidth="3.5" fill="none" strokeLinecap="round" style={{ animation: "seaweedSway 4.5s ease-in-out 0.5s infinite" }} />
              <path d="M8 80 Q0 62, 8 45 Q16 30, 10 14" stroke="#6ee7b7" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animation: "seaweedSway 5.5s ease-in-out 1.5s infinite" }} />
            </svg>
          </div>

          <p className="text-sm text-slate-500 font-semibold">
            VoiceVault &middot; Voice journaling that never leaves your device
          </p>
          <p className="text-xs text-slate-400 mt-1.5">
            100% on-device &middot; Zero servers &middot; Your data, your vault
          </p>
        </footer>
      </div>
    </main>
  );
}
