"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => loginWithRedirect()}
            disabled={!mounted || isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {(!mounted || isLoading) ? "Loading..." : "Sign In with Auth0"}
          </button>
        </div>
      </div>
    </div>
  );
}
