import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export { client as db };

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Users table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        subscription_status TEXT DEFAULT 'free',
        subscription_expires_at INTEGER,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Daily Q&A content
    await client.execute(`
      CREATE TABLE IF NOT EXISTS daily_qna (
        id TEXT PRIMARY KEY,
        date TEXT UNIQUE NOT NULL,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        total_questions INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Daily tests
    await client.execute(`
      CREATE TABLE IF NOT EXISTS daily_tests (
        id TEXT PRIMARY KEY,
        date TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        total_questions INTEGER DEFAULT 0,
        time_limit_minutes INTEGER DEFAULT 60,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Daily GK & Current Affairs
    await client.execute(`
      CREATE TABLE IF NOT EXISTS daily_gk (
        id TEXT PRIMARY KEY,
        date TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        sources TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Notifications
    await client.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'general',
        is_active INTEGER DEFAULT 1,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `);

    // User test attempts
    await client.execute(`
      CREATE TABLE IF NOT EXISTS user_test_attempts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        test_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        time_taken_minutes INTEGER,
        answers TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (test_id) REFERENCES daily_tests (id)
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}