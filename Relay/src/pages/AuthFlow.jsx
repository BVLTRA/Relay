import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthScreen from '../components/AuthScreen';
import TransitionScreen from '../components/TransitionScreen';
import './AuthFlow.css'; // Importing the clean CSS definitions

const AuthFlow = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login');
  const [appPhase, setAppPhase] = useState('auth');
  const [currentUser, setCurrentUser] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [branch, setBranch] = useState('');
  const [role, setRole] = useState('');

  const [serverMessage, setServerMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleAuthSuccess = (data) => {
    setIsError(false);
    setServerMessage(data.message);
    setCurrentUser(data.user);
    
    localStorage.setItem('gridlock_token', data.token);
    localStorage.setItem('gridlock_user', JSON.stringify(data.user));

    setTimeout(() => {
      setAppPhase('transition');
    }, 800);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) handleAuthSuccess(data);
      else { setIsError(true); setServerMessage(data.error); }
    } catch (err) {
      setIsError(true);
      setServerMessage('Server unreachable.');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, password, branch, role })
      });
      const data = await response.json();
      if (response.ok) handleAuthSuccess(data);
      else { setIsError(true); setServerMessage(data.error); }
    } catch (err) {
      setIsError(true);
      setServerMessage('Server unreachable.');
    }
  };

  const handleSubmit = () => {
    if (authMode === 'login') handleLogin();
    else handleRegister();
  };

  if (appPhase === 'transition') {
    return <TransitionScreen user={currentUser} onComplete={() => navigate('/dashboard', { state: { user: currentUser } })} />;
  }

  return (
    <AuthScreen
      title={authMode === 'login' ? 'Access Console' : 'Initialize Account'}
      subtitle={authMode === 'login' ? 'Enter your credentials to continue.' : 'Register a new operational profile.'}
      formInputs={
        <>
          {authMode === 'register' && (
            <>
              <div className="auth-input-row">
                <input
                  type="text" placeholder="First Name" className="auth-input-field"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text" placeholder="Surname" className="auth-input-field"
                  value={surname} onChange={(e) => setSurname(e.target.value)}
                />
              </div>

              <select className="auth-input-field" value={branch} onChange={(e) => setBranch(e.target.value)}>
                <option value="" disabled>Select Branch</option>
                <option value="Rosslyn Brewery">Rosslyn Brewery (Pretoria)</option>
                <option value="Alrode Brewery">Alrode Brewery (Johannesburg)</option>
                <option value="Chamdor Brewery">Chamdor Brewery (Krugersdorp)</option>
                <option value="Newlands Brewery">Newlands Brewery (Cape Town)</option>
                <option value="Prospecton Brewery">Prospecton Brewery (Durban)</option>
                <option value="Ibhayi Brewery">Ibhayi Brewery (Gqeberha)</option>
                <option value="Polokwane Brewery">Polokwane Brewery (Limpopo)</option>
              </select>

              <select className="auth-input-field" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="" disabled>Select Operational Role</option>
                <option value="Operator">Operator</option>
                <option value="Artisan">Artisan</option>
                <option value="Team Leader">Team Leader</option>
                <option value="Maintenance controller">Maintenance controller</option>
                <option value="Engineer">Engineer</option>
                <option value="Maintenance planner">Maintenance planner</option>
                <option value="Packaging manager">Packaging manager</option>
                <option value="Machine specialist">Machine specialist</option>
                <option value="Process artisan">Process artisan</option>
                <option value="Process operator">Process operator</option>
              </select>
            </>
          )}

          <input
            type="email" placeholder="Email Address" className="auth-input-field"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password" placeholder="Password" className="auth-input-field"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />

          {serverMessage && (
            <div className={`server-message ${isError ? 'error' : 'success'}`}>
              {serverMessage}
            </div>
          )}
        </>
      }
      buttonZone={
        <>
          <button onClick={handleSubmit} className="auth-submit-btn">
            {authMode === 'login' ? 'Login' : 'Register'}
          </button>
          <button
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login');
              setServerMessage('');
            }}
            className="auth-toggle-btn"
          >
            {authMode === 'login' ? "Don't have an account? Register instead." : "Already have an account? Login here."}
          </button>
        </>
      }
    />
  );
};

export default AuthFlow;