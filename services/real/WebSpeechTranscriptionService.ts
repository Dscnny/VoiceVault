/**
 * WebSpeechTranscriptionService — real on-device transcription using the
 * browser's Web Speech API.
 *
 * On Chrome/Edge desktop, recognition runs through the browser's built-in
 * speech engine. On modern Chrome it can use the on-device speech model
 * when available. No audio is uploaded to our servers — we don't have any.
 *
 * For the strongest privacy story (fully verifiable, no Google involvement),
 * see WhisperTranscriptionService for transformers.js + Whisper.
 */
import type {
  AudioRecordingIntent,
  AudioTranscriptionService,
  PartialTranscriptCallback,
  RecordingController,
  TranscriptionResult,
} from "@/services/interfaces/AudioTranscriptionService";

// SpeechRecognition is vendor-prefixed in some browsers
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
      throw new Error(
        "Speech recognition not available in this browser. Try Chrome or Edge."
      );
    }

    // Request mic permission upfront — gives a clearer error than letting
    // SpeechRecognition fail mysteriously.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // We don't actually need to keep this stream; SpeechRecognition opens
      // its own. Stop tracks immediately.
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
    let stopped = false;
    let cancelled = false;

    let resolveStop: ((r: TranscriptionResult) => void) | null = null;
    let rejectStop: ((e: Error) => void) | null = null;
    const stopPromise = new Promise<TranscriptionResult>((res, rej) => {
      resolveStop = res;
      rejectStop = rej;
    });

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
      if (rejectStop) rejectStop(new Error(`Speech recognition error: ${err}`));
    };

    recognition.onend = () => {
      if (cancelled) return;
      const durationSeconds = (performance.now() - startTime) / 1000;
      const transcript = (finalTranscript + interimTranscript).trim();
      if (resolveStop) resolveStop({ transcript, durationSeconds });
    };

    recognition.start();

    // Optional max duration timer
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
          recognition.stop();
        }
        return stopPromise;
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
