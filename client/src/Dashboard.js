import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Dashboard = ({ user, token }) => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    closedTickets: 0,
    pendingTickets: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fixed with useCallback to avoid warning
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const tickets = response.data;
      
      setStats({
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => t.status === 'open').length,
        closedTickets: tickets.filter(t => t.status === 'closed').length,
        pendingTickets: tickets.filter(t => t.status === 'pending').length
      });

      setRecentTickets(tickets.slice(0, 5));
    } catch (error) {
      console.error('Dashboard error:', error);
      // Set empty data on error
      setStats({
        totalTickets: 0,
        openTickets: 0,
        closedTickets: 0,
        pendingTickets: 0
      });
      setRecentTickets([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44aa44';
      default: return '#666';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return '#007bff';
      case 'pending': return '#ffaa00';
      case 'closed': return '#28a745';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h3>Loading dashboard...</h3>
        <p>Please wait while we fetch your data</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to SupportSync Portal</h1>
        <p>Hello <strong>{user?.username}</strong>! Here's your support overview.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Tickets</h3>
          <div className="stat-number">{stats.totalTickets}</div>
          <div className="stat-icon">🎫</div>
        </div>
        
        <div className="stat-card open">
          <h3>Open Tickets</h3>
          <div className="stat-number">{stats.openTickets}</div>
          <div className="stat-icon">🔓</div>
        </div>
        
        <div className="stat-card pending">
          <h3>Pending</h3>
          <div className="stat-number">{stats.pendingTickets}</div>
          <div className="stat-icon">⏳</div>
        </div>
        
        <div className="stat-card closed">
          <h3>Resolved</h3>
          <div className="stat-number">{stats.closedTickets}</div>
          <div className="stat-icon">✅</div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="recent-tickets">
        <h2>Recent Tickets</h2>
        {recentTickets.length > 0 ? (
          <div className="tickets-table">
            <div className="table-header">
              <div>ID</div>
              <div>Title</div>
              <div>Priority</div>
              <div>Status</div>
              <div>Created</div>
            </div>
            {recentTickets.map(ticket => (
              <div key={ticket.id} className="table-row">
                <div>#{ticket.id}</div>
                <div>{ticket.title}</div>
                <div>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(ticket.status) }}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div>{new Date(ticket.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tickets">
            <div className="empty-state">
              <h3>No tickets found</h3>
              <p>Create your first support ticket to get started!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
