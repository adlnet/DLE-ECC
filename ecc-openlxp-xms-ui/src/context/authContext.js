'use strict';

import { axiosInstance } from '../config/axiosInstance';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { host } from '../config/endpoints';
import { useRouter } from 'next/router';
import { useSessionStorage } from '../hooks/useStorage';

export const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [error, setError] = useState(null);
  const [user, setSession, removeSession] = useSessionStorage('user', null);
  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn()
  }, []);

  // Register user
  const register = (userData) => {
    setError(null);
    setSession(userData);
  };
 
  const login = (userData) => {
    setError(null);
    setSession(userData);
  };

  // Logout user
  const logout = async () => {
    axiosInstance
      .post(`${host}api/auth/logout`)
      .then((res) => removeSession())
      .catch()
    removeSession();
    router.push("/");
  };

  // // Check if user is logged in
  const checkUserLoggedIn = async () => {
    axiosInstance
      .get(`${host}api/auth/validate`)
      .then((res) => {
        setSession(res.data);
        console.log("success");
    })
    .catch((err) => {
        console.log(
          "There was an error verifying if user is logged in successfully"
        );
        removeSession();
        logout();
    });
  };
  const logindetails = useMemo(() => ({ user, error, register, login, logout }),[]);
  return (
    <AuthContext.Provider value={logindetails}>
      {children}
    </AuthContext.Provider>
  );
}
