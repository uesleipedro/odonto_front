import React, { createContext, useState, useContext, useEffect } from 'react'
import api from "../utils/Api"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

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
    const router = useRouter()

    useEffect(() => {
        const loadUserFromCookies = () => {
            const data = Cookies.get('user')
            const token = localStorage.getItem("token")

            if (data && token) {
                api.defaults.headers.Authorization = `Bearer ${token}`
                setUser(JSON.parse(data))
            }
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
                if (response.status === 500) {
                    Cookies.remove("user")
                    localStorage.removeItem("token")
                    setUser(null)
                    return false
                }

                if (response.status === 201) {
                    api.defaults.headers.Authorization = `Bearer ${response.data.token}`
                    localStorage.setItem("token", response.data.token)
                    Cookies.set("user", JSON.stringify(response.data))
                    setUser(response.data)
                    return true
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
        localStorage.removeItem("token")
        router.refresh()
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
