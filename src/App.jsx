import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import LandingPage from './components/LandingPage.jsx';
import InterestForm from './components/InterestForm.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import { isAdminAuthenticated } from './utils/auth.js';
import './App.css';

function App() {
  const [authState, setAuthState] = useState(() => isAdminAuthenticated());

  const handleLoginSuccess = useCallback(() => {
    setAuthState(true);
  }, []);

  const handleLogout = useCallback(() => {
    setAuthState(false);
  }, []);

  return (
    <BrowserRouter>
      <Header onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<InterestForm />} />
        <Route
          path="/admin"
          element={
            authState ? (
              <AdminDashboard />
            ) : (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;