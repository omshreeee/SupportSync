const sqlite3 = require('sqlite3').verbose();

console.log('🔧 Setting up admin user...');

// Connect to database
const db = new sqlite3.Database('./supportsync.db');

// Insert admin user
db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
  ['admin', 'admin123', 'admin'], (err) => {
    if (err) {
      console.error('❌ Error creating admin user:', err);
    } else {
      console.log('✅ Admin user created successfully');
      console.log('🔑 Admin login credentials:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    }
});

// Insert sample tickets for admin to manage
const sampleTickets = [
  {
    title: 'Server maintenance required',
    description: 'The main server needs routine maintenance and updates.',
    category: 'technical',
    priority: 'high',
    status: 'open',
    user_id: 1
  },
  {
    title: 'Email server configuration',
    description: 'Need to configure the new email server for the company.',
    category: 'network',
    priority: 'medium',
    status: 'pending',
    user_id: 1
  }
];

sampleTickets.forEach((ticket, index) => {
  db.run(`INSERT OR IGNORE INTO tickets 
    (title, description, category, priority, status, user_id, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [ticket.title, ticket.description, ticket.category, ticket.priority, ticket.status, ticket.user_id],
    (err) => {
      if (err) {
        console.error(`❌ Error creating sample ticket ${index + 1}:`, err);
      } else {
        console.log(`✅ Sample ticket ${index + 1} created`);
      }
  });
});

db.close(() => {
  console.log('🎉 Admin setup completed!');
  console.log('📝 You can now login as admin with admin/admin123');
});
