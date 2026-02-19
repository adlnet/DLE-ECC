import { createContext, useMemo } from "react";
export const AuthContext = createContext()
export const AuthContextWrapper = ({children}) => {
    const login = jest.fn()
    const register = jest.fn()
    const logindetails = useMemo(() => ({ login, register }),[]);
    return(
        <AuthContext.Provider value={logindetails}>
            {children}
        </AuthContext.Provider>)
}
