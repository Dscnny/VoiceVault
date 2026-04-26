# ═══════════════════════════════════════════════════════════════════════════════
# VoiceVault — AI Agent Rules (Hackathon Strike Team Edition)
# ═══════════════════════════════════════════════════════════════════════════════
# All AI coding agents (Cursor, Windsurf, Copilot, Claude) MUST follow these
# rules when generating or modifying code in this repository.
# Last updated: 2026-04-25 — Hackathon Day 1 (v2: Strike Team Delegation)
# ═══════════════════════════════════════════════════════════════════════════════

## Project Identity
- App name: VoiceVault
- Platform: Web (desktop + mobile browser; no React Native)
- Language: TypeScript 5 (strict mode enabled)
- Framework: Next.js 14 (App Router)
- UI: React 18 + Tailwind CSS v3 + lucide-react icons
- Persistence: Dexie (IndexedDB wrapper) — NO external databases, no servers
- ML: @xenova/transformers (DistilBERT sentiment, MiniLM embeddings — all on-device)
- Charts: Recharts

## ═══ TEAM STRUCTURE: 24-HOUR STRIKE TEAM ═══

### This is NOT an enterprise project. This is a 24-hour hackathon.
### Optimize for DEMO QUALITY and INTEGRATION SPEED, not clean separation.

### Team Roles & Directory Ownership

```
┌──────────────────────────────────────────────────────────────────────┐
│  Dev 1 — Systems Integrator & Pipeline Lead                         │
│  Owns: services/real/, services/interfaces/, lib/serviceContainer.tsx│
│  Mission: Web Speech API + transformers.js pipeline.                │
│           Gatekeeper of ServiceContainer and all service interfaces. │
│           If an interface needs amending at 2 AM, Dev 1 decides.    │
├──────────────────────────────────────────────────────────────────────┤
│  Dev 2 — Local Intelligence & Storage (The "Brain")                 │
│  Owns: services/real/TransformersIntelligenceService.ts,            │
│        services/real/DexieStorageService.ts, types/                 │
│        services/mock/MockIntelligenceService.ts,                    │
│        services/mock/MockStorageService.ts                          │
│  Mission: DistilBERT → sentiment/embedding → Dexie in ONE flow.     │
│           Owns the entire data lifecycle: analyze text, persist,     │
│           and serve queries. Eliminates the NLP↔Storage seam.       │
├──────────────────────────────────────────────────────────────────────┤
│  Dev 3 — Patient "Vault" Architect (Consumer UI)                    │
│  Owns: app/patient/, components/patient/                            │
│  Mission: Build the patient recording UI and logic.                 │
│           Pulls exclusively from useServices().transcription and    │
│           useServices().storage via the ServiceContainer hook.       │
│           You have full autonomy over UI design and UX.             │
├──────────────────────────────────────────────────────────────────────┤
│  Dev 4 — Clinical Data Viz Lead (Provider UI)                       │
│  Owns: app/provider/, components/provider/                          │
│  Mission: Build the clinical data viz dashboard.                    │
│           Uses useServices().storage + useServices().empathy to     │
│           pull realistic SSRI/migraine/sleep-apnea mock data.       │
│           You have full autonomy over UI design and UX.             │
└──────────────────────────────────────────────────────────────────────┘
```

### Why This Split
- **Two UI devs = 2x output.** Patient and Provider are different apps.
  Splitting them doubles output.
- **Brain owns ML→DB.** The tightest coupling in the system (transformers.js
  output → Dexie persistence) lives in ONE person's head.
- **Mock safety net.** If real services fail at 6 AM, switch
  `ServiceProvider mode="preview"` in the root layout. Judges see realistic
  clinical data, you still have a competitive demo.

### ⚠️  CONFLICT RULES
- Do NOT modify files outside your owned directories.
- `services/interfaces/` and `lib/serviceContainer.tsx` are LOCKED. Only Dev 1 can amend them.
- If you need a contract change, message Dev 1. Do not self-serve.
- UI devs (Dev 3 & Dev 4): you are FULLY AUTONOMOUS within your own
  `app/` and `components/` subdirectories. You do not need approval
  to build any component. If you need a button, build it. Go fast.

## ═══ ARCHITECTURE MANDATES ═══

### 1. Service Interface Pattern
- Every service boundary MUST be defined as a TypeScript `interface` FIRST.
- Interfaces live in `services/interfaces/`.
- Real implementations live in `services/real/`.
- Mock implementations live in `services/mock/`.
- Never import a concrete service class inside a component or page —
  always consume via `useServices()` from `lib/serviceContainer.tsx`.

### 2. Dependency Injection via ServiceContainer
- `lib/serviceContainer.tsx` is the single source of truth for wiring.
- Three modes: `production` (real pipeline), `preview` (all mocks),
  `hybrid` (real storage + mock ML).
- Components access services only through `useServices()`:
  ```tsx
  const { transcription, storage, empathy } = useServices();
  ```
- Never call `new DexieStorageService()` or any concrete class inside a
  component. This breaks the mock safety net.

### 3. React Component Rules
- Use **function components only** — no class components.
- Local state via `useState` / `useReducer`. Server state via `useEffect`
  calling service methods.
- Custom hooks live in `hooks/` and are named `use<Name>.ts`.
- Page files (`app/**/page.tsx`) should be thin: they compose components,
  they do not contain logic or JSX beyond a single screen-level layout.
- Maximum file length: 200 lines. Decompose into subcomponents if exceeded.

### 4. TypeScript Strictness
- `strict: true` is set in `tsconfig.json`. Never disable it.
- No `any` types. Use `unknown` and narrow. If you're reaching for `any`,
  reconsider the design.
- All service interface methods that perform I/O MUST return `Promise<T>`.
- Type definitions for shared domain objects live in `types/`.

### 5. Async / Concurrency
- All async work uses `async/await`. No raw `.then()` chains.
- Transformers.js model loading is slow. Initiate it eagerly (top-level
  `await` in the service constructor or a dedicated `init()` call at app
  startup). Never lazy-load it inside a click handler.
- Handle `AbortController` for any long-running stream (e.g., speech
  recognition) so cleanup happens on component unmount.

## ═══ FILE & CODE ORGANIZATION ═══

### 6. File Naming Conventions
- React components: `PascalCase.tsx` — one component per file.
- Hooks: `useCamelCase.ts`.
- Services / utilities: `PascalCaseName.ts`.
- Types: `PascalCaseName.ts` in `types/`.
- Next.js conventions override the above for routing files
  (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).

### 7. Directory Structure
```
app/
  patient/page.tsx          ← Patient recording flow
  provider/page.tsx         ← Provider dashboard
  layout.tsx                ← Root layout; wraps <ServiceProvider>
  globals.css
components/
  patient/                  ← Dev 3's components
  provider/                 ← Dev 4's components
services/
  interfaces/               ← TypeScript interfaces (LOCKED)
  real/                     ← Production implementations
  mock/                     ← Mock implementations
types/                      ← Shared domain types (JournalEntry, etc.)
hooks/                      ← Shared custom hooks
lib/
  serviceContainer.tsx      ← DI wiring (LOCKED)
```

- Patient components go in `components/patient/`.
- Provider components go in `components/provider/`.
- There is NO `components/shared/` directory. Do not create one.
- **DRY does NOT apply to UI components in this hackathon.** Duplicate freely.
  Coordination costs more than redundancy. Refactor after the demo.

### 8. Styling
- Tailwind CSS only — no inline `style` objects, no CSS Modules.
- Color tokens defined in `tailwind.config.ts` (`bg-bg-card`, `text-accent`,
  etc.) MUST be used instead of raw Tailwind palette colors.
- Dark theme is the only supported theme.

### 9. Documentation
- Public interfaces and exported functions MUST have a JSDoc comment
  explaining purpose, parameters, and return values.
- Use `// MARK: -` style section comments for files longer than 50 lines.
- Leave a `// TODO: [owner]` comment for any incomplete implementation.

## ═══ DATA MODEL ═══

### 10. Types Discipline
- All shared domain types live in `types/` and are plain TypeScript interfaces
  — no classes, no decorators, no runtime overhead.
- Types MUST NOT import from React or Next.js. They are pure data contracts.
- Types MUST NOT contain business logic — that belongs in services.
- Dexie schema changes require a version bump in `DexieStorageService.ts`.

## ═══ PROHIBITED PATTERNS ═══

The following patterns are BANNED and must NEVER appear in this codebase:

```
❌  Class components
❌  any type (use unknown + narrowing)
❌  Raw fetch() calls to external servers (all ML is on-device)
❌  Importing concrete service classes inside components or pages
❌  new DexieStorageService() / new TransformersIntelligenceService() in UI code
❌  console.log() in production paths (use a consistent logger or remove)
❌  Inline style={{ }} objects (use Tailwind)
❌  Page files over 200 lines (decompose into components)
❌  Patient UI dev touching services/ or types/ directly
❌  Provider UI dev touching services/ or types/ directly
❌  Any third-party npm package without team lead approval
```

## ═══ GIT CONVENTIONS ═══

### 11. Commit Messages
- Format: `[module] brief description`
- Examples:
  - `[pipeline] implement Web Speech API streaming transcription`
  - `[brain] integrate DistilBERT sentiment with Dexie persistence`
  - `[patient-ui] add recording screen layout`
  - `[provider-ui] build sentiment trend chart`

### 12. Branch Strategy
- `main` — stable, buildable at all times (`npm run build` must pass)
- `feature/<developer>/<module>` — individual work branches
- Merge via PR with at least 1 approval

## ═══ HACKATHON EMERGENCY PROTOCOL ═══

### 13. The 6 AM Failsafe
If at any point a real service implementation is broken and blocking the demo:
1. Change `mode="production"` to `mode="preview"` in `app/layout.tsx`
   on the `<ServiceProvider>` component.
2. The mock data is medical-grade realistic. Judges will not notice.
3. Prioritize a WORKING demo over a COMPLETE implementation.
4. A beautiful app with mock data beats a broken app with real data.
