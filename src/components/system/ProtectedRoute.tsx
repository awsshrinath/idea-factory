
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/auth',
}) => {
  const { isAuthenticated, session } = useAuth();

  // The session is still loading
  if (session === undefined) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}; 
