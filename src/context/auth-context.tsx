'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const STORAGE_KEY = 'auth_user';

interface User {
  uid: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | false>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<Boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:3001';

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    
    const isAdmin = email === 'admin@frikibox.com'; // override si quieres admin
    const userData: User = {
      uid: data.user?.uid || `mock-${Date.now()}`,
      name: data.user?.name || (isAdmin ? 'FrikiBOX' : 'Usuario'),
      email,
      isAdmin,
    };

    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return userData; // <-- retorna el user completo
  } catch (err) {
    console.error('Login error:', err);
    return false;
  } finally {
    setLoading(false);
  }
};


  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      setUser(data.user || data); // data.user si tu backend lo envía así
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user || data));
      return true;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
  try {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Logout error:', err);
    return false;
  }
};

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
