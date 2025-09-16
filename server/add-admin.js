const sqlite3 = require('sqlite3').verbose();

console.log('👑 Adding admin users to database...');

const db = new sqlite3.Database('./supportsync.db');

// Add admin users
const adminUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'support', password: 'support123', role: 'admin' },
  { username: 'manager', password: 'manager123', role: 'admin' }
];

db.serialize(() => {
  adminUsers.forEach(admin => {
    db.run(`INSERT OR REPLACE INTO users (username, password, role) VALUES (?, ?, ?)`,
      [admin.username, admin.password, admin.role], 
      function(err) {
        if (err) {
          console.error(`❌ Error adding ${admin.username}:`, err);
        } else {
          console.log(`✅ Admin user created: ${admin.username}/${admin.password}`);
        }
      }
    );
  });

  // Verify admin users
  db.all(`SELECT username, role FROM users WHERE role = 'admin'`, (err, admins) => {
    if (err) {
      console.error('Error fetching admins:', err);
    } else {
      console.log('\n📋 Current admin users:');
      admins.forEach(admin => {
        console.log(`   - ${admin.username} (${admin.role})`);
      });
    }
    
    db.close(() => {
      console.log('\n🎉 Admin users setup completed!');
      console.log('\n🔑 Admin Login Credentials:');
      adminUsers.forEach(admin => {
        console.log(`   Username: ${admin.username} | Password: ${admin.password}`);
      });
    });
  });
});
