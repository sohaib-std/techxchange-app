import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api'; // We'll create this service next

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true to check existing token
  const [error, setError] = useState('');

  // Check if user is logged in on app start (e.g., page refresh)
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('techxchange_token');
      if (token) {
        // Set the token in the API service headers
        authService.setToken(token);
        try {
          // Verify the token is still valid by fetching user profile
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (err) {
          console.error('Invalid or expired token:', err);
          logout(); // Clear invalid token
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.login({ email, password });
      const { token, ...userData } = response.data;

      // Store token in localStorage
      localStorage.setItem('techxchange_token', token);
      authService.setToken(token); // Set token for future API calls

      setUser(userData);
      setError('');
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.register(userData);
      const { token, ...newUser } = response.data;

      localStorage.setItem('techxchange_token', token);
      authService.setToken(token);

      setUser(newUser);
      setError('');
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('techxchange_token');
    authService.setToken(null);
    setUser(null);
    setError('');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;