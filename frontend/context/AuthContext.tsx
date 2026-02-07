import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  role: UserRole | null;
}

import { AuthService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Try to fetch latest profile from backend
      const res = await AuthService.getProfile();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('pccoe_user', JSON.stringify(res.user));
      } else {
        // Fallback to local storage if API fails (e.g. offline) or token expired
        // If token expired (401), we should probably clear user, but keeping simple for now
        const storedUser = localStorage.getItem('pccoe_user');
        if (storedUser) {
          // Ideally verify if 'res.message' indicated auth failure
          setUser(JSON.parse(storedUser));
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('pccoe_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pccoe_user');
    // Call API logout if necessary handled in component
  };

  const role = user?.roles && user.roles.length > 0
    ? (user.roles[0] as UserRole)
    : null;

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};