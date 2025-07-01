
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole, UserRole } from '@/hooks/useRole';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/auth',
  requiredRole,
}) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { userRole, loading: roleLoading } = useRole();

  // Show loading spinner while checking auth state and role
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check role-based access
  if (requiredRole && userRole !== requiredRole) {
    const defaultPath = userRole === 'admin' ? '/admin' : '/';
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
};

// Admin-only route wrapper
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin" redirectPath="/">
    {children}
  </ProtectedRoute>
);
