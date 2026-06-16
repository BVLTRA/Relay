import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('gridlock_token');
    localStorage.removeItem('gridlock_user');
    navigate('/');
  };

  return (
    <nav className="relay-navbar">
      <div className="nav-brand">
        <div className="status-dot"></div>
        <h2>BVLTRA <span className="brand-accent">Relay</span></h2>
      </div>
      
      <div className="nav-links">
        <button 
          className={`nav-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard', { state: { user } })}
        >
          Log Issue
        </button>
        <button 
          className={`nav-btn ${location.pathname === '/account' ? 'active' : ''}`}
          onClick={() => navigate('/account', { state: { user } })}
        >
          Operator Profile
        </button>
        <div className="nav-divider"></div>
        <div className="user-badge">
          {user?.name ? `${user.name[0]}${user.surname ? user.surname[0] : ''}` : 'OP'}
        </div>
        <button className="logout-btn" onClick={handleLogout}>Disconnect</button>
      </div>
    </nav>
  );
};

export default Navbar;