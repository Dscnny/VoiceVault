"use client";

import { motion } from "framer-motion";

export function CrabIndicator({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      animate={isActive ? { y: [-5, 5, -5], scale: [1, 1.1, 1] } : { y: 0, scale: 1 }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className={`transition-all duration-500 ${isActive ? 'drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]' : 'opacity-60 saturate-50'}`}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 32C12 24 24 20 32 20C40 20 52 24 52 32C52 40 40 44 32 44C24 44 12 40 12 32Z" fill="#FB7185"/>
        <circle cx="24" cy="28" r="3" fill="#111827"/>
        <circle cx="40" cy="28" r="3" fill="#111827"/>
        {/* Legs and claws */}
        <path d="M16 36 L8 44 M48 36 L56 44" stroke="#FB7185" strokeWidth="4" strokeLinecap="round"/>
        <path d="M18 24 L10 16 M46 24 L54 16" stroke="#FB7185" strokeWidth="4" strokeLinecap="round"/>
        {/* Claws */}
        <circle cx="8" cy="14" r="5" fill="#E11D48"/>
        <circle cx="56" cy="14" r="5" fill="#E11D48"/>
      </svg>
    </motion.div>
  );
}
