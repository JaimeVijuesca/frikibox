'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const ADMIN_EMAIL = 'admin@frikibox.com';

interface User {
  uid: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user
    setTimeout(() => {
      // In a real app, you might check localStorage or a cookie
      setLoading(false);
    }, 500);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // This is a mock login. In a real app, you'd call your backend.
    if (email && password) {
      const isAdmin = email === ADMIN_EMAIL;
      const mockUser: User = {
        uid: `mock-${Date.now()}`,
        name: isAdmin ? 'FrikiBOX' : 'Usuario Mock',
        email: email,
        isAdmin: isAdmin,
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };
  
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // This is a mock registration.
    if (name && email && password) {
       const mockUser: User = {
        uid: `mock-${Date.now()}`,
        name: name,
        email: email,
        isAdmin: email === ADMIN_EMAIL,
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = async (): Promise<boolean> => {
    setUser(null);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
