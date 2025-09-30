// contexts/AuthContext.jsx
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
// Import our API service functions
import { checkAuthStatus, loginWithGoogle, logoutUser } from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial app load, check if the user is already logged in
    const verifyUser = async () => {
      const userData = await checkAuthStatus();
      setUser(userData);
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = () => {
    // Call the login function from our API service
    loginWithGoogle();
  };

  const logout = async () => {
    const success = await logoutUser();
    if (success) {
      setUser(null);
      window.location.href = '/'; // Redirect to home after logout
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};