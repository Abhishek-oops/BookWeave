import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("bookweave_token"),
  );

  function saveToken(nextToken) {
    localStorage.setItem("bookweave_token", nextToken);
    setToken(nextToken);
  }

  function logout() {
    localStorage.removeItem("bookweave_token");
    setToken(null);
  }

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), saveToken, logout }),
    [token],
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
