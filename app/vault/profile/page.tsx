"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 animate-pulse shadow-lg shadow-amber-200" />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #dbeafe 0%, #d4e4fe 50%, #ede9fe 100%)" }}>
      <div className="blob w-[400px] h-[400px] bg-amber-100 top-[-5%] right-[10%]" />
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-12 pb-24">
        <Link href="/vault" className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-orange-600 mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Vault
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-4xl glass shadow-glass-lg p-10 sm:p-14 text-center">
            {user?.picture && (
              <img src={user.picture} alt="" className="w-20 h-20 rounded-full mx-auto mb-6 shadow-lg border-2 border-white/50" />
            )}
            <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-1">{user?.name || "User"}</h1>
            <p className="text-slate-400 font-medium mb-8">{user?.email}</p>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
