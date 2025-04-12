// src/components/GoogleLoginButton.jsx
import React from 'react';
import { authService } from '../services/authService';

const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      const authUrl = await authService.getGoogleAuthUrl();
      // Redirect user to Google authentication
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initiate Google login:', error);
      alert('Could not connect to Google authentication service.');
    }
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      className="google-login-button"
    >
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;

// src/components/GoogleCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const GoogleCallback = () => {
  const [status, setStatus] = useState('Processing authentication...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract code from URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          setStatus('Authentication failed: No authorization code received');
          return;
        }

        // Process the code with our backend
        const result = await authService.handleGoogleCallback(code);
        
        if (result.success) {
          setStatus('Authentication successful! Redirecting...');
          // Redirect to the app's main page or dashboard
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          setStatus('Authentication failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        setStatus('Authentication error. Please try again.');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="auth-callback-container">
      <h2>Google Authentication</h2>
      <p>{status}</p>
    </div>
  );
};

export default GoogleCallback;

// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      if (authService.isAuthenticated()) {
        const userInfo = await authService.getSessionInfo();
        setUser(userInfo);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    logout,
    refreshAuth: checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
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