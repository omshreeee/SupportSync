require('dotenv').config();                // Load .env first

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Use DATABASE_FILE from .env or default to supportsync.db
const dbFile = process.env.DATABASE_FILE || 'supportsync.db';
const dbPath = path.resolve(__dirname, dbFile);

const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Failed to open database at', dbPath, err);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT CHECK(role IN ('admin','user'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      type TEXT,
      priority TEXT,
      status TEXT,
      createdBy INTEGER,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
