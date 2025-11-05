import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useMemo } from "react";

const useAxios = () => {
  const { logout } = useAuth();

  const API = useMemo(
    () =>
      axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true,
      }),
    []
  );

  useEffect(() => {
    const interceptor = API.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => API.interceptors.response.eject(interceptor);
  }, [API, logout]);

  return API;
};

export default useAxios;
