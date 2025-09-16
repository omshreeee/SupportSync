const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('./supportsync.db');

console.log('🔧 Checking and fixing database schema...');

// Check current schema
db.get("PRAGMA table_info(tickets)", (err, result) => {
  if (err) {
    console.error('Error checking schema:', err);
    return;
  }
  
  // Get all columns
  db.all("PRAGMA table_info(tickets)", (err, columns) => {
    if (err) {
      console.error('Error getting columns:', err);
      return;
    }
    
    const columnNames = columns.map(col => col.name);
    console.log('Current columns:', columnNames);
    
    // Add missing columns one by one
    const requiredColumns = [
      { name: 'category', type: 'TEXT', defaultValue: 'technical' },
      { name: 'priority', type: 'TEXT', defaultValue: 'medium' },
      { name: 'status', type: 'TEXT', defaultValue: 'open' },
      { name: 'user_id', type: 'INTEGER', defaultValue: '1' },
      { name: 'created_at', type: 'TEXT', defaultValue: "datetime('now')" },
      { name: 'updated_at', type: 'TEXT', defaultValue: "datetime('now')" }
    ];
    
    let columnsAdded = 0;
    
    requiredColumns.forEach(col => {
      if (!columnNames.includes(col.name)) {
        const sql = `ALTER TABLE tickets ADD COLUMN ${col.name} ${col.type} DEFAULT '${col.defaultValue}'`;
        
        db.run(sql, (err) => {
          if (err) {
            console.log(`⚠️  Column ${col.name} might already exist:`, err.message);
          } else {
            console.log(`✅ Added column: ${col.name}`);
            columnsAdded++;
          }
          
          // Check if we've processed all columns
          if (columnsAdded > 0) {
            console.log('🎉 Database schema updated successfully!');
            console.log('📝 Please restart your server now.');
          }
        });
      }
    });
    
    if (columnsAdded === 0) {
      console.log('✅ All required columns already exist!');
    }
    
    db.close();
  });
});
