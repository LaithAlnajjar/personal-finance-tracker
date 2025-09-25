import React, { createContext, useContext, useEffect, useState } from "react";
import { type User, type AuthState } from "../types/auth";
import { api, setAuthToken } from "../lib/api";

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser) as User;
        setUser(parsed);
        setToken(storedToken);
        setAuthToken(storedToken);
      } catch (e) {
        console.error("Error parsing stored user", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/login", { email, password });
      console.log(response);
      const data = response.data.data;
      const returnedUser = data.user;
      const returnedToken = data.token;

      setUser(returnedUser);
      setToken(returnedToken);
      localStorage.setItem("user", JSON.stringify(returnedUser));
      localStorage.setItem("token", returnedToken);
      setAuthToken(returnedToken);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response.data.message || "Login failed";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  const value: AuthState = {
    user,
    token,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
