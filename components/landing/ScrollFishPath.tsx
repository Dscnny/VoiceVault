"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Fish from "./Fish";

/**
 * SVG overlay that draws a hand-drawn winding path down the page.
 * A Fish component follows the path based on scroll position.
 *
 * HOW TO EDIT THE PATH:
 *   Change the `PATH_D` constant below to redraw the route.
 *   It uses standard SVG path commands (M, C, S, Q, L, etc.).
 *   Coordinates are in viewport-relative pixels for a 1440-wide design.
 *   The path is automatically scaled to fill the container height.
 */

// ─── Edit this path to change the fish's route ───
// The path winds left → right → left through 4 content sections.
// Y range: 0 → 3800 (covers hero + 4 sections at ~700px each)
const PATH_D = `
  M 720 100
  C 900 300, 1050 450, 950 650
  S 350 750, 300 950
  C 250 1150, 500 1300, 750 1400
  S 1100 1500, 1050 1700
  C 1000 1900, 400 1950, 350 2150
  S 600 2400, 800 2500
  C 1000 2600, 1100 2800, 900 2950
  S 400 3050, 350 3200
  C 300 3400, 700 3500, 720 3700
`;

export default function ScrollFishPath() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pos, setPos] = useState({ x: 720, y: 100, angle: 0 });
  const [pathReady, setPathReady] = useState(false);
  const [pageHeight, setPageHeight] = useState(3800);

  const { scrollYProgress } = useScroll();

  // Smooth the scroll progress to prevent jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.5,
  });

  // Measure page height on mount & resize
  useEffect(() => {
    const measure = () => {
      setPageHeight(document.documentElement.scrollHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    // Re-measure after images load
    window.addEventListener("load", measure);
    const timer = setTimeout(measure, 1000);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      clearTimeout(timer);
    };
  }, []);

  // Mark path ready after mount
  useEffect(() => {
    if (pathRef.current) {
      setPathReady(true);
    }
  }, []);

  // Track fish position along path
  const updateFishPosition = useCallback(
    (progress: number) => {
      const path = pathRef.current;
      if (!path) return;

      const totalLength = path.getTotalLength();
      const currentLength = progress * totalLength;
      const point = path.getPointAtLength(currentLength);

      // Calculate rotation from two nearby points
      const delta = Math.max(totalLength * 0.005, 2);
      const ahead = path.getPointAtLength(
        Math.min(currentLength + delta, totalLength)
      );
      const behind = path.getPointAtLength(Math.max(currentLength - delta, 0));
      const angle =
        Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * (180 / Math.PI);

      setPos({ x: point.x, y: point.y, angle });
    },
    []
  );

  // Subscribe to smooth progress changes
  useEffect(() => {
    if (!pathReady) return;
    const unsubscribe = smoothProgress.on("change", (v) => {
      updateFishPosition(v);
    });
    // Initialize position
    updateFishPosition(0);
    return unsubscribe;
  }, [smoothProgress, pathReady, updateFishPosition]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full pointer-events-none"
      style={{ height: pageHeight }}
      aria-hidden="true"
    >
      {/* ─── SVG overlay with the winding path ─── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 1440 3800`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Visible hand-drawn route line */}
        <path
          ref={pathRef}
          d={PATH_D}
          stroke="rgba(147, 197, 253, 0.2)"
          strokeWidth="3"
          strokeDasharray="12 8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* ─── The fish, absolutely positioned ─── */}
      {pathReady && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: 0,
            top: 0,
            x: `calc(${(pos.x / 1440) * 100}vw - 40px)`,
            y: `calc(${(pos.y / 3800) * pageHeight}px - 25px)`,
            rotate: pos.angle,
            zIndex: 50,
          }}
        >
          <Fish size={1.1} />
        </motion.div>
      )}
    </div>
  );
}
