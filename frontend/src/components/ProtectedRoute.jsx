import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the  token exists in the browser's storage
  const token = localStorage.getItem('gridlock_token');

  // If no token, redirect them to the home/login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If they have a token, go to the Dashboard
  return children;
};

export default ProtectedRoute;