import React, { useState } from "react"
import { useAuth } from "../auth/useAuth"
import { useRouter } from 'next/navigation'
import Link from "next/link"

const login = () => {
    const [usuario, setUsuario] = useState("")
    const [passwd, setPasswd] = useState("")
    const router = new useRouter()
    const { login } = useAuth()

    const access = () => {
        const authorized = login({ usuario, passwd })

        if (!authorized) {
            alert(`Erro na autenticação`)
            return
        }
        router.push("/")
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-screen">
            <div className="items-center justify-center flex h-screen">
                <form className="w-full md:m-18 m-10">
                    <div className="flex mb-10">
                        <p className="inline-block align-baseline font-bold text-3xl text-purple-500">
                            Odonto
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <p className="inline-block align-baseline text-lg text-grey-100">
                            Olá novamente!
                        </p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Usuário
                        </label>
                        <input onChange={() => setUsuario(event.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Senha
                        </label>
                        <input onChange={() => setPasswd(event.target.value)} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                        <p className="text-red-500 text-xs italic">Please choose a password.</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={() => access()} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                            Entrar
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <a className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800" href="#">
                            Esqueceu a senha?
                        </a>
                    </div>
                    <div className="flex items-center justify-center">
                        <p className="inline-block align-baseline font-bold text-sm text-gray-500">
                            Ainda não tem cadastro?
                            <Link className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800" href="cadastroUsuario">
                                Crie sua conta
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
            <div className="hidden md:block ">
                <div className=" h-full m-10 bg-contain bg-no-repeat bg-center bg-[url('../a.webp')]"></div>
            </div>
        </div >
    )
}

export default login
