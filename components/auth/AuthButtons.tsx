"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { LogOut, LogIn, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

export function AuthButtons() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
  // Ensure we don't render auth mismatches between server and client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex gap-4 opacity-50 pointer-events-none">
        <div className="px-5 py-2.5 rounded-full bg-slate-200 animate-pulse w-24 h-10"></div>
        <div className="px-5 py-2.5 rounded-full bg-slate-200 animate-pulse w-24 h-10"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <button
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass shadow-sm hover:shadow-md hover:bg-white/80 active:scale-95 transition-all text-sm font-bold text-slate-700"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </button>
    );
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={() => loginWithRedirect()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass shadow-sm hover:shadow-md hover:bg-white/80 active:scale-95 transition-all text-sm font-bold text-slate-700"
      >
        <LogIn className="w-4 h-4" />
        Log In
      </button>
      <button
        onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 hover:scale-105 active:scale-95 transition-all text-sm font-bold"
      >
        <UserPlus className="w-4 h-4" />
        Sign Up
      </button>
    </div>
  );
}
