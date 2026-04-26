"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, PenLine } from "lucide-react";
import { motion } from "framer-motion";

export default function TypingPage() {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 animate-pulse shadow-lg shadow-blue-200" />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #dbeafe 0%, #d4e4fe 50%, #ede9fe 100%)" }}>
      <div className="blob w-[400px] h-[400px] bg-blue-200 top-[-5%] left-[20%]" />
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-12 pb-24">
        <Link href="/vault" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-cyan-600 mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Vault
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-200 mx-auto mb-8">
            <PenLine className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800 mb-4">Typing Journal</h1>
          <p className="text-slate-400 text-lg font-medium max-w-md mx-auto">
            A text-based journaling experience is coming soon. Write down how you feel without speaking.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
