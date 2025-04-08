
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type UserRole = 'user' | 'provider' | null;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  balance: number;
  isLoggedIn: boolean;
  businessName?: string;
  businessDescription?: string;
  isBusinessAccount?: boolean;
}

interface UserContextType {
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => void;
  switchRole: () => void;
  updateBalance: (amount: number) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const initialUser: UserProfile | null = null;

const UserContext = createContext<UserContextType>({
  user: initialUser,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
  updateBalance: () => {},
  updateProfile: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(initialUser);

  const login = (userData: UserProfile) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = () => {
    if (!user) return;
    
    // Switch between 'user' and 'provider' roles
    const newRole: UserRole = user.role === 'user' ? 'provider' : 'user';
    
    setUser({
      ...user,
      role: newRole,
    });
    
    // Redirect logic is handled in the Profile component
    // We'll redirect after the state update is complete
  };

  const updateBalance = (amount: number) => {
    if (!user) return;
    
    setUser({
      ...user,
      balance: user.balance + amount,
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    setUser({
      ...user,
      ...updates,
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, switchRole, updateBalance, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
