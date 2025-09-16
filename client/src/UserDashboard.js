import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import './Dashboard.css';

const UserDashboard = ({ userId, onLogout }) => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'Medium'
  });
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [userId]); // Add userId as dependency
  

  const fetchTickets = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/tickets/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newTicket,
          userId
        }),
      });

      if (response.ok) {
        setNewTicket({ title: '', description: '', priority: 'Medium' });
        fetchTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
    setLoading(false);
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/tickets/${ticketId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchTickets();
        }
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    }
  };

  const solvedTickets = tickets.filter(ticket => ticket.status === 'Solved');
  const unsolvedTickets = tickets.filter(ticket => ticket.status !== 'Solved');

  if (showProfile) {
    return <Profile userId={userId} userType="user" onBack={() => setShowProfile(false)} />;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-circle">
              <span className="logo-text">SS</span>
            </div>
            <h1>SupportSync</h1>
          </div>
          <div className="header-actions">
            <button onClick={() => setShowProfile(true)} className="profile-btn">Profile</button>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <section className="ticket-form-section">
            <h2>Create New Ticket</h2>
            <form onSubmit={handleSubmitTicket} className="ticket-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  required
                  rows="4"
                ></textarea>
              </div>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Creating...' : 'Create Ticket'}
              </button>
            </form>
          </section>

          <div className="tickets-container">
            <section className="tickets-section">
              <h2>Unsolved Issues ({unsolvedTickets.length})</h2>
              <div className="tickets-grid">
                {unsolvedTickets.map(ticket => (
                  <div key={ticket.id} className="ticket-card unsolved">
                    <div className="ticket-header">
                      <h3>{ticket.title}</h3>
                      <span className={`priority ${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="ticket-description">{ticket.description}</p>
                    <div className="ticket-meta">
                      <span className={`status ${ticket.status.toLowerCase()}`}>
                        {ticket.status}
                      </span>
                      <span className="date">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {ticket.admin_message && (
                      <div className="admin-message">
                        <strong>Admin Response:</strong> {ticket.admin_message}
                      </div>
                    )}
                    <button 
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="tickets-section">
              <h2>Solved Issues ({solvedTickets.length})</h2>
              <div className="tickets-grid">
                {solvedTickets.map(ticket => (
                  <div key={ticket.id} className="ticket-card solved">
                    <div className="ticket-header">
                      <h3>{ticket.title}</h3>
                      <span className={`priority ${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="ticket-description">{ticket.description}</p>
                    <div className="ticket-meta">
                      <span className="status solved">Solved</span>
                      <span className="date">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {ticket.admin_message && (
                      <div className="admin-message">
                        <strong>Admin Response:</strong> {ticket.admin_message}
                      </div>
                    )}
                    <button 
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
