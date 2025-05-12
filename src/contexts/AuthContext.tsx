
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { verifyAdminToken } from '@/lib/supabase';

interface AuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a token in localStorage
    const checkAuth = async () => {
      const token = localStorage.getItem('admin-token');
      if (token) {
        const isValid = await verifyAdminToken(token);
        setIsAdmin(isValid);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (token: string): Promise<boolean> => {
    setIsLoading(true);
    const isValid = await verifyAdminToken(token);
    
    if (isValid) {
      localStorage.setItem('admin-token', token);
      setIsAdmin(true);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin-token');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
