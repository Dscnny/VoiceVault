/**
 * DexieStorageService — real IndexedDB persistence via Dexie.js.
 *
 * Replaces the Swift SwiftData layer. All data stays in the user's browser
 * sandbox; no server round-trips.
 */
import Dexie, { type Table } from "dexie";
import type { JournalEntry } from "@/types/JournalEntry";
import type {
  JournalSortOrder,
  StorageService,
} from "@/services/interfaces/StorageService";

/**
 * Dexie row shape — Dexie can store native Date objects, but we keep the
 * shape identical to JournalEntry for simplicity.
 */
type JournalRow = JournalEntry;

class VoiceVaultDB extends Dexie {
  entries!: Table<JournalRow, string>;

  constructor() {
    super("VoiceVaultDB");
    this.version(1).stores({
      // Primary key: id. Indexes: timestamp (for date-range queries),
      // sentimentScore (for finding outliers in provider dashboard).
      entries: "id, timestamp, sentimentScore, isFullyProcessed",
    });
  }
}

export class DexieStorageService implements StorageService {
  private db: VoiceVaultDB;

  constructor() {
    this.db = new VoiceVaultDB();
  }

  async save(entry: JournalEntry): Promise<void> {
    await this.db.entries.put(entry);
  }

  async fetchById(id: string): Promise<JournalEntry> {
    const entry = await this.db.entries.get(id);
    if (!entry) throw new Error(`Journal entry not found: ${id}`);
    return entry;
  }

  async fetchAll(sortedBy: JournalSortOrder = "newestFirst"): Promise<JournalEntry[]> {
    const all = await this.db.entries.orderBy("timestamp").toArray();
    return sortedBy === "newestFirst" ? all.reverse() : all;
  }

  async fetchEntries(startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    const rows = await this.db.entries
      .where("timestamp")
      .between(startDate, endDate, true, true)
      .toArray();
    return rows.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async searchEntries(query: string): Promise<JournalEntry[]> {
    const lowered = query.toLowerCase();
    return this.db.entries
      .filter((e) => e.rawTranscript.toLowerCase().includes(lowered))
      .toArray();
  }

  async deleteById(id: string): Promise<void> {
    const exists = await this.db.entries.get(id);
    if (!exists) throw new Error(`Journal entry not found: ${id}`);
    await this.db.entries.delete(id);
  }

  async entryCount(): Promise<number> {
    return this.db.entries.count();
  }

  /** Wipe all data — useful for demo reset. */
  async wipe(): Promise<void> {
    await this.db.entries.clear();
  }

  /** Seed with the medical-grade sample data from MockStorageService. */
  async seedSampleDataIfEmpty(samples: JournalEntry[]): Promise<void> {
    const count = await this.entryCount();
    if (count > 0) return;
    await this.db.entries.bulkAdd(samples);
  }
}
