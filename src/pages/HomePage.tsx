import React from 'react';
import Layout from '../components/layout/Layout';
import Dashboard from '../components/home/Dashboard';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default HomePage;
