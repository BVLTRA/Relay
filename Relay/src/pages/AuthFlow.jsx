import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthScreen from '../components/AuthScreen';
import TransitionScreen from '../components/TransitionScreen';

const AuthFlow = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login');
  const [appPhase, setAppPhase] = useState('auth');
  const [currentUser, setCurrentUser] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

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
        body: JSON.stringify({ name, email, password })
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
            <input
              type="text"
              placeholder="Enter your name"
              style={{ width: '100%', backgroundColor: '#000', color: '#fff', border: '1px solid #555', borderRadius: '8px', padding: '12px 14px', fontSize: '1rem', outline: 'none' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Enter your email"
            style={{ width: '100%', backgroundColor: '#000', color: '#fff', border: '1px solid #555', borderRadius: '8px', padding: '12px 14px', fontSize: '1rem', outline: 'none', marginTop: '10px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            style={{ width: '100%', backgroundColor: '#000', color: '#fff', border: '1px solid #555', borderRadius: '8px', padding: '12px 14px', fontSize: '1rem', outline: 'none', marginTop: '10px' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {serverMessage && (
            <div style={{ marginTop: '1rem', color: isError ? '#ff4d4d' : '#4ade80', textAlign: 'center' }}>
              {serverMessage}
            </div>
          )}
        </>
      }
      buttonZone={
        <>
          <button
            onClick={handleSubmit}
            style={{ width: '100%', background: '#fff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginBottom: '1rem' }}
          >
            {authMode === 'login' ? 'Login' : 'Register'}
          </button>
          <button
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login');
              setServerMessage('');
            }}
            style={{ background: 'transparent', color: '#888', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {authMode === 'login' ? "Don't have an account? Register instead." : "Already have an account? Login here."}
          </button>
        </>
      }
    />
  );
};

export default AuthFlow;