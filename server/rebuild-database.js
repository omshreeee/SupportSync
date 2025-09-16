const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

console.log('🔧 Starting complete database rebuild...');

// Backup existing database if it exists
if (fs.existsSync('./supportsync.db')) {
  const backupName = `./supportsync_backup_${Date.now()}.db`;
  fs.copyFileSync('./supportsync.db', backupName);
  console.log(`📋 Backup created: ${backupName}`);
  
  // Remove old database
  fs.unlinkSync('./supportsync.db');
  console.log('🗑️ Old database removed');
}

// Create new database with complete schema
const db = new sqlite3.Database('./supportsync.db');

console.log('🏗️ Creating new database with complete schema...');

// Create users table
db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating users table:', err);
    } else {
      console.log('✅ Users table created successfully');
    }
  });

  // Create tickets table with ALL required columns
  db.run(`CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'technical',
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating tickets table:', err);
    } else {
      console.log('✅ Tickets table created with ALL columns');
    }
  });

  // Insert test user
  db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
    ['Om', 'Om9', 'user'], (err) => {
      if (err) {
        console.error('❌ Error inserting user:', err);
      } else {
        console.log('✅ Test user Om/Om9 created');
      }
  });

  // Insert sample ticket to verify schema
  db.run(`INSERT INTO tickets 
    (title, description, category, priority, status, user_id, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [
      'Welcome to SupportSync!', 
      'This is your first ticket. The database has been successfully configured with all required columns.',
      'technical',
      'low',
      'open',
      1
    ], (err) => {
      if (err) {
        console.error('❌ Error inserting sample ticket:', err);
      } else {
        console.log('✅ Sample ticket created');
      }
  });

  // Verify the schema
  db.all("PRAGMA table_info(tickets)", (err, columns) => {
    if (err) {
      console.error('❌ Error checking schema:', err);
    } else {
      console.log('📋 Tickets table columns:');
      columns.forEach(col => {
        console.log(`   - ${col.name} (${col.type})`);
      });
    }
    
    // Close database
    db.close(() => {
      console.log('🎉 Database rebuild completed successfully!');
      console.log('📝 You can now restart your backend server with: node server.js');
    });
  });
});
