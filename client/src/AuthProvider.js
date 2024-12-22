import React, { createContext, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setIsAuthenticated(true)    
  };
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// PrivateRoute Component
export const PrivateRoute = ({ children }) => {  
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;  
};