"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const MOCK_USERS = {
  "admin@cognix.com": {
    name: "Admin User",
    email: "admin@cognix.com",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    role: "admin",
    subscription: "premium",
  },
  "creator@cognix.com": {
    name: "Creator User",
    email: "creator@cognix.com",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Creator",
    role: "creator",
    subscription: "premium",
  },
  "user@cognix.com": {
    name: "Standard User",
    email: "user@cognix.com",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
    role: "user",
    subscription: "free",
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("cognix_token");
    const storedUser = localStorage.getItem("cognix_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const saveSession = (sessionUser, sessionToken) => {
    setUser(sessionUser);
    setToken(sessionToken);
    localStorage.setItem("cognix_user", JSON.stringify(sessionUser));
    localStorage.setItem("cognix_token", sessionToken);
  };

  const login = (formData) => {
    // Temporary frontend session until backend auth is wired.
    const defaultUser = {
      name: "Cognix User",
      email: formData.email,
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + formData.email,
      role: "user",
      subscription: "free",
    };
    
    const matchedUser = MOCK_USERS[formData.email] || defaultUser;

    saveSession(matchedUser, "frontend-demo-token");
  };

  const register = (formData) => {
    // Store a local session so protected UI can be built now.
    saveSession(
      {
        name: formData.name,
        email: formData.email,
        photoURL: formData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        role: "user",
        subscription: "free",
      },
      "frontend-demo-token",
    );
  };

  const updateProfile = (updatedData) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      saveSession(newUser, token);
    }
  };

  const upgradeToPremium = () => {
    if (user) {
      const newUser = { ...user, subscription: "premium" };
      saveSession(newUser, token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("cognix_user");
    localStorage.removeItem("cognix_token");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      updateProfile,
      upgradeToPremium,
      logout,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

