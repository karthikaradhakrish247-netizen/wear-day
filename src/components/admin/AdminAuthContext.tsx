import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  token: string | null;
  adminUser: { id: string; username: string; last_login?: string } | null;
  isAuthenticated: boolean;
  login: (token: string, user: { id: string; username: string; last_login?: string }) => void;
  logout: () => void;
  checkingAuth: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('wearday_admin_token'));
  const [adminUser, setAdminUser] = useState<{ id: string; username: string; last_login?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('wearday_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setCheckingAuth(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/check', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (!data.authenticated) {
            logout();
          }
        } else {
          logout();
        }
      } catch {
        // network error, retain session
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = (newToken: string, user: { id: string; username: string; last_login?: string }) => {
    setToken(newToken);
    setAdminUser(user);
    localStorage.setItem('wearday_admin_token', newToken);
    localStorage.setItem('wearday_admin_user', JSON.stringify(user));
  };

  const logout = () => {
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('wearday_admin_token');
    localStorage.removeItem('wearday_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        adminUser,
        isAuthenticated: Boolean(token),
        login,
        logout,
        checkingAuth
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
