"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Admin,
  getAdminData,
  isAuthenticated,
  removeAuthToken,
} from "@/lib/api/auth";

interface AuthContextType {
  admin: Admin | null;
  isAuth: boolean;
  setAdmin: (admin: Admin | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const adminData = getAdminData();

      setIsAuth(authenticated);
      setAdmin(adminData);
    };

    checkAuth();
  }, []);

  const logout = () => {
    removeAuthToken();
    setAdmin(null);
    setIsAuth(false);
  };

  const contextValue: AuthContextType = {
    admin,
    isAuth,
    setAdmin,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
