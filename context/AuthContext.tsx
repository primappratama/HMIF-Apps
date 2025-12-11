import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/services/auth.service";
import { LoginCredentials, User } from "@/types";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: {
    name: string;
    nim: string;
    email: string;
    phone: string;
    angkatan: string;
    password: string;
  }) => Promise<{ success: boolean; user: any }>; // ← Atau ini
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (isLoading) {
      return;
    }

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, segments, isLoading]);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData.user);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await loginUser(credentials);
      setUser(response.user);
    } catch (error: any) {
      alert(error.message || "Login gagal");
      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    nim: string;
    email: string;
    phone: string;
    angkatan: string;
    password: string;
  }) => {
    try {
      const response = await registerUser(userData);
      return response;
    } catch (error: any) {
      alert(error.message || "Registrasi gagal");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
