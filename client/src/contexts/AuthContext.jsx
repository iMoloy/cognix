"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
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
  const [profileOverride, setProfileOverride] = useState({});

  const user = useMemo(() => {
    if (!sessionData?.user) return null;
    return {
      ...sessionData.user,
      photoURL: sessionData.user.image,
      _id: sessionData.user.id,
      ...profileOverride,
    };
  }, [sessionData, profileOverride]);

  const login = useCallback(async ({ email, password }) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message || "Failed to log in");
    }
    return data;
  }, []);

  const register = useCallback(async ({ name, email, photoURL, password }) => {
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
  }, []);

  const googleSignIn = useCallback(async () => {
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`, // Redirect after successful login
      errorCallbackURL: `${window.location.origin}/login?error=true` // Custom error redirection
    });
    
    if (error) {
      throw new Error(error.message || "Failed to log in with Google");
    }
    
    return data;
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    if (!sessionData?.user) return;
    
    const { error } = await authClient.updateUser({
      name: updatedData.name,
      image: updatedData.photoURL
    });
    
    if (error) {
      console.error("Failed to update profile", error);
    }

    try {
      await fetch(`${BACKEND_URL}/api/users/${sessionData.user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
    } catch (err) {
      console.error("Failed to update profile on backend", err);
    }

    setProfileOverride((prev) => ({ ...prev, ...updatedData }));
  }, [sessionData]);

  const upgradeToPremium = useCallback(async () => {
    setProfileOverride((prev) => ({ ...prev, subscription: "premium" }));
  }, []);

  const logout = useCallback(async () => {
    await authClient.signOut();
    setProfileOverride({});
  }, []);

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
    [user, isPending, login, register, googleSignIn, updateProfile, upgradeToPremium, logout],
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
