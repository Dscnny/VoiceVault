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
import type { PatientDossier } from "@/types/Intake";

/**
 * Dexie row shape — Dexie can store native Date objects, but we keep the
 * shape identical to JournalEntry for simplicity.
 */
type JournalRow = JournalEntry;

class VoiceVaultDB extends Dexie {
  entries!: Table<JournalRow, string>;
  dossiers!: Table<PatientDossier, string>;

  constructor() {
    super("VoiceVaultDB");
    // Version 1: Initial schema
    this.version(1).stores({
      entries: "id, timestamp, sentimentScore, isFullyProcessed",
    });
    // Version 2: Added userId indexing and dossiers table
    this.version(2).stores({
      entries: "id, timestamp, sentimentScore, isFullyProcessed, userId",
      dossiers: "userId",
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

  async fetchAll(userId?: string, sortedBy: JournalSortOrder = "newestFirst"): Promise<JournalEntry[]> {
    let all: JournalEntry[];
    if (userId) {
      all = await this.db.entries.where("userId").equals(userId).toArray();
      all.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } else {
      all = await this.db.entries.orderBy("timestamp").toArray();
    }
    return sortedBy === "newestFirst" ? all.reverse() : all;
  }

  async fetchEntries(startDate: Date, endDate: Date, userId?: string): Promise<JournalEntry[]> {
    let rows = await this.db.entries
      .where("timestamp")
      .between(startDate, endDate, true, true)
      .toArray();
      
    if (userId) {
      rows = rows.filter(r => r.userId === userId);
    }
    return rows.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async searchEntries(query: string, userId?: string): Promise<JournalEntry[]> {
    const lowered = query.toLowerCase();
    return this.db.entries
      .filter((e) => {
        if (userId && e.userId !== userId) return false;
        return e.rawTranscript.toLowerCase().includes(lowered);
      })
      .toArray();
  }

  async deleteById(id: string): Promise<void> {
    const exists = await this.db.entries.get(id);
    if (!exists) throw new Error(`Journal entry not found: ${id}`);
    await this.db.entries.delete(id);
  }

  async entryCount(userId?: string): Promise<number> {
    if (userId) {
      return this.db.entries.where("userId").equals(userId).count();
    }
    return this.db.entries.count();
  }

  async fetchDossier(userId: string): Promise<PatientDossier | null> {
    const dossier = await this.db.dossiers.get(userId);
    return dossier ?? null;
  }

  async saveDossier(dossier: PatientDossier): Promise<void> {
    await this.db.dossiers.put(dossier);
  }

  async assignAnonymousEntries(userId: string): Promise<void> {
    const all = await this.db.entries.toArray();
    const anonymous = all.filter(e => !e.userId);
    
    if (anonymous.length > 0) {
      const updated = anonymous.map(e => ({ ...e, userId }));
      await this.db.entries.bulkPut(updated);
    }
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
