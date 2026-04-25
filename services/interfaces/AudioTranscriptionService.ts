/**
 * AudioTranscriptionService interface — ported from Swift
 * `Protocols/AudioTranscriptionServiceProtocol.swift`.
 *
 * Defines the contract for capturing audio from the user's microphone and
 * producing a transcript. ALL processing happens on-device.
 */

export interface AudioRecordingIntent {
  /** Locale tag (e.g., "en-US"). Defaults to browser locale. */
  locale?: string;
  /** Stream partial transcripts during recording. */
  enablePartialResults?: boolean;
  /** Maximum recording duration in seconds. undefined = unlimited. */
  maxDurationSeconds?: number;
}

export interface TranscriptionResult {
  /** Final, full transcript string. */
  transcript: string;
  /** Recording duration in seconds. */
  durationSeconds: number;
}

export type TranscriptionError =
  | { kind: "microphonePermissionDenied" }
  | { kind: "speechRecognitionPermissionDenied" }
  | { kind: "recognizerUnavailable"; locale: string }
  | { kind: "recognitionFailed"; reason: string }
  | { kind: "audioEngineFailure"; reason: string };

/**
 * Callback for streaming partial transcripts during recording.
 * Fired repeatedly as the speech recognizer produces interim results.
 */
export type PartialTranscriptCallback = (partial: string) => void;

export interface AudioTranscriptionService {
  /**
   * Begin recording from the microphone. Returns a controller you can use
   * to stop the recording and await the final transcript.
   *
   * @param intent — recording configuration
   * @param onPartial — optional callback fired with interim transcripts
   * @throws TranscriptionError on permission denial or hardware failure
   */
  startRecording(
    intent: AudioRecordingIntent,
    onPartial?: PartialTranscriptCallback
  ): Promise<RecordingController>;

  /** Whether the device/browser supports on-device speech recognition. */
  isAvailable(): boolean;
}

/**
 * Handle returned from startRecording — the caller stops the session and
 * awaits the final transcript.
 */
export interface RecordingController {
  /** Stop the recording and resolve with the final transcript. */
  stop(): Promise<TranscriptionResult>;
  /** Cancel the recording without producing a result. */
  cancel(): void;
}
