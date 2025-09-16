const Database = require('better-sqlite3');
const path = require('path');

let db;

const initDatabase = async () => {
  const dbPath = path.join(__dirname, 'supportSync.db');
  db = new Database(dbPath);

  // Just connect to existing database - users are already created
  console.log('Database connected successfully');
  
  // Verify users exist
  const users = db.prepare('SELECT username, user_type FROM users').all();
  console.log('Existing users:', users);
};

const getDatabase = () => {
  return db;
};

module.exports = {
  initDatabase,
  getDatabase
};
