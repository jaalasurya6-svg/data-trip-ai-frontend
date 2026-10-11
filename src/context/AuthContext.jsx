import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  getCurrentUserProfile,
  logoutUser,
  checkHealth
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('daytrip_auth_token'));
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'register'
  const [authError, setAuthError] = useState(null);

  // Initialize and restore session on mount + pre-warm backend
  useEffect(() => {
    // Non-blocking background warm-up for Render free-tier cold starts
    checkHealth().catch(() => {});

    const initAuth = async () => {
      const savedToken = localStorage.getItem('daytrip_auth_token');
      if (savedToken) {
        try {
          const res = await getCurrentUserProfile();
          setCurrentUser(res.data);
          setToken(savedToken);
        } catch (err) {
          console.warn('Stored JWT session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await loginUser({ email, password });
      const authData = res.data;
      localStorage.setItem('daytrip_auth_token', authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem('daytrip_refresh_token', authData.refreshToken);
      }
      setToken(authData.accessToken);
      setCurrentUser(authData.user);
      setShowAuthModal(false);
      return authData;
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    try {
      const res = await registerUser(userData);
      const authData = res.data;
      localStorage.setItem('daytrip_auth_token', authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem('daytrip_refresh_token', authData.refreshToken);
      }
      setToken(authData.accessToken);
      setCurrentUser(authData.user);
      setShowAuthModal(false);
      return authData;
    } catch (err) {
      const msg = err.message || 'Registration failed.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('daytrip_refresh_token');
    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (ignored) {}
    localStorage.removeItem('daytrip_auth_token');
    localStorage.removeItem('daytrip_refresh_token');
    setToken(null);
    setCurrentUser(null);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthTab(tab);
    setAuthError(null);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'ROLE_ADMIN',
        loading,
        showAuthModal,
        authTab,
        authError,
        setAuthTab,
        setAuthError,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
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
