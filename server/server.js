const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { initDatabase, getDatabase } = require('./Database');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = 'your-secret-key';

app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes - SIMPLE VERSION THAT WORKS
app.post('/api/auth/login', async (req, res) => {
  const { username, password, userType } = req.body;
  const db = getDatabase();

  console.log('Login attempt:', { username, userType, password });

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND user_type = ?').get(username, userType);
    
    if (!user) {
      console.log('User not found:', username, userType);
      return res.status(401).json({ message: 'Invalid credentials - user not found' });
    }

    console.log('User found:', user.username, 'Checking password...');
    
    // DIRECT PASSWORD COMPARISON (no encryption for testing)
    const isValidPassword = (password === user.password);
    
    if (!isValidPassword) {
      console.log('Password mismatch. Expected:', user.password, 'Got:', password);
      return res.status(401).json({ message: 'Invalid credentials - wrong password' });
    }

    console.log('✅ Login successful for:', username);
    
    const token = jwt.sign(
      { userId: user.id, username: user.username, userType: user.user_type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      userId: user.id,
      userType: user.user_type,
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// User profile routes
app.get('/api/users/profile/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  const user = db.prepare('SELECT id, username, email, phone, department FROM users WHERE id = ?').get(req.params.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json(user);
});

app.put('/api/users/profile/:id', authenticateToken, (req, res) => {
  const { email, phone, department } = req.body;
  const db = getDatabase();
  
  try {
    db.prepare('UPDATE users SET email = ?, phone = ?, department = ? WHERE id = ?')
      .run(email, phone, department, req.params.id);
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ticket routes
app.post('/api/tickets', authenticateToken, (req, res) => {
  const { title, description, priority, userId } = req.body;
  const db = getDatabase();

  try {
    const result = db.prepare(`
      INSERT INTO tickets (title, description, priority, user_id, status, created_at)
      VALUES (?, ?, ?, ?, 'Open', datetime('now'))
    `).run(title, description, priority, userId);

    res.json({ 
      message: 'Ticket created successfully', 
      ticketId: result.lastInsertRowid 
    });
  } catch (error) {
    console.error('Ticket creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/tickets/user/:userId', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  try {
    const tickets = db.prepare(`
      SELECT t.*, u.username 
      FROM tickets t 
      JOIN users u ON t.user_id = u.id 
      WHERE t.user_id = ? 
      ORDER BY t.created_at DESC
    `).all(req.params.userId);
    
    res.json(tickets);
  } catch (error) {
    console.error('Fetch user tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/tickets/all', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  try {
    const tickets = db.prepare(`
      SELECT t.*, u.username 
      FROM tickets t 
      JOIN users u ON t.user_id = u.id 
      ORDER BY t.created_at DESC
    `).all();
    
    res.json(tickets);
  } catch (error) {
    console.error('Fetch all tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/tickets/:id', authenticateToken, (req, res) => {
  const { status, admin_message } = req.body;
  const db = getDatabase();
  
  try {
    db.prepare('UPDATE tickets SET status = ?, admin_message = ? WHERE id = ?')
      .run(status, admin_message, req.params.id);
    
    res.json({ message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Ticket update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/tickets/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  try {
    db.prepare('DELETE FROM tickets WHERE id = ?').run(req.params.id);
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Ticket deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
