/**
 * WebSpeechTranscriptionService — real on-device transcription using the
 * browser's Web Speech API.
 */
import type {
  AudioRecordingIntent,
  AudioTranscriptionService,
  PartialTranscriptCallback,
  RecordingController,
  TranscriptionResult,
} from "@/services/interfaces/AudioTranscriptionService";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getSpeechRecognitionConstructor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

// Errors that are recoverable — Chrome fires these during silence or
// briefly on restart and they shouldn't kill the session.
const RECOVERABLE_ERRORS = new Set(["no-speech", "network", "audio-capture", "aborted"]);

export class WebSpeechTranscriptionService implements AudioTranscriptionService {
  isAvailable(): boolean {
    return getSpeechRecognitionConstructor() !== null;
  }

  async startRecording(
    intent: AudioRecordingIntent,
    onPartial?: PartialTranscriptCallback
  ): Promise<RecordingController> {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor) {
      throw new Error("Speech recognition not available in this browser. Try Chrome or Edge.");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch (e) {
      throw new Error("Microphone permission denied");
    }

    const recognition = new Ctor();
    recognition.lang = intent.locale ?? "en-US";
    recognition.continuous = true;
    recognition.interimResults = intent.enablePartialResults ?? true;

    let finalTranscript = "";
    let interimTranscript = "";
    const startTime = performance.now();
    let pausedAt: number | null = null;
    let pausedDurationMs = 0;

    // Lifecycle flags
    let stopped = false;       // user pressed upload/stop — finalize
    let cancelled = false;     // user cancelled — discard
    let paused = false;        // user paused — keep transcript, don't restart
    let restarting = false;    // we're intentionally cycling recognition

    let resolveStop: ((r: TranscriptionResult) => void) | null = null;
    let rejectStop: ((e: Error) => void) | null = null;
    const stopPromise = new Promise<TranscriptionResult>((res, rej) => {
      resolveStop = res;
      rejectStop = rej;
    });

    const finalize = () => {
      const elapsedMs = performance.now() - startTime - pausedDurationMs;
      const durationSeconds = elapsedMs / 1000;
      const transcript = (finalTranscript + interimTranscript).trim();
      if (resolveStop) resolveStop({ transcript, durationSeconds });
    };

    recognition.onresult = (event: any) => {
      interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += text + " ";
        } else {
          interimTranscript += text;
        }
      }
      onPartial?.((finalTranscript + interimTranscript).trim());
    };

    recognition.onerror = (event: any) => {
      if (cancelled) return;
      const err = event?.error ?? "unknown";

      // Silently swallow recoverable errors — onend will fire next and we'll
      // either restart (if still recording) or finalize (if user stopped).
      if (RECOVERABLE_ERRORS.has(err)) {
        console.warn(`[Speech] recoverable error: ${err}`);
        return;
      }

      // Real error — reject only if user is awaiting stop.
      console.error(`[Speech] fatal error: ${err}`);
      if (stopped && rejectStop) {
        rejectStop(new Error(`Speech recognition error: ${err}`));
      }
    };

    recognition.onend = () => {
      if (cancelled) return;

      // User paused — don't auto-restart. Resume will start a new session.
      if (paused) return;

      // User pressed upload — finalize the transcript.
      if (stopped) {
        finalize();
        return;
      }

      // Recognition ended on its own (silence timeout, network blip, etc.)
      // Restart it to keep the session alive.
      restarting = true;
      try {
        recognition.start();
      } catch (e) {
        // start() throws if recognition is already running — safe to ignore.
        console.warn("[Speech] restart failed", e);
      }
      restarting = false;
    };

    recognition.start();

    if (intent.maxDurationSeconds) {
      setTimeout(() => {
        if (!stopped && !cancelled) {
          stopped = true;
          recognition.stop();
        }
      }, intent.maxDurationSeconds * 1000);
    }

    return {
      stop: async () => {
        if (!stopped && !cancelled) {
          stopped = true;
          // If currently paused, recognition is already stopped — finalize directly.
          if (paused) {
            finalize();
          } else {
            recognition.stop();
          }
        }
        return stopPromise;
      },
      pause: () => {
        if (paused || stopped || cancelled) return;
        paused = true;
        pausedAt = performance.now();
        try {
          recognition.stop();
        } catch {
          /* ignore */
        }
      },
      resume: () => {
        if (!paused || stopped || cancelled) return;
        if (pausedAt !== null) {
          pausedDurationMs += performance.now() - pausedAt;
          pausedAt = null;
        }
        paused = false;
        try {
          recognition.start();
        } catch (e) {
          console.warn("[Speech] resume failed", e);
        }
      },
      cancel: () => {
        cancelled = true;
        try {
          recognition.abort();
        } catch {
          /* ignore */
        }
      },
    };
  }
}