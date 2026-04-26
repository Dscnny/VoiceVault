/**
 * ServiceContainer — dependency injection via React Context.
 *
 * Equivalent to Swift `Core/AppEnvironment.swift`. Provides a single source
 * of truth for service wiring across the app.
 *
 * Three modes:
 *  - production(): real services backed by Web APIs + transformers.js + Dexie.
 *  - preview():    all-mock services for UI development without microphone
 *                  access or model downloads. Equivalent to the Swift
 *                  `AppEnvironment.preview()`.
 *  - hybrid():     real storage + intake (so the dashboard reads real entries),
 *                  but mocked transcription/intelligence/empathy.
 *                  Useful for testing the dashboard with real data while
 *                  the ML pipeline is still flaky.
 */
"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { AudioTranscriptionService } from "@/services/interfaces/AudioTranscriptionService";
import type { IntelligenceService } from "@/services/interfaces/IntelligenceService";
import type { StorageService } from "@/services/interfaces/StorageService";
import type { EmpathyService } from "@/services/interfaces/EmpathyService";
import type { IntakeService } from "@/services/interfaces/IntakeService";

import { MockAudioTranscriptionService } from "@/services/mock/MockAudioTranscriptionService";
import { MockIntelligenceService } from "@/services/mock/MockIntelligenceService";
import { MockStorageService } from "@/services/mock/MockStorageService";
import { MockEmpathyService } from "@/services/mock/MockEmpathyService";
import { MockIntakeService } from "@/services/mock/MockIntakeService";

import { WebSpeechTranscriptionService } from "@/services/real/WebSpeechTranscriptionService";
import { TransformersIntelligenceService } from "@/services/real/TransformersIntelligenceService";
import { DexieStorageService } from "@/services/real/DexieStorageService";
import { RuleBasedEmpathyService } from "@/services/real/RuleBasedEmpathyService";
import { RealIntakeService } from "@/services/real/RealIntakeService";
import { ClaudeIntelligenceService } from "@/services/real/ClaudeIntelligenceService";
import { ClaudeEmpathyService } from "@/services/real/ClaudeEmpathyService";
import { ClaudeIntakeService } from "@/services/real/ClaudeIntakeService";

export interface ServiceContainer {
  transcription: AudioTranscriptionService;
  intelligence: IntelligenceService;
  storage: StorageService;
  empathy: EmpathyService;
  intake: IntakeService;
}

export type ServiceMode = "production" | "preview" | "hybrid";

export function buildServices(mode: ServiceMode): ServiceContainer {
  if (mode === "preview") {
    const storage = MockStorageService.withSampleData();
    return {
      transcription: new MockAudioTranscriptionService(),
      intelligence: new MockIntelligenceService(),
      storage,
      empathy: new MockEmpathyService(),
      intake: new MockIntakeService(),
    };
  }

  if (mode === "hybrid") {
    const storage = new DexieStorageService();
    return {
      transcription: new MockAudioTranscriptionService(),
      intelligence: new MockIntelligenceService(),
      storage,
      empathy: new RuleBasedEmpathyService(),
      intake: new RealIntakeService(storage),
    };
  }

  // production
  const storage = new DexieStorageService();
  return {
    transcription: new WebSpeechTranscriptionService(),
    // Swapped to ClaudeIntelligenceService to accurately track sentiment and keywords
    intelligence: new ClaudeIntelligenceService(),
    storage,
    empathy: new ClaudeEmpathyService(),
    intake: new ClaudeIntakeService(storage),
  };
}

const ServiceContainerContext = createContext<ServiceContainer | null>(null);

export interface ServiceProviderProps {
  mode?: ServiceMode;
  /** Inject a custom container (useful for tests). */
  override?: ServiceContainer;
  children: React.ReactNode;
}

export function ServiceProvider({
  mode = "production",
  override,
  children,
}: ServiceProviderProps) {
  const services = useMemo(
    () => override ?? buildServices(mode),
    [mode, override]
  );
  return (
    <ServiceContainerContext.Provider value={services}>
      {children}
    </ServiceContainerContext.Provider>
  );
}

export function useServices(): ServiceContainer {
  const ctx = useContext(ServiceContainerContext);
  if (!ctx) {
    throw new Error("useServices must be used inside <ServiceProvider>");
  }
  return ctx;
}
