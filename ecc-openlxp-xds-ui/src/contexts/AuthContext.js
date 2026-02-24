'use strict';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { axiosInstance } from '@/config/axiosConfig';
import { backendHost } from '../config/endpoints';
import { useSessionStorage } from '../hooks/useStorage';

export const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [error, setError] = useState(null);
  const [user, setSession, removeSession] = useSessionStorage('user', null);

  useEffect(() => { checkUserLoggedIn() }, []);

  // Register user
  const register = (userData) => {
    setError(null);
    setSession(userData);
  };

  // Login user
  const login = (userData) => {
    setError(null);
    setSession(userData);
  };

  // Logout user
  const logout = async () => {
    axiosInstance
      .post(`${backendHost}/api/auth/logout`)
      .then((res) => removeSession())
      .catch((err) => {
        console.log("Logout failed.");
      })
      .finally(() => {
        removeSession();
      });
  };

  // // Check if user is logged in
  const checkUserLoggedIn = async () => {
    if (globalThis.window != 'undefined') {
      axiosInstance
        .get(`${backendHost}/api/auth/validate`)
        .then((res) => {
          setSession(res.data);
        })
        .catch((err) => {
          removeSession();
          logout();
        });
    }
  };
  const logindetails = useMemo(() => ({ user, error, register, login, logout }),[]);
  return (
    <AuthContext.Provider value={logindetails}>
      {children}
    </AuthContext.Provider>
  );
}
