import React, { createContext, useContext, useState } from 'react';
import { loginCitizen as apiLogin, registerCitizen as apiRegister } from '../services/api';
import { DEMO_USER } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('janseva_user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Auth context restoration error", e);
    }
    return null;
  });

  const [isLoading] = useState(false);

  const login = async (mobile, password) => {
    const response = await apiLogin(mobile, password);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  };

  const loginAsDemo = () => {
    localStorage.setItem('janseva_user', JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
  };

  const register = async (userData) => {
    const response = await apiRegister(userData);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem('janseva_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        register,
        logout
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
