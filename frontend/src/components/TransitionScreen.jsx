import React, { useEffect } from 'react';

const TransitionScreen = ({ user, onComplete }) => {
  useEffect(() => {
    // Timer is set to 2s to match the CSS animation duration
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  const displayName = user && user.name ? user.name : 'Operator';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#0a0a0a', 
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999
    }}>
      <style>
        {`
          @keyframes textFade {
            0% { opacity: 0; transform: translateY(10px); }
            15% { opacity: 1; transform: translateY(0); }
            85% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
        `}
      </style>
      
      <h1 style={{ 
        color: '#fff', 
        fontSize: '3rem', 
        fontWeight: '400', 
        letterSpacing: '2px',
        opacity: 0, 
        // Locked strictly to 2s
        animation: 'textFade 2s ease-in-out forwards'
      }}>
        Welcome back, <span style={{ fontWeight: '600' }}>{displayName}</span>.
      </h1>
    </div>
  );
};

export default TransitionScreen;