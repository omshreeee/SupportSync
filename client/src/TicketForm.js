import React, { useState } from 'react';
import axios from 'axios';

const TicketForm = ({ user, token, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'technical'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    'technical', 'hardware', 'software', 'network', 'account', 'other'
  ];

  const priorities = [
    { value: 'low', label: 'Low - General inquiry' },
    { value: 'medium', label: 'Medium - Standard issue' },
    { value: 'high', label: 'High - Urgent problem' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:5000/api/tickets', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setMessage('✅ Ticket created successfully!');
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'technical'
      });
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        if (onTicketCreated) onTicketCreated();
      }, 2000);
      
    } catch (error) {
      setMessage('❌ Failed to create ticket: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="ticket-form-container">
      <div className="form-header">
        <h1>Create Support Ticket</h1>
        <p>Describe your issue and we'll help you resolve it quickly.</p>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="title">Issue Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief description of your issue"
            required
            maxLength="100"
            disabled={loading}
          />
          <small>{formData.title.length}/100 characters</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {priorities.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Detailed Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please provide detailed information about your issue, including:
• What you were trying to do
• What happened instead
• Any error messages
• Steps to reproduce the problem"
            required
            rows="8"
            maxLength="1000"
            disabled={loading}
          />
          <small>{formData.description.length}/1000 characters</small>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => onTicketCreated && onTicketCreated()}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Ticket...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
