import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TicketForm = ({ user, token }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'technical'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'technical', label: '🔧 Technical Issue', icon: '🔧' },
    { value: 'hardware', label: '💻 Hardware Problem', icon: '💻' },
    { value: 'software', label: '⚙️ Software Issue', icon: '⚙️' },
    { value: 'network', label: '🌐 Network Problem', icon: '🌐' },
    { value: 'account', label: '👤 Account Issue', icon: '👤' },
    { value: 'other', label: '❓ Other', icon: '❓' }
  ];

  const priorities = [
    { value: 'low', label: '🟢 Low - General inquiry', color: '#28a745' },
    { value: 'medium', label: '🟡 Medium - Standard issue', color: '#ffc107' },
    { value: 'high', label: '🔴 High - Urgent problem', color: '#dc3545' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Submitting ticket:', formData);
      console.log('Token:', token);
      
      const response = await axios.post('http://localhost:5000/api/tickets', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Ticket created:', response.data);
      setMessage('✅ Ticket created successfully! Redirecting...');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'technical'
      });

      // Redirect to tickets page after 2 seconds
      setTimeout(() => {
        navigate('/tickets');
      }, 2000);

    } catch (error) {
      console.error('Create ticket error:', error);
      
      if (error.response) {
        setMessage('❌ Failed to create ticket: ' + (error.response.data.error || 'Server error'));
        console.error('Server response:', error.response.data);
      } else if (error.request) {
        setMessage('❌ Cannot connect to server. Please check if backend is running.');
      } else {
        setMessage('❌ Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-container">
      <div className="ticket-form-card">
        <div className="form-header">
          <div className="header-icon">🎫</div>
          <h1>Create Support Ticket</h1>
          <p>Describe your issue and our support team will assist you promptly</p>
        </div>

        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
            <div className="alert-content">
              {message}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="professional-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              <span className="label-icon">📝</span>
              Issue Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief summary of your issue"
              required
              maxLength={100}
              disabled={loading}
              className="form-input"
            />
            <div className="input-footer">
              <small className="char-counter">{formData.title.length}/100 characters</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                <span className="label-icon">📋</span>
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                <span className="label-icon">⚡</span>
                Priority *
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-select"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              <span className="label-icon">📄</span>
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide detailed information about your issue:
• What you were trying to do
• What happened instead
• Any error messages
• Steps to reproduce the problem"
              required
              maxLength={1000}
              rows={8}
              disabled={loading}
              className="form-textarea"
            />
            <div className="input-footer">
              <small className="char-counter">{formData.description.length}/1000 characters</small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              disabled={loading}
              className="btn btn-secondary"
            >
              <span className="btn-icon">↩️</span>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              <span className="btn-icon">
                {loading ? '⏳' : '🚀'}
              </span>
              {loading ? 'Creating Ticket...' : 'Create Ticket'}
            </button>
          </div>
        </form>

        <div className="form-footer">
          <small>
            Your ticket will be assigned a unique ID and our support team will respond within 24 hours.
          </small>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
