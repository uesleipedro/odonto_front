import React, { useState } from "react"
// import UseAuth from "../auth/useAuth"
import { useAuth } from "../auth/useAuth"
import { useRouter } from 'next/navigation'
import Link from "next/link"

const login = () => {
    const [usuario, setUsuario] = useState("")
    const [passwd, setPasswd] = useState("")
    const router = new useRouter()
    const { user, login, logout } = useAuth()

    const access = async () => {
        const authorized = await login({ usuario, passwd })

        if (!authorized) {
            alert(`Erro na autenticação`)
            return
        }
        //  console.log("user>> ", JSON.parse(user).token)
        router.push("/")
    }

    return (
        <div className="w-full h-screen justify-items-center items-center flex">
            <div className="w-1/2 items-center justify-center flex ">
                <form className="w-2/3 h-full">
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
            <div className="h-full w-1/2 p-20">
                <div className=" h-full w-2/3 bg-contain bg-no-repeat bg-center bg-[url('../a.webp')]"></div>
            </div>
        </div>
    )
}

export default login