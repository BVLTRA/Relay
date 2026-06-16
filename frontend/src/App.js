import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthFlow from './pages/AuthFlow';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Account from './pages/Account'; // <-- Import the new page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthFlow />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* The New Account Route */}
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;