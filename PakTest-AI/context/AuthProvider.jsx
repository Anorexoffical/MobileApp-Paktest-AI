import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await authClient.getSession();
      const sessionUser = res?.data?.user ?? null;
      setUser(sessionUser);
      return sessionUser;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    fetchSession().finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authClient.signIn.email({ email, password });
    if (res?.data?.user) setUser(res.data.user);
    return res;
  };

  const signup = async (name, email, password) => {
    const res = await authClient.signUp.email({ name, email, password });
    if (res?.data?.user) setUser(res.data.user);
    return res;
  };

  const loginWithGoogle = async (onSuccess) => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "paktest-ai://",
    });
    // Poll up to 10s for session after OAuth redirect
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const sessionUser = await fetchSession();
      if (sessionUser) {
        onSuccess?.();
        return sessionUser;
      }
    }
  };

  const logout = async (onDone) => {
    await authClient.signOut();
    setUser(null);
    onDone?.();
  };

  const completeProfile = async (profileData) => {
    const session = await authClient.getSession();
    const token = session?.data?.session?.token;
    await api.post("/user/complete-profile", profileData, token);
    setUser((prev) => ({ ...prev, profileCompleted: true }));
  };

  const getUserAvatar = () => user?.image || null;
  const getUserName = () => user?.name || user?.email?.split("@")[0] || "Aspirant";

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, signup, loginWithGoogle, logout, completeProfile,
      getUserAvatar, getUserName,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
