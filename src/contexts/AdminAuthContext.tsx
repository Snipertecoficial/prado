import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { verifyAdminSecret, verifyAdminCredentials } from "@/lib/auth";

const STORAGE_KEY = "prado.admin.session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 hours

type Session = {
  token: string;
  expiresAt: number;
};

type AdminAuthContextValue = {
  initializing: boolean;
  isAuthenticated: boolean;
  sessionExpiresAt: number | null;
  login: (emailOrSecret: string, password?: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const loadStoredSession = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Session;
    if (
      typeof parsed?.token === "string" &&
      parsed.token.length > 0 &&
      typeof parsed?.expiresAt === "number"
    ) {
      return parsed;
    }
  } catch (error) {
    console.error("Failed to parse admin session", error);
  }

  return null;
};

const persistSession = (session: Session | null) => {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const createSession = (): Session => ({
  token: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
  expiresAt: Date.now() + SESSION_DURATION_MS,
});

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const stored = loadStoredSession();
    if (stored && stored.expiresAt > Date.now()) {
      setSession(stored);
    } else if (stored) {
      persistSession(null);
    }

    setInitializing(false);
  }, []);

  useEffect(() => {
    persistSession(session);
  }, [session]);

  const login = async (emailOrSecret: string, password?: string) => {
    let isValid = false;

    // If password is provided, use email + password authentication
    if (password !== undefined) {
      isValid = await verifyAdminCredentials(emailOrSecret, password);
    } else {
      // Otherwise, use the old secret-based authentication
      isValid = await verifyAdminSecret(emailOrSecret);
    }

    if (!isValid) {
      throw new Error("Invalid admin credentials");
    }

    const newSession = createSession();
    setSession(newSession);
  };

  const logout = () => setSession(null);

  const isAuthenticated = useMemo(() => {
    if (!session) return false;

    return session.expiresAt > Date.now();
  }, [session]);

  useEffect(() => {
    if (session && session.expiresAt <= Date.now()) {
      setSession(null);
    }
  }, [session]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      initializing,
      isAuthenticated,
      sessionExpiresAt: session?.expiresAt ?? null,
      login,
      logout,
    }),
    [initializing, isAuthenticated, session?.expiresAt],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }

  return context;
};
