/**
 * StorageService interface — ported from Swift
 * `Protocols/StorageServiceProtocol.swift`.
 *
 * Defines the contract for persisting and querying JournalEntry records.
 * Real implementation uses IndexedDB via Dexie. Mock implementation uses
 * an in-memory array.
 */
import type { JournalEntry } from "@/types/JournalEntry";

export type JournalSortOrder = "newestFirst" | "oldestFirst";

export interface StorageService {
  /** Save or update an entry (upsert by id). */
  save(entry: JournalEntry): Promise<void>;

  /** Fetch a single entry by id. Throws if not found. */
  fetchById(id: string): Promise<JournalEntry>;

  /** Fetch all entries in the given sort order. */
  fetchAll(sortedBy?: JournalSortOrder): Promise<JournalEntry[]>;

  /** Fetch entries within a date range (inclusive). */
  fetchEntries(startDate: Date, endDate: Date): Promise<JournalEntry[]>;

  /** Case-insensitive substring search on transcripts. */
  searchEntries(query: string): Promise<JournalEntry[]>;

  /** Delete an entry by id. */
  deleteById(id: string): Promise<void>;

  /** Total entry count. */
  entryCount(): Promise<number>;
}
