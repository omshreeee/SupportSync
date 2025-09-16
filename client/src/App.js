import React, { useState, useEffect } from 'react';
import Login from './Login';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUserType = localStorage.getItem('userType');
    const savedUserId = localStorage.getItem('userId');
    
    if (token && savedUserType && savedUserId) {
      setIsLoggedIn(true);
      setUserType(savedUserType);
      setUserId(savedUserId);
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (type, id) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUserId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserType('');
    setUserId('');
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#667eea'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  // Show login if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Show appropriate dashboard based on user type
  return (
    <div className="App">
      {userType === 'admin' ? (
        <AdminDashboard userId={userId} onLogout={handleLogout} />
      ) : (
        <UserDashboard userId={userId} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
