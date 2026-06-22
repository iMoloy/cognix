"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  updateProfile as updateFirebaseProfile 
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const AuthContext = createContext(null);
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  // Sync Firebase User with our MongoDB Database and JWT
  const syncUserWithBackend = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setToken("");
      localStorage.removeItem("cognix_token");
      return;
    }

    const userData = {
      name: firebaseUser.displayName || "Cognix User",
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
    };

    try {
      // 1. Start JWT Generation in parallel immediately
      const jwtPromise = fetch(`${API_URL}/api/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: firebaseUser.email }),
      });

      // 2. Save or Update User in MongoDB
      await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      // 3. Fetch User Details & await JWT in parallel
      const [userRes, jwtRes] = await Promise.all([
        fetch(`${API_URL}/api/users/${firebaseUser.email}`),
        jwtPromise
      ]);

      const dbUser = await userRes.json();
      const jwtData = await jwtRes.json();
      
      if (jwtData.token) {
        setToken(jwtData.token);
        localStorage.setItem("cognix_token", jwtData.token);
      }

      // 4. Merge Firebase User with DB details
      setUser({
        ...userData,
        role: dbUser?.role || "user",
        subscription: dbUser?.subscription || "free",
        _id: dbUser?._id,
      });

    } catch (error) {
      console.error("Failed to sync user with backend:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        await syncUserWithBackend(currentUser);
      } else {
        setUser(null);
        setToken("");
        localStorage.removeItem("cognix_token");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, photoURL, password }) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update Firebase Profile
      await updateFirebaseProfile(result.user, {
        displayName: name,
        photoURL: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      });
      // Trigger sync manually since onAuthStateChanged might fire before profile update
      await syncUserWithBackend({ ...result.user, displayName: name, photoURL });
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    if (!user) return;
    
    // 1. Update Firebase Auth Profile
    if (updatedData.name || updatedData.photoURL !== undefined) {
      const { currentUser } = auth;
      if (currentUser) {
        await updateFirebaseProfile(currentUser, {
          displayName: updatedData.name || currentUser.displayName,
          photoURL: updatedData.photoURL !== undefined ? updatedData.photoURL : currentUser.photoURL,
        });
      }
    }

    // 2. Update Backend MongoDB
    try {
      await fetch(`${API_URL}/api/users/${user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
    } catch (error) {
      console.error("Failed to update profile on backend", error);
    }

    // 3. Update React State
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const upgradeToPremium = async () => {
    if (user) {
      setUser((prev) => ({ ...prev, subscription: "premium" }));
      // Optional: Call backend to update subscription
    }
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      googleSignIn,
      updateProfile,
      upgradeToPremium,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
