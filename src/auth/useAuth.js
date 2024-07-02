import React, { createContext, useState, useContext, useEffect } from 'react'
import api from "../utils/Api"
import Cookies from 'js-cookie'

const authContextDefaultValues = {
    user: null,
    login: () => { },
    logout: () => { },
}

const AuthContext = createContext(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        async function loadUserFromCookies() {
            const data = Cookies.get('user')
            // const token = JSON.parse(data)?.token || ''
            const token = 'asdf' 
            if (data) {
                // 
                api.defaults.headers.Authorization = `Bearer ${token}`
                // const { data: user } = await api.get('user/me')
                if (data) setUser(JSON.parse(data))
            }
            // setUser(data)
        }
        loadUserFromCookies()
    }, [])


    const login = async ({ usuario, passwd }) => {
        if (typeof usuario !== "string" || typeof passwd !== "string") {
            alert(`preencha os campos corretamente`)
            return
        }

        const response = await api.post('user/login', { email: usuario, senha: passwd })
            .then(async (response) => {
                if (response.status === 201) {
                    // api.defaults.headers.Authorization = `Bearer ${token}`
                    
                    api.defaults.headers.Authorization = `Bearer ${JSON.stringify(response.data).token}`
                    Cookies.set("user", JSON.stringify(response.data))
                    setUser(response.data)
                    return true
                } else if (response.status === 500) {
                    Cookies.remove("user")
                    setUser(null)
                    return false
                }

            })
            .catch((error) => {
                console.error(error.message)
                return false
            })
        return response
    };

    const logout = () => {
        setUser(null)
        Cookies.remove("user")
    };

    const value = {
        user,
        login,
        logout,
    };

    return (
        <>
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        </>
    );
}