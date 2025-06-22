import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Always false, no backend
  const [token, setToken] = useState(null);

  // No backend: skip useEffect and verifyToken

  const login = async (email, password) => {
    // Always succeed and set a mock user
    const mockUser = { username: email.split("@")[0] || "user", email };
    setUser(mockUser);
    setToken("mock-token");
    localStorage.setItem("token", "mock-token");
    return { success: true };
  };

  const signup = async (email, password, username) => {
    // Always succeed and set a mock user
    const mockUser = { username, email };
    setUser(mockUser);
    setToken("mock-token");
    localStorage.setItem("token", "mock-token");
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
