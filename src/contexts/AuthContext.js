import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login user and store in state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setSessionExpired(false); // Reset session expired state
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setSessionExpired(false); // Reset session expired state
  };

  // Mark session as expired and show login modal
  const handleExpiredSession = () => {
    setSessionExpired(true);
    setShowAuthModal(true);
  };

  // Toggle auth modal visibility
  const toggleAuthModal = () => {
    setShowAuthModal(!showAuthModal);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      sessionExpired,
      setSessionExpired,
      showAuthModal,
      toggleAuthModal,
      handleExpiredSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
