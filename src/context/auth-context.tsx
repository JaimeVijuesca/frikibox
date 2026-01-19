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
  user: User | null | undefined; // 👈 ahora puede ser undefined
  loading: boolean;
  login: (email: string, password: string) => Promise<User | false>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<Boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined); // 👈 antes era null
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://frikibox-backend.vercel.app';

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null); // 👈 ahora null significa “no logueado”
    }

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

      const isAdmin = email === 'admin@frikibox.com';

      const userData: User = {
        uid: data.user?.id,
        name: data.user?.name || (isAdmin ? 'FrikiBOX' : 'Usuario'),
        email,
        isAdmin,
      };

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return userData;
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
      setUser(data.user || data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user || data));
      return true;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
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
