// api/_db.js — shared Turso client for all Vercel API routes
import { createClient } from '@libsql/client';

let client;

export function getDb() {
    if (!client) {
        client = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });
    }
    return client;
}

export async function initDb() {
    const db = getDb();
    await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      mobile TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      plan_start INTEGER NOT NULL,
      plan_months INTEGER NOT NULL DEFAULT 1,
      notes TEXT DEFAULT '',
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `);
    return db;
}
