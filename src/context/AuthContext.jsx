import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/users/me");
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data.result);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const login = useCallback(
    async (username, password) => {
      setIsLoading(true);
      try {
        const res = await api.post("/users/authenticate", { username, password });
        if (res.data?.success) {
          await fetchCurrentUser();
        }
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    [api, fetchCurrentUser]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/users/logout");
    } catch { } finally {
      setUser(null);
    }
  }, [api]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
