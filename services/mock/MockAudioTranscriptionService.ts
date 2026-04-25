/**
 * MockAudioTranscriptionService — for development without microphone access
 * and the 6 AM Failsafe.
 *
 * Returns a canned realistic transcript after a brief simulated delay.
 */
import type {
  AudioRecordingIntent,
  AudioTranscriptionService,
  PartialTranscriptCallback,
  RecordingController,
  TranscriptionResult,
} from "@/services/interfaces/AudioTranscriptionService";

const SAMPLE_TRANSCRIPT =
  "Today was actually pretty good. I managed to finish the report I'd been putting off all week and went for a long walk in the afternoon. I'm still a bit anxious about the meeting tomorrow but I'm trying not to dwell on it. Sleep has been better since I cut back on coffee in the evenings.";

export class MockAudioTranscriptionService implements AudioTranscriptionService {
  isAvailable(): boolean {
    return true;
  }

  async startRecording(
    _intent: AudioRecordingIntent,
    onPartial?: PartialTranscriptCallback
  ): Promise<RecordingController> {
    let cancelled = false;

    // Simulate streaming partials
    if (onPartial) {
      const words = SAMPLE_TRANSCRIPT.split(" ");
      let assembled = "";
      let i = 0;
      const interval = setInterval(() => {
        if (cancelled || i >= words.length) {
          clearInterval(interval);
          return;
        }
        assembled += (assembled ? " " : "") + words[i];
        onPartial(assembled);
        i++;
      }, 120);
    }

    return {
      stop: async (): Promise<TranscriptionResult> => {
        return {
          transcript: SAMPLE_TRANSCRIPT,
          durationSeconds: 18.2,
        };
      },
      cancel: () => {
        cancelled = true;
      },
    };
  }
}
