"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  if (typeof window === "undefined") {
    // During SSR, just render children without Auth0 tracking
    // The Auth0 state will initialize once hydrated on the client
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain="dev-0ckb8z1lkfwt7tu2.us.auth0.com"
      clientId="NGU75LwhROhRhgRRHbNgDe4TN3M0eTP0"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      onRedirectCallback={(appState) => {
        router.replace(appState?.returnTo || "/vault");
      }}
    >
      {children}
    </Auth0Provider>
  );
}
