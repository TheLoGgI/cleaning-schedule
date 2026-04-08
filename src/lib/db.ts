import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import path from "path"
import * as schema from "./schema"

const dbPath =
  process.env.DATABASE_PATH ??
  path.join(process.cwd(), "data", "cleaning.db")

type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>

const globalForDb = globalThis as unknown as { _db?: DrizzleDB }

if (!globalForDb._db) {
  const sqlite = new Database(dbPath)
  sqlite.pragma("journal_mode = WAL")
  globalForDb._db = drizzle(sqlite, { schema })
}

export const db = globalForDb._db as DrizzleDB
