import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import GlowOrbs from './GlowOrb';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || JSON.parse(localStorage.getItem('gridlock_user'));
  const token = localStorage.getItem('gridlock_token');

  // Autofill today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const [faults, setFaults] = useState([]);
  const [equipment, setEquipment] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  
  // New Physical Tag State
  const [shift, setShift] = useState('');
  const [area, setArea] = useState('');
  const [dateRaised, setDateRaised] = useState(today);
  const [tagType, setTagType] = useState('Mechanical'); 
  const [actionToBeTaken, setActionToBeTaken] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token || !user) navigate('/');
    else fetchFaults();
    // eslint-disable-next-line
  }, []);

  const fetchFaults = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/faults', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFaults(data);
      }
    } catch (error) {
      console.error('Failed to fetch faults');
    }
  };

  const handleSubmitIssue = async (e) => {
    e.preventDefault();
    if (!equipment || !description || !shift || !area) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/faults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          equipment, description, priority, 
          shift, area, dateRaised, tagType, actionToBeTaken 
        })
      });

      if (response.ok) {
        const newFault = await response.json();
        setFaults([newFault, ...faults]); 
        
        // Reset form, but keep the date set to today
        setEquipment('');
        setDescription('');
        setShift('');
        setArea('');
        setActionToBeTaken('');
        setPriority('Medium');
        setTagType('Mechanical');
      }
    } catch (error) {
      console.error('Failed to log issue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <GlowOrbs />
      <Navbar user={user} />
      
      <main className="dashboard-content" style={{ position: 'relative', zIndex: 10 }}>
        
        <section className="form-section">
          <div className="section-header">
            <h3>Log a New Issue</h3>
            <span className="branch-tag">{user?.branch || 'Unknown Branch'}</span>
          </div>
          
          <form className="issue-form" onSubmit={handleSubmitIssue}>
            
            {/* ROW 1: Area and Shift */}
            <div className="form-row">
              <div className="input-group">
                <label>Area / Plant Section</label>
                <input 
                  type="text" placeholder="e.g. Packaging, Brew House" 
                  value={area} onChange={(e) => setArea(e.target.value)} required 
                />
              </div>
              <div className="input-group">
                <label>Shift</label>
                <input 
                  type="text" placeholder="e.g. Morning, Night, Shift A" 
                  value={shift} onChange={(e) => setShift(e.target.value)} required 
                />
              </div>
            </div>

            {/* ROW 2: Equipment and Date */}
            <div className="form-row">
              <div className="input-group">
                <label>Equipment / Machine Name</label>
                <input 
                  type="text" placeholder="e.g. Filler Line 3, Conveyor B" 
                  value={equipment} onChange={(e) => setEquipment(e.target.value)} required
                />
              </div>
              <div className="input-group">
                <label>Date Raised</label>
                <input 
                  type="date" value={dateRaised} 
                  onChange={(e) => setDateRaised(e.target.value)} required
                />
              </div>
            </div>

            {/* ROW 3: Tag Type and Priority */}
            <div className="form-row">
              <div className="input-group">
                <label>Tag Type</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" value="Mechanical" checked={tagType === 'Mechanical'} onChange={(e) => setTagType(e.target.value)} /> Mechanical
                  </label>
                  <label>
                    <input type="radio" value="Electrical" checked={tagType === 'Electrical'} onChange={(e) => setTagType(e.target.value)} /> Electrical
                  </label>
                  <label>
                    <input type="radio" value="Safety" checked={tagType === 'Safety'} onChange={(e) => setTagType(e.target.value)} /> Safety
                  </label>
                </div>
              </div>
              <div className="input-group">
                <label>Priority Level</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="Low">Low - Monitor</option>
                  <option value="Medium">Medium - Requires Maintenance</option>
                  <option value="High">High - Impeding Production</option>
                  <option value="Critical">Critical - Safety/Line Stop</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Description of Fault</label>
              <textarea 
                placeholder="Describe the exact issue, sounds, leaks, or mechanical failures..." 
                value={description} onChange={(e) => setDescription(e.target.value)} rows="3" required
              ></textarea>
            </div>

            <div className="input-group">
              <label>Description of Action to be Taken</label>
              <textarea 
                placeholder="What steps need to be taken to resolve this? (Optional)" 
                value={actionToBeTaken} onChange={(e) => setActionToBeTaken(e.target.value)} rows="2"
              ></textarea>
            </div>

            <button type="submit" className="submit-issue-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Transmitting...' : 'Attach Tag to Database'}
            </button>
          </form>
        </section>

        <section className="feed-section">
          <h3 className="feed-title">Active Reports</h3>
          <div className="fault-list">
            {faults.length === 0 ? (
              <p className="empty-state">No issues currently logged for this operator.</p>
            ) : (
              faults.map(fault => (
                <div key={fault._id} className="fault-card">
                  <div className="fault-card-header">
                    <span className={`status-badge ${fault.status.toLowerCase().replace(' ', '-')}`}>
                      {fault.status}
                    </span>
                    <span className="timestamp">
                      {new Date(fault.dateRaised || fault.createdAt).toLocaleDateString()} — {fault.shift} Shift
                    </span>
                  </div>
                  <div className="fault-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 className="equipment-title">{fault.equipment} <span style={{fontSize: '0.8rem', color: '#888', fontWeight: 'normal'}}>| {fault.area}</span></h4>
                      <span style={{ fontSize: '0.85rem', color: '#bbb', border: '1px solid #444', padding: '2px 8px', borderRadius: '4px' }}>{fault.tagType} Tag</span>
                    </div>
                    <p className="fault-desc" style={{ marginTop: '8px' }}>{fault.description}</p>
                    {fault.actionToBeTaken && (
                      <div style={{ marginTop: '12px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '6px', borderLeft: '3px solid #4ade80' }}>
                        <span style={{ fontSize: '0.8rem', color: '#4ade80', textTransform: 'uppercase', fontWeight: 'bold' }}>Action Required:</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#ddd' }}>{fault.actionToBeTaken}</p>
                      </div>
                    )}
                  </div>
                  <div className="fault-card-footer">
                    <span className={`priority-indicator ${fault.priority.toLowerCase()}`}>
                      <span className="dot"></span> {fault.priority} Priority
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;