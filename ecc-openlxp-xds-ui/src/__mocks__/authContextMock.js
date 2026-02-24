'use strict';

import { createContext, useContext } from "react";
export const AuthContext = createContext()
export const AuthContextWrapper = ({children}) => {
    const login = jest.fn()
    const register = jest.fn()
    return(<AuthContext.Provider value={{login, register}}>{children}</AuthContext.Provider>)
}
