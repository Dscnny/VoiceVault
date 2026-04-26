import Link from "next/link";
import { Mic, Activity, Lock, Shield, Cpu, Database } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* ─── Decorative blobs BEHIND the glass ─── */}
      <div className="blob w-[500px] h-[500px] bg-violet-300 top-[-10%] left-[-5%] animate-blob-morph" />
      <div className="blob w-[600px] h-[600px] bg-fuchsia-200 top-[10%] right-[-10%] animate-blob-morph" style={{ animationDelay: "2s" }} />
      <div className="blob w-[400px] h-[400px] bg-cyan-200 bottom-[5%] left-[30%] animate-blob-morph" style={{ animationDelay: "4s" }} />
      <div className="blob w-[300px] h-[300px] bg-amber-100 top-[60%] right-[10%] animate-blob-morph" style={{ animationDelay: "6s" }} />

      {/* ─── Content ─── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">

        {/* ─── Hero ─── */}
        <div className="text-center mb-20 stagger-children">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-strong shadow-glass text-xs font-bold text-slate-600 mb-8 tracking-wide uppercase">
            <Lock className="w-3.5 h-3.5 text-violet-600" />
            100% On-Device · Zero Servers
          </div>

          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400">
              Voice
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-600">
              Vault
            </span>
          </h1>

          <p className="text-slate-500 text-xl sm:text-2xl max-w-xl mx-auto leading-relaxed font-medium">
            Voice journaling that never leaves your device.
            <br className="hidden sm:block" />
            <span className="text-slate-400">Clinical-grade. Edge-computed. Yours.</span>
          </p>
        </div>

        {/* ─── Bento Grid ─── */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 sm:gap-5 max-w-4xl mx-auto stagger-children">

          {/* Patient card — spans 5 cols on desktop */}
          <Link
            href="/patient"
            id="patient-link"
            className="col-span-4 sm:col-span-5 group relative overflow-hidden rounded-4xl glass shadow-bento hover:shadow-bento-hover p-10 sm:p-12 transition-all duration-500 hover:-translate-y-1.5 active:scale-[0.98]"
          >
            {/* decorative blob behind the glass */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-violet-200 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-200 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 mb-3">
                Patient Vault
              </h2>
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed font-medium max-w-sm mb-8">
                Speak for two minutes before bed. Your voice never leaves the device.
              </p>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-bold shadow-lg shadow-violet-200 group-hover:shadow-xl group-hover:shadow-violet-300 group-hover:scale-105 active:scale-95 transition-all duration-300">
                Start Recording
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>

          {/* Provider card — spans 3 cols on desktop */}
          <Link
            href="/provider"
            id="provider-link"
            className="col-span-4 sm:col-span-3 group relative overflow-hidden rounded-4xl glass shadow-bento hover:shadow-bento-hover p-10 sm:p-12 transition-all duration-500 hover:-translate-y-1.5 active:scale-[0.98]"
          >
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-200 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-200 mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 mb-3">
                Provider<br />Dashboard
              </h2>
              <p className="text-slate-500 text-base leading-relaxed font-medium mb-8">
                90-second intake dossier. Replaces 5 hours.
              </p>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-white text-sm font-bold shadow-lg shadow-cyan-200 group-hover:shadow-xl group-hover:shadow-cyan-300 group-hover:scale-105 active:scale-95 transition-all duration-300">
                Open Dashboard
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>

          {/* Feature tiles — small bento squares */}
          <div className="col-span-2 sm:col-span-3 rounded-4xl glass shadow-bento p-8 sm:p-10 flex flex-col justify-between group hover:shadow-bento-hover hover:-translate-y-1 transition-all duration-500">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-800 mb-1">0</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Bytes uploaded</div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-3 rounded-4xl glass shadow-bento p-8 sm:p-10 flex flex-col justify-between group hover:shadow-bento-hover hover:-translate-y-1 transition-all duration-500">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Cpu className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-800 mb-1">WebGPU</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">DistilBERT in-browser</div>
            </div>
          </div>

          <div className="col-span-4 sm:col-span-2 rounded-4xl glass shadow-bento p-8 sm:p-10 flex flex-col justify-between group hover:shadow-bento-hover hover:-translate-y-1 transition-all duration-500">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Database className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-800 mb-1">IndexedDB</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Sandboxed vault</div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
