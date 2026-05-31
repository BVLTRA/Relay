import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GlowOrbs from '../components/GlowOrb';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('gridlock_token');
  
  // Pull the operator's data from local storage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('gridlock_user')));
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) {
      navigate('/');
      return;
    }
    fetchOperatorStats();
    // eslint-disable-next-line
  }, []);

  const fetchOperatorStats = async () => {
    try {
      // Hit the vault to get only this specific user's faults
      const response = await fetch('http://localhost:5000/api/faults', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Calculate the metrics
        const total = data.length;
        const open = data.filter(f => f.status === 'Open' || f.status === 'In Progress').length;
        const resolved = data.filter(f => f.status === 'Resolved').length;
        
        setStats({ total, open, resolved });
      }
    } catch (error) {
      console.error('Failed to pull statistics.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-layout">
      <GlowOrbs />
      <Navbar user={user} />
      
      <main className="account-content">
        <div className="profile-grid">
          
          {/* Left Column: The Operator Identity Card */}
          <section className="identity-card glass-panel">
            <div className="avatar-ring">
              <div className="avatar-initials">
                {user?.name?.[0]}{user?.surname?.[0]}
              </div>
            </div>
            
            <h2 className="operator-name">{user?.name} {user?.surname}</h2>
            <div className="role-badge">{user?.role}</div>
            
            <div className="details-list">
              <div className="detail-item">
                <span className="detail-label">Assigned Branch</span>
                <span className="detail-value">{user?.branch}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email Clearance</span>
                <span className="detail-value">{user?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Status</span>
                <span className="detail-value status-active">Active</span>
              </div>
            </div>
          </section>

          {/* Right Column: The Performance Telemetry */}
          <section className="telemetry-section">
            <h3 className="telemetry-header">Operator Telemetry</h3>
            
            {isLoading ? (
              <div className="loading-state">Syncing vault data...</div>
            ) : (
              <div className="stats-grid">
                <div className="stat-card glass-panel">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">Total Faults Logged</span>
                </div>
                
                <div className="stat-card glass-panel warning-tint">
                  <span className="stat-value">{stats.open}</span>
                  <span className="stat-label">Active / Pending</span>
                </div>
                
                <div className="stat-card glass-panel success-tint">
                  <span className="stat-value">{stats.resolved}</span>
                  <span className="stat-label">Issues Resolved</span>
                </div>
              </div>
            )}

            <div className="system-info glass-panel">
              <h4>System Information</h4>
              <p>BVLTRA Relay v1.0.4</p>
              <p>Connected to MongoDB Atlas Vault.</p>
              <p>Session encrypted via JWT Bearer Token.</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Account;