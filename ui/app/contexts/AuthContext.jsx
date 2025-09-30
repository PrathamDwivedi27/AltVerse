// contexts/AuthContext.jsx
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// IMPORTANT: Define your backend's base URL once.
// Make sure this is correct for your setup.
const API_URL = 'http://localhost:4000'; // Change 5000 to your backend's port

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function checks if the user is logged in by asking the backend.
    const checkUserStatus = async () => {
      try {
        // We need to send cookies with our request.
        const response = await fetch(`${API_URL}/api/auth/status`, {
          credentials: 'include', // This is crucial for sending the session cookie
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        console.error("Could not fetch user status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const login = () => {
    // This simply navigates the whole page to the backend login route.
    window.location.href = `${API_URL}/auth/google`;
  };

  const logout = async () => {
    // Call the backend logout route
    await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    setUser(null);
    window.location.href = '/';
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