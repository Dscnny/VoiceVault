import type { Metadata, Viewport } from "next";
import { ServiceProvider } from "@/lib/serviceContainer";
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
  themeColor: "#0a0a0b",
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
    <html lang="en" className="dark">
      <body className="bg-bg text-text-primary min-h-screen">
        <ServiceProvider mode="production">{children}</ServiceProvider>
      </body>
    </html>
  );
}
