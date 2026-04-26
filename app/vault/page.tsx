"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Mic, PenLine, BarChart3, User, LogOut } from "lucide-react";
import Link from "next/link";

/* ─── Feature cards config ─── */
const VAULT_CARDS = [
  {
    title: "Talk It Out",
    description: "Voice journal your thoughts",
    icon: Mic,
    href: "/patient",
  },
  {
    title: "Type a Reflection",
    description: "Write down how you feel",
    icon: PenLine,
    href: "/vault/typing",
  },
  {
    title: "View My Patterns",
    description: "Review patterns & insights",
    icon: BarChart3,
    href: "/provider",
  },
  {
    title: "Profile",
    description: "Your account & settings",
    icon: User,
    href: "/vault/profile",
  },
];

/* ─── Framer Motion variants ─── */
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 80, damping: 18 },
  },
} as const;

const titleVariants = {
  hidden: { opacity: 0, y: -30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 60, damping: 20, delay: 0.1 },
  },
} as const;

/* ─── Floating bubbles (decorative) ─── */
function Bubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: 4 + Math.random() * 14,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 10,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full vault-bubble"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: `-${b.size}px`,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(180,210,255,0.2))",
            opacity: b.opacity,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Sparkle dots (decorative) ─── */
function Sparkles() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        size: 2 + Math.random() * 3,
        left: 5 + Math.random() * 90,
        top: 5 + Math.random() * 90,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full vault-sparkle"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.left}%`,
            top: `${s.top}%`,
            background: "white",
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Corner flourish SVG (sketch accent) ─── */
function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 30 Q2 10, 16 6 Q6 6, 4 2"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   Main Vault Page
   ═══════════════════════════════════════════════ */
export default function VaultPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 animate-pulse shadow-lg shadow-indigo-500/30" />
      </main>
    );
  }

  return (
    <main className="vault-page min-h-screen relative overflow-hidden">
      {/* ── Layer 1: Jellyfish background image ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/jellyfish.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ── Layer 2: Dark overlay for readability ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,15,40,0.55) 0%, rgba(20,10,60,0.50) 40%, rgba(15,20,55,0.60) 100%)",
        }}
      />

      {/* ── Layer 3: Subtle colour wash ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(120,100,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(80,140,255,0.10) 0%, transparent 50%)",
        }}
      />

      {/* ── Layer 4: Bubbles & sparkles ── */}
      {mounted && (
        <>
          <Bubbles />
          <Sparkles />
        </>
      )}

      {/* ── Header ── */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 pt-5 pb-2">
        {/* Brand */}
        <Link
          href="/"
          className="text-lg sm:text-xl font-black tracking-tight text-white/90 hover:text-white transition-colors"
        >
          VoiceVault
        </Link>

        {/* Nav pills */}
        <div className="flex items-center gap-3">
          <span className="vault-pill px-4 py-2 rounded-full text-sm font-semibold text-white/90 bg-white/10 backdrop-blur-md border border-white/15">
            Your Vault
          </span>
          <Link
            href="/"
            className="vault-pill px-4 py-2 rounded-full text-sm font-semibold text-white/90 bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 transition-all"
          >
            Home
          </Link>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            className="vault-pill px-4 py-2 rounded-full text-sm font-semibold text-white/90 bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 active:scale-95 transition-all inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-10 sm:pt-16 pb-20">
        {/* Hero title */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate="show"
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block relative">
            {/* Glowing backdrop behind title */}
            <div
              className="absolute -inset-x-10 -inset-y-4 rounded-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(100,80,200,0.20) 0%, transparent 70%)",
              }}
            />
            <h1 className="relative text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-white leading-none vault-title">
              YOUR VAULT
            </h1>
          </div>
          <p className="mt-4 text-base sm:text-lg text-indigo-200/70 font-medium">
            Welcome back
            {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            <span className="ml-1.5 inline-block animate-float">🐠</span>
          </p>
        </motion.div>

        {/* Feature card grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {VAULT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} variants={cardVariants}>
                <Link
                  href={card.href}
                  className="vault-card group block relative rounded-2xl sm:rounded-3xl p-8 sm:p-10 overflow-hidden transition-all duration-300"
                >
                  {/* Card background */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl vault-card-bg" />

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 vault-card-glow" />

                  {/* Sketch corner accents */}
                  <CornerFlourish className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CornerFlourish className="absolute bottom-3 right-3 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-white/15 transition-all duration-300 border border-white/10">
                      <Icon className="w-7 h-7 text-white/90" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight">
                      {card.title}
                    </h2>
                    <p className="text-sm text-indigo-200/60 font-medium leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
}
