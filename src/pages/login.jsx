import React, { useState } from "react"
import UseAuth from "../auth/useAuth"
import { useRouter } from 'next/navigation'

const login = () => {
    const [user, setUser] = useState("")
    const [passwd, setPasswd] = useState("")
    const router = new useRouter()

    const access = async () => {

        const authorized = await UseAuth.login({ user, passwd })
        if (!authorized) {
            alert(`Erro na autenticação - ${authorized}`)
            return
        }

        router.push("/")
    }

    return (
        <div className="w-full  bg-red-800 ">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Usuário
                    </label>
                    <input onChange={() => setUser(event.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Senha
                    </label>
                    <input onChange={() => setPasswd(event.target.value)} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    <p className="text-red-500 text-xs italic">Please choose a password.</p>
                </div>
                <div className="flex items-center justify-between">
                    <button onClick={() => access()} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                        Entrar
                    </button>
                    <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Esqueceu a senha?
                    </a>
                </div>
            </form>
        </div>
    )
}

export default login