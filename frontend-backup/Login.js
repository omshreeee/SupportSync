import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { username });
      
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('Login successful:', response.data);

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Call parent component's login handler
      if (onLogin) {
        onLogin(response.data.user, response.data.token);
      }

      // Clear form
      setUsername('');
      setPassword('');

    } catch (error) {
      console.error('Login failed:', error);
      
      if (error.response) {
        // Server responded with error status
        setError(error.response.data.error || 'Login failed');
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        setError('Cannot connect to server. Make sure backend is running on port 5000.');
        console.error('Network error:', error.request);
      } else {
        // Something else went wrong
        setError('Login failed: ' + error.message);
        console.error('Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>SupportSync Login</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="debug-info">
          <small>
            Backend should be running on: <strong>http://localhost:5000</strong>
            <br />
            Default credentials: <strong>Om / Om9</strong>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
