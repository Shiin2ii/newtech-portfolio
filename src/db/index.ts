import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Lazy initialization — only connect when DB is actually used (not at build time)
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is not set");
  const client = postgres(url, { prepare: false });
  return drizzle(client, { schema });
}

type DrizzleDb = ReturnType<typeof createDb>;

let _db: DrizzleDb | null = null;

function getDb(): DrizzleDb {
  if (!_db) _db = createDb();
  return _db;
}

export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    return getDb()[prop as keyof DrizzleDb];
  },
});
