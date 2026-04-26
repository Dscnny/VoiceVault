import type { Metadata, Viewport } from "next";
import { ServiceProvider } from "@/lib/serviceContainer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceVault",
  description:
    "The Edge-Computed Clinical Telemetry Engine. Voice journaling that stays on your device.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VoiceVault",
  },
};

export const viewport: Viewport = {
  themeColor: "#f0f2f5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <ServiceProvider mode="production">{children}</ServiceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
