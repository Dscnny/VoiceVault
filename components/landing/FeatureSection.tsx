"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import VisualCard from "./VisualCard";

interface FeatureSectionProps {
  /** Section index (0-based) — odd indices flip the layout */
  index: number;
  title: string;
  body: string;
  buttons: { label: string; primary?: boolean }[];
  cardVariant: "microphone" | "mood" | "therapist" | "reflection";
}

export default function FeatureSection({
  index,
  title,
  body,
  buttons,
  cardVariant,
}: FeatureSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const isReversed = index % 2 !== 0;

  return (
    <section
      ref={ref}
      className="relative w-full max-w-6xl mx-auto px-6 py-20 sm:py-28"
    >
      <div
        className={`flex flex-col gap-10 items-center
          ${isReversed ? "md:flex-row-reverse" : "md:flex-row"}
          md:gap-16 lg:gap-24`}
      >
        {/* ─── Text column ─── */}
        <motion.div
          className="flex-1 max-w-lg"
          initial={{ opacity: 0, x: isReversed ? 60 : -60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5"
            style={{
              color: "#1e3a5f",
              textShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 font-medium">
            {body}
          </p>
          <div className="flex flex-wrap gap-3">
            {buttons.map((btn, i) => (
              <button
                key={i}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 ${
                  i === 0
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:scale-105"
                    : "bg-white/60 backdrop-blur-md border border-white/40 text-slate-700 shadow-sm hover:bg-white/80 hover:shadow-md"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ─── Visual card column ─── */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: isReversed ? -60 : 60, scale: 0.9 }}
          animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <VisualCard variant={cardVariant} />
        </motion.div>
      </div>
    </section>
  );
}
