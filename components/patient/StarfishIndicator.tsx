"use client";

import { motion } from "framer-motion";

export function StarfishIndicator({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      animate={isActive ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : { scale: 1, rotate: 0 }}
      transition={{ repeat: Infinity, duration: 2 }}
      className={`transition-all duration-500 ${isActive ? 'drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'opacity-60 saturate-50'}`}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 10 L38 24 L52 26 L42 36 L44 50 L32 44 L20 50 L22 36 L12 26 L26 24 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="28" cy="32" r="2" fill="#111827"/>
        <circle cx="36" cy="32" r="2" fill="#111827"/>
        <path d="M30 38 Q32 40 34 38" stroke="#111827" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </motion.div>
  );
}
