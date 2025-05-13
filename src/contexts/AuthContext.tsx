
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { verifyAdminToken } from '@/lib/auth';

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
      console.log("Checking admin authentication");
      const token = localStorage.getItem('admin-token');
      if (token) {
        console.log("Admin token found, verifying...");
        const isValid = await verifyAdminToken(token);
        console.log("Token valid:", isValid);
        setIsAdmin(isValid);
      } else {
        console.log("No admin token found");
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (token: string): Promise<boolean> => {
    console.log("Login attempt with token");
    setIsLoading(true);
    const isValid = await verifyAdminToken(token);
    
    if (isValid) {
      console.log("Token is valid, setting admin status to true");
      localStorage.setItem('admin-token', token);
      setIsAdmin(true);
      setIsLoading(false);
      return true;
    }
    
    console.log("Token is invalid");
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    console.log("Logging out, removing admin token");
    localStorage.removeItem('admin-token');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
