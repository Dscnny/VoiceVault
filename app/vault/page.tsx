"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, PenLine, Brain, User, LogOut } from "lucide-react";
import Link from "next/link";

const VAULT_ITEMS = [
  {
    title: "Start Chat",
    description: "Voice journal your thoughts",
    icon: <Mic className="w-8 h-8" />,
    href: "/patient",
    gradient: "from-violet-500 to-fuchsia-500",
    shadow: "shadow-violet-200",
  },
  {
    title: "Typing",
    description: "Write down how you feel",
    icon: <PenLine className="w-8 h-8" />,
    href: "/vault/typing",
    gradient: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-200",
  },
  {
    title: "Reflecting",
    description: "Review patterns and insights",
    icon: <Brain className="w-8 h-8" />,
    href: "/provider",
    gradient: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-200",
  },
  {
    title: "Profile",
    description: "Your account and settings",
    icon: <User className="w-8 h-8" />,
    href: "/vault/profile",
    gradient: "from-amber-500 to-orange-400",
    shadow: "shadow-amber-200",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.1 + i * 0.08, type: "spring" as const, stiffness: 100, damping: 20 },
  }),
};

export default function VaultPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 animate-pulse shadow-lg shadow-violet-200" />
      </main>
    );
  }

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #dbeafe 0%, #d4e4fe 30%, #ddd6fe 70%, #ede9fe 100%)",
      }}
    >
      {/* Background blobs */}
      <div className="blob w-[400px] h-[400px] bg-violet-200 top-[-5%] right-[10%]" />
      <div className="blob w-[350px] h-[350px] bg-cyan-100 bottom-[10%] left-[-5%]" />

      {/* Logout button — top-right */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110]">
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass shadow-sm hover:shadow-md hover:bg-white/80 active:scale-95 transition-all text-sm font-bold text-slate-700"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-14 pb-24 sm:pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-slate-800 leading-[0.9] mb-4">
            Your
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400">
              Vault
            </span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 🐠
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {VAULT_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <Link
                href={item.href}
                className="block group rounded-3xl glass shadow-bento p-8 sm:p-10 relative overflow-hidden hover:shadow-bento-hover hover:-translate-y-1 transition-all duration-500"
              >
                <div
                  className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-30 bg-gradient-to-br ${item.gradient}`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg ${item.shadow} mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-1.5">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
