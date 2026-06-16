import React from 'react';
import './AuthScreen.css';
import GlowOrbs from './GlowOrb'; 

// Notice I changed 'gridZone' to 'buttonZone'
const AuthScreen = ({ title, subtitle, formInputs, buttonZone }) => {
  return (
    <div className="auth-container">
      <GlowOrbs />

      <div className="auth-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        
        {/* The New Centered Login Box */}
        <div 
          className="text-section" 
          style={{ 
            backgroundColor: '#111111b2', 
            padding: '3rem', 
            borderRadius: '12px', 
            border: '1px solid #333', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            maxWidth: '450px', 
            width: '100%',
            zIndex: 10 
          }}
        >
          <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>{title}</h1>
          <p style={{ color: '#888', marginBottom: '2rem', textAlign: 'center' }}>{subtitle}</p>
          
          {/* The Inputs (Name, Email, Password) */}
          <div className="form-inputs-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            {formInputs}
          </div>

          {/* The Login/Register Button and Toggle Text */}
          <div style={{ marginTop: '2rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {buttonZone}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthScreen;