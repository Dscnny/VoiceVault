"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

/**
 * Full-viewport hero section with the underwater background image.
 * Title "voicevault" starts large and centered, then shrinks/moves
 * to the top-left as the user scrolls (handled by StickyTitle).
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Title animation: starts full-size centered, fades/shrinks on scroll
  const titleScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.45]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
  const titleX = useTransform(scrollYProgress, [0, 0.6], [0, -200]);

  // Subtle parallax for background
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
    >
      {/* ─── Background image with parallax ─── */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ y: bgY }}
      >
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: "url('/ocean_background_title.png')" }}
        />
        {/* Soft blue overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(30,58,138,0.35)] via-[rgba(59,130,246,0.2)] to-[rgba(147,197,253,0.3)]" />
        {/* Bottom fade to content area — tall for smooth depth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#dbeafe] via-[#dbeafe]/80 to-transparent" />
      </motion.div>

      {/* ─── Floating decorative elements ─── */}
      {/* Bubble particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4 + Math.random() * 12,
              height: 4 + Math.random() * 12,
              left: `${10 + Math.random() * 80}%`,
              bottom: `${Math.random() * 40}%`,
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(147,197,253,0.2))`,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
            animate={{
              y: [0, -(200 + Math.random() * 300)],
              opacity: [0.6, 0],
              scale: [1, 0.5],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ─── Title text ─── */}
      <motion.div
        className="relative z-10 text-center"
        style={{
          scale: titleScale,
          opacity: titleOpacity,
          y: titleY,
          x: titleX,
        }}
      >
        <h1
          className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter leading-none select-none"
          style={{
            color: "white",
            textShadow:
              "0 0 60px rgba(147,197,253,0.5), 0 0 120px rgba(99,102,241,0.3), 0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          VoiceVault
        </h1>
        <motion.p
          className="mt-6 text-lg sm:text-xl text-blue-100/90 font-medium max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Voice journaling that never leaves your device
        </motion.p>
      </motion.div>

      {/* ─── Scroll hint ─── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xs font-medium text-blue-200/70 tracking-widest uppercase">
          Scroll to explore
        </span>
        <svg
          width="20"
          height="12"
          viewBox="0 0 20 12"
          fill="none"
          className="text-blue-200/60"
        >
          <path
            d="M2 2L10 10L18 2"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </section>
  );
}
