
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isManager: boolean;
  isCustomer: boolean;
  canManageStore: (storeId: string) => boolean;
}

const defaultUser: User = {
  id: 'user-1',
  name: 'Demo Admin',
  email: 'admin@example.com',
  role: 'admin',
};

const managerUser: User = {
  id: 'user-2',
  name: 'Store Manager',
  email: 'manager@example.com',
  role: 'manager',
  managedStores: ['store-1', 'store-2'],
};

const customerUser: User = {
  id: 'user-3',
  name: 'Customer',
  email: 'customer@example.com',
  role: 'customer',
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  isAdmin: false,
  isManager: false,
  isCustomer: false,
  canManageStore: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock authentication process for demo
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, we'd call an API here
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      if (email === 'admin@example.com') {
        setCurrentUser(defaultUser);
      } else if (email === 'manager@example.com') {
        setCurrentUser(managerUser);
      } else if (email === 'customer@example.com') {
        setCurrentUser(customerUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // When user changes, update localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const isCustomer = currentUser?.role === 'customer';

  const canManageStore = (storeId: string) => {
    if (isAdmin) return true;
    if (isManager && currentUser?.managedStores?.includes(storeId)) return true;
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        logout,
        isAdmin,
        isManager,
        isCustomer,
        canManageStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
