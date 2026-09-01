import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-main)]">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></span>
          <span className="text-sm font-medium">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/citizen/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
