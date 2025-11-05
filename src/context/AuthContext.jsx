import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (username, password) => {
    const res = await api.post('/users/authenticate', { username, password });
    setIsLoading(false);
    if(res.data.success && res.data.data){
        setUser(res.data.data);
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
