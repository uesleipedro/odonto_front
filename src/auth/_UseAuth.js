import React, { createContext, useState, useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import Router, { useRouter } from 'next/router'

//api here is an axios instance which has the baseURL set according to the env.
import api from "../utils/Api"


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadUserFromCookies() {
            const token = Cookies.get('token')
            if (token) {
                
                api.defaults.headers.Authorization = `Bearer ${token}`
                const { data: user } = await api.get('user/me')
                if (user) setUser(user);
            }
            setLoading(false)
        }
        loadUserFromCookies()
    }, [])

    const login = async (email, senha) => {
        const { data: token } = await api.post('user/login', { email, senha })
        if (token) {
            
            Cookies.set('token', token, { expires: 60 })
            api.defaults.headers.Authorization = `Bearer ${token.token}`
            const { data: user } = await api.get('users/me')
            setUser(user)
            
        }
    }

    const logout = () => {
        Cookies.remove('token')
        setUser(null)
        delete api.defaults.headers.Authorization
        window.location.pathname = '/login'
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}



export const useAuth = () => useContext(AuthContext)