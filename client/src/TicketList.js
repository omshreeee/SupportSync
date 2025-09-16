import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TicketList = ({ user, token }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fixed with useCallback to avoid warning
  const fetchTickets = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTickets(response.data || []);
    } catch (error) {
      console.error('Tickets fetch error:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return '#007bff';
      case 'pending': return '#ffc107';
      case 'closed': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h3>Loading tickets...</h3>
        <p>Please wait while we fetch your tickets</p>
      </div>
    );
  }

  return (
    <div className="ticket-list-container">
      <div className="list-header">
        <h1>My Support Tickets</h1>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All ({tickets.length})
          </button>
          <button 
            className={filter === 'open' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('open')}
          >
            Open ({tickets.filter(t => t.status === 'open').length})
          </button>
          <button 
            className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('pending')}
          >
            Pending ({tickets.filter(t => t.status === 'pending').length})
          </button>
          <button 
            className={filter === 'closed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('closed')}
          >
            Closed ({tickets.filter(t => t.status === 'closed').length})
          </button>
        </div>
      </div>

      {filteredTickets.length > 0 ? (
        <div className="tickets-grid">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <h3>#{ticket.id} - {ticket.title}</h3>
                <div className="ticket-badges">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                  >
                    {ticket.priority}
                  </span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(ticket.status) }}
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>
              
              <div className="ticket-body">
                <p><strong>Category:</strong> {ticket.category}</p>
                <p><strong>Description:</strong></p>
                <div className="description">{ticket.description}</div>
              </div>
              
              <div className="ticket-footer">
                <small>
                  Created: {new Date(ticket.created_at).toLocaleString()}
                </small>
                <button 
                  className="btn-view"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-tickets">
          <div className="empty-state">
            <h3>No {filter !== 'all' ? filter : ''} tickets found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't created any support tickets yet." 
                : `You don't have any ${filter} tickets.`
              }
            </p>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ticket #{selectedTicket.id}</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedTicket(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <h3>{selectedTicket.title}</h3>
              <div className="ticket-meta">
                <span><strong>Status:</strong> {selectedTicket.status}</span>
                <span><strong>Priority:</strong> {selectedTicket.priority}</span>
                <span><strong>Category:</strong> {selectedTicket.category}</span>
              </div>
              <div className="description">
                <strong>Description:</strong>
                <p>{selectedTicket.description}</p>
              </div>
              <div className="timestamps">
                <small>Created: {new Date(selectedTicket.created_at).toLocaleString()}</small>
                <small>Updated: {new Date(selectedTicket.updated_at).toLocaleString()}</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
