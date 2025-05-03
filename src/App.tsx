import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DpiasPage from './pages/DpiasPage';
import DpiaDetailPage from './pages/DpiaDetailPage';
import DpiaFormPage from './pages/DpiaFormPage';
import HelpPage from './pages/HelpPage';

function App() {
  const { getUser } = useAuthStore();
  
  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dpias" element={<DpiasPage />} />
        <Route path="/dpias/:id" element={<DpiaDetailPage />} />
        <Route path="/dpias/:id/edit" element={<DpiaFormPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
