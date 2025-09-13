import { onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth } from "@/config/firebase"; // <-- use initialized instance

export type User = {
  [key: string]: any; // keys are strings, values can be anything
};

export interface AuthContextType {
  isSignedIn: boolean;
  isInitialLoading: boolean;
  user: User;
}

const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  isInitialLoading: true,
  user: {},
});

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
      setIsInitialLoading(false);
      if (user) {
        setUser(user);
        console.log(user.uid);
        console.log("signed in");
      } else console.log("not");
    });
    return () => unsub();
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
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
