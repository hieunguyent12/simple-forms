import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";

import { auth, googleProvider } from "../firebase";

const AuthContext = createContext<null | {
  state: {
    user: any;
    pending: boolean;
    isSignedIn: boolean;
  };
  logout: () => void;
  login: () => void;
}>(null);

function AuthProvider({ children }: { children: JSX.Element }) {
  const [authState, setAuthState] = useState({
    user: null,
    pending: true,
    isSignedIn: false,
  });

  useEffect(() => {
    const authListener = auth.onAuthStateChanged((user: any) => {
      setAuthState({ user, pending: false, isSignedIn: !!user });
    });

    return () => authListener();
  }, []);

  const login = () => {
    signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ state: authState, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const auth = useContext(AuthContext)!;

  return auth;
}

export { AuthContext, AuthProvider, useAuth };
