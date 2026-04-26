"use client";

import dynamic from "next/dynamic";

import { LogIn } from "lucide-react";
import Hero from "@/components/landing/Hero";
import StickyTitle from "@/components/landing/StickyTitle";
import FeatureSection from "@/components/landing/FeatureSection";

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
    buttons: [{ label: "Start talking" }, { label: "See how it works" }],
    cardVariant: "microphone" as const,
  },
  {
    title: "When thoughts don\u2019t wait",
    body: "Late nights, stressful moments, and emotional check-ins can be saved before they disappear.",
    buttons: [{ label: "Open vault" }, { label: "Learn more" }],
    cardVariant: "mood" as const,
  },
  {
    title: "Patterns, not just moments",
    body: "VoiceVault turns conversations into gentle summaries, mood trends, and therapist-ready insights.",
    buttons: [{ label: "View insights" }, { label: "See demo" }],
    cardVariant: "therapist" as const,
  },
  {
    title: "Guided, not alone",
    body: "A calm fish companion guides users through reflection and makes progress feel visual, gentle, and alive.",
    buttons: [{ label: "Meet your guide" }, { label: "Start reflection" }],
    cardVariant: "reflection" as const,
  },
];

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative w-full overflow-x-hidden bg-gradient-to-b from-[#dbeafe] via-[#e0e7ff] to-[#ede9fe]">
      {/* ─── Login button fixed top-right ─── */}
      <Link
        href="/login"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 text-white text-sm font-bold shadow-lg hover:bg-white/50 hover:scale-105 active:scale-95 transition-all duration-300"
        style={{
          textShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        <LogIn className="w-4 h-4" />
        Log In
      </Link>

      {/* ─── Sticky title (appears after scrolling past hero) ─── */}
      <StickyTitle />

      {/* ─── Hero section ─── */}
      <Hero />

      {/* ─── Fish path overlay (full page) ─── */}
      <ScrollFishPath />

      {/* ─── Content sections ─── */}
      <div className="relative z-10">
        {/* Underwater decorative background for content area */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle jellyfish blobs */}
          <div
            className="absolute w-64 h-80 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-[0.07]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(147,197,253,0.8), transparent 70%)",
              top: "10%",
              left: "5%",
              animation: "float 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-48 h-64 rounded-[50%_60%_30%_60%/30%_60%_70%_40%] opacity-[0.06]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(196,181,253,0.8), transparent 70%)",
              top: "40%",
              right: "8%",
              animation: "float 10s ease-in-out 3s infinite",
            }}
          />
          <div
            className="absolute w-56 h-72 rounded-[40%_60%_60%_40%/50%_40%_60%_50%] opacity-[0.05]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(125,211,252,0.8), transparent 70%)",
              top: "70%",
              left: "15%",
              animation: "float 14s ease-in-out 5s infinite",
            }}
          />

          {/* Scattered bubble dots */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: 3 + Math.random() * 8,
                height: 3 + Math.random() * 8,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {SECTIONS.map((section, i) => (
          <FeatureSection key={i} index={i} {...section} />
        ))}

        {/* ─── Footer ─── */}
        <footer className="relative z-10 py-16 text-center">
          <p className="text-sm text-slate-400 font-medium">
            VoiceVault &middot; Voice journaling that never leaves your device
          </p>
          <p className="text-xs text-slate-300 mt-2">
            100% on-device &middot; Zero servers &middot; Your data, your vault
          </p>
        </footer>
      </div>
    </main>
  );
}
