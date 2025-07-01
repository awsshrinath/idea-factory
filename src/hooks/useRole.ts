
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'user';

export interface UserPermissions {
  manageIntegrations: boolean;
  viewAllUsers: boolean;
  systemSettings: boolean;
  viewAnalytics: boolean;
  manageContent: boolean;
}

export const useRole = () => {
  const { user, session } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [permissions, setPermissions] = useState<UserPermissions>({
    manageIntegrations: false,
    viewAllUsers: false,
    systemSettings: false,
    viewAnalytics: false,
    manageContent: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user || !session) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user');
        } else {
          const role = data?.role || 'user';
          setUserRole(role);
          
          // Set permissions based on role
          const isAdmin = role === 'admin';
          setPermissions({
            manageIntegrations: isAdmin,
            viewAllUsers: isAdmin,
            systemSettings: isAdmin,
            viewAnalytics: isAdmin,
            manageContent: true, // Both roles can manage content
          });
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user, session]);

  const isAdmin = userRole === 'admin';
  const isUser = userRole === 'user';

  return {
    userRole,
    permissions,
    isAdmin,
    isUser,
    loading,
  };
};
