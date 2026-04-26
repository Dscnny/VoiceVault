"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="col-span-4 sm:col-span-8 rounded-4xl glass shadow-bento p-10 mt-5 relative overflow-hidden flex flex-col items-center">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-fuchsia-100 rounded-full blur-3xl opacity-40 mix-blend-multiply" />
      <div className="relative z-10 w-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-200">
             {user.picture ? (
               <img src={user.picture} alt={user.name || "Profile"} className="w-14 h-14 rounded-2xl object-cover" />
             ) : (
               <UserIcon className="w-7 h-7 text-white" />
             )}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
              Welcome, {user.name || user.email}
            </h2>
            <p className="text-slate-500 font-medium text-sm">Logged in as <span className="font-bold text-slate-700">{user.email}</span></p>
          </div>
        </div>

        <div className="bg-white/60 p-4 rounded-2xl w-full text-xs font-mono text-slate-600 overflow-x-auto border border-white">
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
