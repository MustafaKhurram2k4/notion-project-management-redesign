import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/initialData';

export type AuthView = 'login' | 'signup' | 'forgot-password';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authView: AuthView;
  setAuthView: (view: AuthView) => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsUser: (userId: string) => void;
  signup: (name: string, email: string, role: string, department: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthLoading: boolean;
}

const STORAGE_PREFIX = 'waypoint_v1_';
const AUTH_TOKEN_KEY = STORAGE_PREFIX + 'auth_token';
const AUTH_USER_ID_KEY = STORAGE_PREFIX + 'auth_user_id';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_USER_ID_KEY) || 'user-1'; // Default authenticated as Alexandra Vance for seamless demo
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Sync users if changed in storage
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
      if (saved) setUsers(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    // Check initial auth token
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const savedUserId = localStorage.getItem(AUTH_USER_ID_KEY);

    if (token && savedUserId) {
      setUserId(savedUserId);
    } else if (!token && !savedUserId) {
      // First visit initialization: set token to demo user
      localStorage.setItem(AUTH_TOKEN_KEY, `demo_token_${Date.now()}`);
      localStorage.setItem(AUTH_USER_ID_KEY, 'user-1');
      setUserId('user-1');
    }
    setIsAuthLoading(false);
  }, []);

  const currentUser = users.find(u => u.id === userId) || (userId ? users[0] : null);
  const isAuthenticated = !!userId && !!currentUser;

  const login = async (email: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsAuthLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 350));

    const cleanEmail = email.trim().toLowerCase();
    let foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      // If user isn't in mock database, generate an account for them
      const newId = `user-${Date.now()}`;
      const nameFromEmail = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Studio Member';
      foundUser = {
        id: newId,
        name: nameFromEmail,
        email: cleanEmail,
        role: 'Initiative Lead',
        department: 'Product',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        status: 'available',
        capacityHours: 40,
        assignedHours: 15,
        location: 'San Francisco, CA',
      };
      const updatedUsers = [...users, foundUser];
      setUsers(updatedUsers);
      localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(updatedUsers));
    }

    const token = `waypoint_token_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_ID_KEY, foundUser.id);
    setUserId(foundUser.id);
    setIsAuthLoading(false);
    return { success: true };
  };

  const loginAsUser = (targetUserId: string) => {
    const target = users.find(u => u.id === targetUserId);
    if (target) {
      const token = `waypoint_token_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_ID_KEY, target.id);
      setUserId(target.id);
    }
  };

  const signup = async (
    name: string,
    email: string,
    role: string,
    department: string,
    _password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsAuthLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));

    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      setIsAuthLoading(false);
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    const newId = `user-${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: name.trim() || 'New Member',
      email: cleanEmail,
      role: role || 'Product Specialist',
      department: department || 'Engineering',
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80`,
      status: 'available',
      capacityHours: 40,
      assignedHours: 0,
      location: 'Remote / Hybrid',
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(updatedUsers));

    const token = `waypoint_token_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_ID_KEY, newUser.id);
    setUserId(newUser.id);
    setIsAuthLoading(false);
    return { success: true };
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 450));
    if (!email || !email.includes('@')) {
      return { success: false, message: '', error: 'Please provide a valid email address.' };
    }
    return {
      success: true,
      message: `A secure authentication reset link has been dispatched to ${email}. Check your inbox to reset your password.`,
    };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_ID_KEY);
    setUserId(null);
    setAuthView('login');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!userId) return;
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, ...updates };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated,
        authView,
        setAuthView,
        login,
        loginAsUser,
        signup,
        forgotPassword,
        logout,
        updateProfile,
        isAuthLoading,
      }}
    >
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
