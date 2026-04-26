/**
 * StorageService interface — ported from Swift
 * `Protocols/StorageServiceProtocol.swift`.
 *
 * Defines the contract for persisting and querying JournalEntry records.
 * Real implementation uses IndexedDB via Dexie. Mock implementation uses
 * an in-memory array.
 */
import type { JournalEntry } from "@/types/JournalEntry";
import type { PatientDossier } from "@/types/Intake";

export type JournalSortOrder = "newestFirst" | "oldestFirst";

export interface StorageService {
  /** Save or update an entry (upsert by id). */
  save(entry: JournalEntry): Promise<void>;

  /** Fetch a single entry by id. Throws if not found. */
  fetchById(id: string): Promise<JournalEntry>;

  /** Fetch all entries for a specific user in the given sort order. Pass undefined to fetch all. */
  fetchAll(userId?: string, sortedBy?: JournalSortOrder): Promise<JournalEntry[]>;

  /** Fetch entries for a specific user within a date range (inclusive). Pass undefined userId for all. */
  fetchEntries(startDate: Date, endDate: Date, userId?: string): Promise<JournalEntry[]>;

  /** Case-insensitive substring search on transcripts for a user. */
  searchEntries(query: string, userId?: string): Promise<JournalEntry[]>;

  /** Delete an entry by id. */
  deleteById(id: string): Promise<void>;

  /** Total entry count for a user. */
  entryCount(userId?: string): Promise<number>;

  /** Fetch the dossier for a specific user. Returns null if not found. */
  fetchDossier(userId: string): Promise<PatientDossier | null>;

  /** Save or update a patient dossier. */
  saveDossier(dossier: PatientDossier): Promise<void>;

  /** Retroactively assign any anonymous journal entries (no userId) to the specified userId. */
  assignAnonymousEntries(userId: string): Promise<void>;
}
