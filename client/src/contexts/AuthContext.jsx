"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authClient } from "../lib/auth-client";

const AuthContext = createContext(null);

// The configured backend URL (baked in at build time)
const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com").replace(/\/$/, "");

if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    let [resource, config] = args;

    if (typeof resource === "string") {
      // Rewrite direct backend URL → go through Next.js rewrite proxy (same-origin → cookies work!)
      const sources = [BACKEND_URL, "http://localhost:5000"];
      for (const src of sources) {
        if (resource.startsWith(src)) {
          resource = window.location.origin + resource.slice(src.length);
          break;
        }
      }
    }

    config = config || {};
    config.credentials = "include";

    return originalFetch(resource, config);
  };
}

export function AuthProvider({ children }) {
  const { data: sessionData, isPending } = authClient.useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (sessionData?.user) {
      setUser({
        ...sessionData.user,
        photoURL: sessionData.user.image,
        _id: sessionData.user.id,
      });
    } else {
      setUser(null);
    }
  }, [sessionData]);

  const login = async ({ email, password }) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message || "Failed to log in");
    }
    return data;
  };

  const register = async ({ name, email, photoURL, password }) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      image: photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`
    });
    
    if (error) {
      throw new Error(error.message || "Failed to register");
    }
    
    return data;
  };

  const googleSignIn = async () => {
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`, // Redirect after successful login
      errorCallbackURL: `${window.location.origin}/login?error=true` // Custom error redirection
    });
    
    if (error) {
      throw new Error(error.message || "Failed to log in with Google");
    }
    
    return data;
  };

  const updateProfile = async (updatedData) => {
    if (!user) return;
    
    const { error } = await authClient.updateUser({
      name: updatedData.name,
      image: updatedData.photoURL
    });
    
    if (error) {
      console.error("Failed to update profile", error);
    }

    try {
      await fetch(`${BACKEND_URL}/api/users/${user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
    } catch (err) {
      console.error("Failed to update profile on backend", err);
    }

    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const upgradeToPremium = async () => {
    if (user) {
      setUser((prev) => ({ ...prev, subscription: "premium" }));
    }
  };

  const logout = async () => {
    await authClient.signOut();
  };

  const value = useMemo(
    () => ({
      user,
      token: "session-cookie", // Stub so existing code checking for token continues to work
      loading: isPending,
      isAuthenticated: Boolean(user),
      login,
      register,
      googleSignIn,
      updateProfile,
      upgradeToPremium,
      logout,
    }),
    [user, isPending],
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
