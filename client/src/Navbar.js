import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>🎫 SupportSync Portal</h2>
      </div>
      
      <div className="nav-menu">
        <Link 
          to="/dashboard"
          className={isActive('/dashboard') ? 'nav-btn active' : 'nav-btn'}
        >
          📊 Dashboard
        </Link>
        <Link 
          to="/tickets"
          className={isActive('/tickets') ? 'nav-btn active' : 'nav-btn'}
        >
          🎫 My Tickets
        </Link>
        <Link 
          to="/create-ticket"
          className={isActive('/create-ticket') ? 'nav-btn active' : 'nav-btn'}
        >
          ➕ New Ticket
        </Link>
        <Link 
          to="/profile"
          className={isActive('/profile') ? 'nav-btn active' : 'nav-btn'}
        >
          👤 Profile
        </Link>
        {user?.role === 'admin' && (
          <Link 
            to="/admin"
            className={isActive('/admin') ? 'nav-btn active' : 'nav-btn'}
            style={{ background: 'rgba(220, 53, 69, 0.2)', borderColor: 'rgba(220, 53, 69, 0.3)' }}
          >
            ⚙️ Admin Panel
          </Link>
        )}
        <button className="nav-btn logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
      <div className="nav-user">
        Welcome, <strong>{user?.username}</strong>
        {user?.role === 'admin' && <span style={{ marginLeft: '10px', color: '#ffdd44' }}>👑</span>}
      </div>
    </nav>
  );
};

export default Navbar;
