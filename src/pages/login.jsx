import React, { useState } from "react"
import { useAuth } from "../auth/useAuth"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import Head from 'next/head'

const login = () => {
    const [usuario, setUsuario] = useState("")
    const [passwd, setPasswd] = useState("")
    const router = new useRouter()
    const { login } = useAuth()

    const access = async () => {
        const authorized = await login({ usuario, passwd })

        if (!authorized) {
            alert(`Erro na autenticação`)
            return
        }
        router.push("/")
    }

    return (
        <>
            <Head>
                <title>Login</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
            </Head>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 wave-bg"></div>
                <div className="relative z-10 p-8 bg-purple-800 bg-opacity-25 backdrop-blur-sm rounded-lg shadow-lg max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-6 text-white text-center">Login</h1>
                    <div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-white">Usuário</label>
                            <input
                                type="email"
                                id="username"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                onChange={() => setUsuario(event.target.value)} />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-white">Senha</label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                onChange={() => setPasswd(event.target.value)}
                                onKeyUp={(e) => {
                                    if (e.key === "Enter")
                                        access()
                                }} />
                        </div>
                        <div className="flex items-center justify-center mb-4">
                            <div className="flex items-center">
                                <input type="checkbox" id="remember_me" className="h-4 w-4 text-grey-700 focus:ring-purple-500 border-gray-300 rounded" />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-white">Lembrar login</label>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                onClick={() => access()}
                            >Login
                            </button>
                        </div>
                        <div className="text-sm flex items-center justify-center pt-5 mb-4">
                            <a href="#" className="inline-block align-baseline font-bold text-sm text-white hover:text-white">Esqueceu sua senha?</a>
                        </div>
                        <div className="flex items-center justify-center">
                            <p className="text-sm flex text-white items-center justify-center mb-4">
                                <Link className="inline-block align-baseline font-bold text-sm text-white hover:text-white" href="cadastroUsuario">
                                    Crie sua conta
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
          .wave-bg {
            background: url('/wave.svg');
            background-size: cover;
          }
        `}</style>
        </>
    )
}

export default login
