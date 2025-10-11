import { supabase } from "@/config/supabase";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type User = {
  [key: string]: any;
};

export interface AuthContextType {
  isSignedIn: boolean;
  isInitialLoading: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  isInitialLoading: true,
  user: null,
});

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check current session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsSignedIn(true);
      }
      setIsInitialLoading(false);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsSignedIn(true);
      } else {
        setUser(null);
        setIsSignedIn(false);
      }
      setIsInitialLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, isInitialLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
