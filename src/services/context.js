import { createContext, useState } from "react";
import { getUser,setUser as updateUser } from "./storage";


export const initialUser = {
    isAuth: false,
    roles: [],
    organisation: null,
    organisations: [],
    name: null,
    token: null,
}

export const AppContext = createContext({
    user:initialUser,
    onUserChange: (data) => {}
})

export const AppContextProvider = ({children}) => {
    const usrLocal = getUser() || initialUser //recuperation de l'utilisateur dans localStorage
    const [usr, setUser] = useState(usrLocal)
    const handleAuthChange = (c) => {
        console.log("context call")
        console.log(c)
        setUser(c)
        updateUser(c);
    }

    const contextValue = {
        user: usr,
        onUserChange:handleAuthChange
    }

    return(
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}