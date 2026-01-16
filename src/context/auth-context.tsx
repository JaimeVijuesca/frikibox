'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const ADMIN_EMAIL = 'admin@frikibox.com';
const STORAGE_KEY = 'auth_user';

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

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;

    const isAdmin = email === ADMIN_EMAIL;

    const mockUser: User = {
      uid: `mock-${Date.now()}`,
      name: isAdmin ? 'FrikiBOX' : 'Usuario Mock',
      email,
      isAdmin,
    };

    setUser(mockUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));

    return true;
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    if (!name || !email || !password) return false;

    const mockUser: User = {
      uid: `mock-${Date.now()}`,
      name,
      email,
      isAdmin: email === ADMIN_EMAIL,
    };

    setUser(mockUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));

    return true;
  };

  const logout = async (): Promise<boolean> => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
