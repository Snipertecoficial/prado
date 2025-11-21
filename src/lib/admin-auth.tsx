import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface AdminUser {
  email: string;
}

interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = "admin-session";

const ADMIN_CREDENTIALS = {
  email: "douglas@snipertec.com.br",
  password: "Admin213021#",
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
    if (stored) {
      try {
        const parsed: AdminUser = JSON.parse(stored);
        if (parsed?.email) {
          setUser(parsed);
        }
      } catch (error) {
        console.warn("Failed to parse stored admin session", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const newUser = { email };
      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      return { success: true };
    }

    return { success: false, message: "Credenciais inválidas. Verifique e tente novamente." };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
  }), [login, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
