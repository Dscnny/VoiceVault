"use client";

import { motion } from "framer-motion";

interface FishProps {
  /** Size multiplier (default 1 = ~80px wide) */
  size?: number;
  /** Extra className for positioning */
  className?: string;
}

/**
 * A custom SVG fish with animated tail, fins, and gentle body bobbing.
 * Rotation is handled by the parent (ScrollFishPath) via CSS transform.
 *
 * Tail wag is achieved via skewX on a <motion.g> wrapper — framer-motion 12.x
 * does not reliably interpolate SVG path `d` attribute strings (produces
 * `d="undefined"` during the first render frame), so all motion.path d-animations
 * have been replaced with transform-based animations on group elements.
 */
export default function Fish({ size = 1, className = "" }: FishProps) {
  const w = 80 * size;
  const h = 50 * size;

  return (
    <motion.svg
      width={w}
      height={h}
      viewBox="0 0 80 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={{ y: [0, -3, 0, 3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* ─── Tail (skewX wag instead of d-morphing) ─── */}
      <motion.g
        animate={{ skewY: [-6, 6, -6] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "14px 25px" }}
      >
        <path
          d="M6 25 C-2 15, -2 10, 4 5 C8 12, 8 18, 6 25 Z"
          fill="url(#tailGrad)"
          opacity={0.85}
        />
        <path
          d="M6 25 C-2 35, -2 40, 4 45 C8 38, 8 32, 6 25 Z"
          fill="url(#tailGrad)"
          opacity={0.85}
        />
      </motion.g>

      {/* ─── Body (rounder for cute look) ─── */}
      <ellipse cx="38" cy="25" rx="26" ry="18" fill="url(#bodyGrad)" />
      {/* body sheen */}
      <ellipse cx="40" cy="19" rx="16" ry="9" fill="rgba(255,255,255,0.22)" />

      {/* ─── Dorsal fin (gentle opacity pulse instead of d-morphing) ─── */}
      <motion.path
        d="M30 9 Q38 -2, 48 9"
        stroke="url(#finGrad)"
        strokeWidth="2.5"
        fill="url(#finGrad)"
        animate={{ opacity: [0.7, 0.5, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ─── Pectoral fin (static — subtle scaleY wobble on group) ─── */}
      <motion.path
        d="M32 36 Q38 46, 46 38"
        stroke="none"
        fill="url(#finGrad)"
        animate={{ opacity: [0.55, 0.35, 0.55] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />

      {/* ─── Blush cheek ─── */}
      <circle cx="48" cy="29" r="3.5" fill="#fca5a5" opacity="0.3" />

      {/* ─── Eye (bigger, cuter) ─── */}
      <circle cx="54" cy="21" r="5.5" fill="white" />
      <circle cx="55.5" cy="20" r="3" fill="#1e293b" />
      <circle cx="56.5" cy="19" r="1.2" fill="white" />

      {/* ─── Mouth (gentle smile) ─── */}
      <path d="M62 27 Q64 29.5, 61 30" stroke="#94a3b8" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* ─── Tiny bubbles ─── */}
      <circle cx="67" cy="22" r="1.5" fill="rgba(147,197,253,0.25)" stroke="rgba(147,197,253,0.35)" strokeWidth="0.5" />
      <circle cx="70" cy="19" r="1" fill="rgba(147,197,253,0.2)" stroke="rgba(147,197,253,0.3)" strokeWidth="0.5" />

      {/* ─── Gradient definitions (softer pastels) ─── */}
      <defs>
        <linearGradient id="bodyGrad" x1="10" y1="10" x2="66" y2="40">
          <stop offset="0%" stopColor="#a5d8ff" />
          <stop offset="50%" stopColor="#91a7ff" />
          <stop offset="100%" stopColor="#b197fc" />
        </linearGradient>
        <linearGradient id="tailGrad" x1="0" y1="10" x2="8" y2="40">
          <stop offset="0%" stopColor="#b197fc" />
          <stop offset="100%" stopColor="#99e9f2" />
        </linearGradient>
        <linearGradient id="finGrad" x1="30" y1="0" x2="48" y2="12">
          <stop offset="0%" stopColor="#d0bfff" />
          <stop offset="100%" stopColor="#99e9f2" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
