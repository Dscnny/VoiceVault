# VoiceVault

**100% On-Device Clinical NLP & Edge Storage Engine.**

VoiceVault is a local-first audio transcription and sentiment analysis engine built for absolute data privacy. Operating entirely within the browser sandbox, the system leverages WebGPU-accelerated transformer models and IndexedDB to deliver clinical-grade NLP without a single network round-trip.

Unlike traditional cloud-dependent applications, VoiceVault is architected as an "airgapped" edge compute node. It requires zero server communication, zero API keys, and explicitly enforces a zero-network-hop boundary for all user data.

---

### The Compute Path: Edge Inference & Hardware Delegation

The core execution loop bypasses traditional backend processing by running machine learning inference directly against the client's GPU via WebAssembly and WebGPU.

* **WebGPU Hardware Delegation:** The `TransformersIntelligenceService` initializes by probing the `navigator.gpu` adapter. If available, tensor operations are instantly delegated to the client's local GPU, bypassing the CPU entirely for matrix multiplications. 
* **Single-Threaded WASM Fallback:** Due to known Webpack/Next.js App Router constraints regarding dynamic WASM blob imports, multi-threading (`numThreads`) is explicitly clamped to `1`. The system intentionally forces execution onto a single thread to guarantee deterministic module loading within the React lifecycle.
* **Asynchronous Ingress:** Data is ingested via the native Web Speech API. To prevent locking the main thread UI, speech streams are processed via asynchronous `onresult` event callbacks, relying on the V8 engine's microtask queue rather than aggressive polling or spinning.

### Algorithmic Rigor: Clinical Sentiment & Heuristics

The NLP pipeline is optimized for constrained, client-side execution environments, avoiding heavy generative models in favor of targeted classification heuristics.

* **DistilBERT Classification:** The engine runs a pre-trained DistilBERT model (`Xenova/distilbert-base-uncased-finetuned-sst-2-english`) compiled to WASM. It maps raw inference confidence scores into a normalized $[-1, 1]$ polarity scale (where $-1$ is maximum negative sentiment and $1$ is maximum positive sentiment).
* **Heuristic Keyword Extraction:** Rather than utilizing computationally expensive Named Entity Recognition (NER), the system implements a Term Frequency (TF)-style heuristic. It executes a rigorous $O(N)$ filter against a hardcoded `Set` of over 100 medical-aware stopwords to isolate high-value clinical terminology in real-time.

### Memory Architecture & Persistence 

Because the system operates in a JavaScript environment, explicit zero-allocation (`malloc`/`free`) architectures are impossible. Instead, VoiceVault optimizes for the V8 Garbage Collector and local browser limits.

* **B-Tree Edge Storage:** The `DexieStorageService` replaces external SQL databases with an IndexedDB layer. Data is structured using client-side B-Trees, enabling `O(log N)` time complexity for range queries (e.g., fetching journal entries via `between(startDate, endDate)`).
* **V8 Memory Management:** The application accepts standard JavaScript AoS (Array of Structs) memory layouts. Memory pressure is delegated to the browser's native garbage collector, with state updates batched into React's render cycles to mitigate GC pause times during active speech transcription.

### The Network Boundary: Zero-I/O

The defining architectural constraint of VoiceVault is its lack of a network layer. 

* **No Binary Protocols:** There are no WebSockets, UDP multicasts, or Server-Sent Events.
* **Complete Isolation:** Once the initial static assets (HTML/JS/WASM models) are cached by the browser, the application effectively goes offline. All data ingestion, transformer inference, and state persistence execute behind the browser's security sandbox.

### Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Shell** | Next.js 14 (App Router) + React | UI rendering and asynchronous event management. |
| **Inference Engine** | Transformers.js (WebGPU/WASM) | Local execution of DistilBERT sentiment models. |
| **Ingress** | Web Speech API | Native browser audio capture and transcription. |
| **Persistence** | Dexie.js (IndexedDB) | Relational, zero-network edge database. |
| **Language** | TypeScript | Strict type enforcement across service boundaries. |

### Getting Started

Because VoiceVault is an edge-compute application, the "backend" is entirely bundled into the client execution environment.

```bash
# Clone and install dependencies
git clone [https://github.com/daohhuynh/voicevault.git](https://github.com/daohhuynh/voicevault.git)
cd voicevault
npm install

# Boot the local edge environment
npm run dev