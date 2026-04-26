"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Once the user scrolls past the hero, a smaller "voicevault" title
 * fades in and stays stuck to the top-left corner.
 */
export default function StickyTitle() {
  const { scrollYProgress } = useScroll();

  // Show sticky title after ~20% scroll (past the hero)
  const opacity = useTransform(scrollYProgress, [0.08, 0.14], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] px-6 py-4 pointer-events-none"
      style={{ opacity }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="pointer-events-auto text-2xl sm:text-3xl font-black tracking-tighter text-white select-none cursor-pointer hover:opacity-80 transition-opacity duration-300"
        style={{
          textShadow:
            "0 0 30px rgba(147,197,253,0.4), 0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        VoiceVault
      </button>
    </motion.div>
  );
}
