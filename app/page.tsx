import Link from "next/link";
import { Mic, Activity, Lock } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-card border border-border text-xs text-text-secondary mb-6 tabular-nums">
            <Lock className="w-3 h-3" />
            <span>100% on-device · zero servers</span>
          </div>
          <h1 className="text-5xl font-semibold tracking-tight mb-4">
            VoiceVault
          </h1>
          <p className="text-text-secondary text-lg max-w-lg mx-auto leading-relaxed">
            The edge-computed clinical telemetry engine. Voice journaling that
            never leaves your device — and a dossier your therapist can actually
            use.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/patient"
            className="group relative overflow-hidden rounded-2xl border border-border bg-bg-card p-6 hover:bg-bg-elevated transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Mic className="w-5 h-5 text-accent" />
              </div>
            </div>
            <h2 className="text-xl font-medium mb-2">Patient Vault</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Speak for two minutes before bed. Your voice never leaves the
              device.
            </p>
            <div className="mt-4 text-accent text-sm group-hover:translate-x-0.5 transition-transform">
              Start recording →
            </div>
          </Link>

          <Link
            href="/provider"
            className="group relative overflow-hidden rounded-2xl border border-border bg-bg-card p-6 hover:bg-bg-elevated transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-xl font-medium mb-2">Provider Dashboard</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              The intake dossier. 90 seconds of pre-session context that
              replaces five hours of intake.
            </p>
            <div className="mt-4 text-emerald-400 text-sm group-hover:translate-x-0.5 transition-transform">
              Open dashboard →
            </div>
          </Link>
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-text-primary text-sm font-medium mb-1">
              On-device transcription
            </div>
            <div className="text-text-tertiary text-xs">
              Web Speech API · no audio uploaded
            </div>
          </div>
          <div>
            <div className="text-text-primary text-sm font-medium mb-1">
              WebGPU sentiment
            </div>
            <div className="text-text-tertiary text-xs">
              DistilBERT in your browser
            </div>
          </div>
          <div>
            <div className="text-text-primary text-sm font-medium mb-1">
              IndexedDB vault
            </div>
            <div className="text-text-tertiary text-xs">
              Sandboxed to your origin
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
