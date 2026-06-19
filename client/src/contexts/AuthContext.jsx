"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const demoUser = {
  name: "Cognix Creator",
  email: "creator@cognix.dev",
  photoURL: "",
  role: "creator",
  subscription: "free",
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
    saveSession(
      {
        ...demoUser,
        email: formData.email,
      },
      "frontend-demo-token",
    );
  };

  const register = (formData) => {
    // Store a local session so protected UI can be built now.
    saveSession(
      {
        name: formData.name,
        email: formData.email,
        photoURL: formData.photoURL,
        role: "user",
        subscription: "free",
      },
      "frontend-demo-token",
    );
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

