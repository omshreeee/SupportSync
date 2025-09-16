import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import './Dashboard.css';

const AdminDashboard = ({ userId, onLogout }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/tickets/all', {
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

  const handleUpdateTicket = async (ticketId, status, message) => {
    try {
      const response = await fetch(`http://localhost:4000/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status,
          admin_message: message
        }),
      });

      if (response.ok) {
        fetchAllTickets();
        setSelectedTicket(null);
        setUpdateMessage('');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const solvedTickets = tickets.filter(ticket => ticket.status === 'Solved');
  const unsolvedTickets = tickets.filter(ticket => ticket.status !== 'Solved');

  if (showProfile) {
    return <Profile userId={userId} userType="admin" onBack={() => setShowProfile(false)} />;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-circle">
              <span className="logo-text">SS</span>
            </div>
            <h1>SupportSync - Admin Panel</h1>
          </div>
          <div className="header-actions">
            <button onClick={() => setShowProfile(true)} className="profile-btn">Profile</button>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="tickets-container">
            <section className="tickets-section">
              <h2>Pending Issues ({unsolvedTickets.length})</h2>
              <div className="tickets-grid">
                {unsolvedTickets.map(ticket => (
                  <div key={ticket.id} className="ticket-card unsolved admin-card">
                    <div className="ticket-header">
                      <h3>{ticket.title}</h3>
                      <span className={`priority ${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="ticket-description">{ticket.description}</p>
                    <div className="user-info">
                      <strong>User:</strong> {ticket.username}
                    </div>
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
                        <strong>Previous Response:</strong> {ticket.admin_message}
                      </div>
                    )}
                    <div className="admin-actions">
                      <button 
                        onClick={() => setSelectedTicket(ticket)}
                        className="update-btn"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="tickets-section">
              <h2>Solved Issues ({solvedTickets.length})</h2>
              <div className="tickets-grid">
                {solvedTickets.map(ticket => (
                  <div key={ticket.id} className="ticket-card solved admin-card">
                    <div className="ticket-header">
                      <h3>{ticket.title}</h3>
                      <span className={`priority ${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="ticket-description">{ticket.description}</p>
                    <div className="user-info">
                      <strong>User:</strong> {ticket.username}
                    </div>
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
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Ticket: {selectedTicket.title}</h3>
            <textarea
              value={updateMessage}
              onChange={(e) => setUpdateMessage(e.target.value)}
              placeholder="Add a message for the user..."
              rows="4"
            />
            <div className="modal-actions">
              <button 
                onClick={() => handleUpdateTicket(selectedTicket.id, 'In Progress', updateMessage)}
                className="progress-btn"
              >
                Mark In Progress
              </button>
              <button 
                onClick={() => handleUpdateTicket(selectedTicket.id, 'Solved', updateMessage)}
                className="solve-btn"
              >
                Mark as Solved
              </button>
              <button 
                onClick={() => {
                  setSelectedTicket(null);
                  setUpdateMessage('');
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
