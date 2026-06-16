// Credits:
// - Gemini AI for creating the initial version of this component based on a description of the desired effect.

import React, { useEffect, useRef } from 'react';

const GlowOrbs = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      // 1. Calculate how far the mouse is from the center (from -1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // 2. Pass those normalized values to CSS
      containerRef.current.style.setProperty('--mouse-x', x);
      containerRef.current.style.setProperty('--mouse-y', y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', 
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      {/* Orb 1: The wide, slow, deep background glow */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: '600px', height: '600px',
        borderRadius: '50%',
        backgroundColor: 'rgba(3, 12, 65, 0.72)',
        filter: 'blur(120px)',
        // The magic: Center it (-50%), then pull it a max of 40px towards the mouse
        transform: 'translate(calc(-50% + var(--mouse-x, 0) * 40px), calc(-50% + var(--mouse-y, 0) * 40px))',
        transition: 'transform 0.8s ease-out'
      }} />

      {/* Orb 2: Smaller, slightly brighter, tighter rubber band */}
      <div style={{
        position: 'absolute',
        top: '60%', left: '60%',
        width: '350px', height: '350px',
        borderRadius: '50%',
        backgroundColor: 'rgba(6, 63, 4, 0.36)',
        filter: 'blur(80px)',
        // Pulls a max of 90px towards the mouse, making it feel "closer" to the glass
        transform: 'translate(calc(-50% + var(--mouse-x, 0) * 90px), calc(-50% + var(--mouse-y, 0) * 90px))',
        transition: 'transform 0.15s ease-out'
      }} />
    </div>
  );
};

export default GlowOrbs;