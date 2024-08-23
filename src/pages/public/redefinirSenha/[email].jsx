import React, { useState } from "react"
import { useRouter } from 'next/router'
import Head from 'next/head'
import Swal from "sweetalert2"
import api from "../../../utils/Api"
import Toast from "../../../components/Toast"

const redefinirSenha = () => {
    const [passwd, setPasswd] = useState("")
    const [passwd2, setPasswd2] = useState("")
    const [showToast, setShowToast] = useState(false)
    const [token, setToken] = useState()
    const [isValidToken, setIsValidToken] = useState(false)
    const router = useRouter()
    const { email } = router.query

    const redefinirSenha = async () => {
        if (!isValidToken) {
            Swal.fire("Verifique o token")
            return
        }

        if (passwd !== passwd2) {
            Swal.fire("As senhas não estão iguais!")
            return
        }

        await api.put(`user/redefinirSenha`, {
            email,
            senha: passwd
        })
            .then(async (data) => {
                if (data.status == 201) {
                    await Swal.fire("Senha redefinida com Sucesso! \nRealize o login!")
                    router.push("/login")
                }


            }).catch((err) => {
                console.error(err.message)
                Swal.fire(String(err))
            })
    }

    const verificarToken = async () => {
        try {
            await api.post('user/checkToken', {
                email: email,
                token: token
            }).then((response) => {
                if (response.status == 200)
                    setIsValidToken(true)
            })
        } catch (error) {
            if (error.response.status == 401)
                Swal.fire("Token incorreto")
            else
                Swal.fire("Desculpe, ocorreu um erro!")
            return false
        }
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
                    <h1 className="text-2xl font-bold mb-6 text-white text-center">Redefinição de Senha</h1>
                    <h3 className="text-1  mb-6 text-white text-center">Verifique o token no email: {email}</h3>
                    <div>
                        {!isValidToken && <>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-white">Token</label>
                                <input
                                    type="text"
                                    id="token"
                                    onChange={(e) => setToken(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                            </div>
                            <div className="pb-10">
                                <button
                                    type="button"
                                    className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    onClick={verificarToken}
                                >Verificar Token
                                </button>
                            </div>
                        </>}
                        {isValidToken && <>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-white">Senha</label>
                                <input
                                    type="password"
                                    id="password"
                                    disabled={!isValidToken}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    onChange={() => setPasswd(event.target.value)} />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-white">Repita a Senha</label>
                                <input
                                    type="password"
                                    id="password2"
                                    disabled={!isValidToken}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    onChange={() => setPasswd2(event.target.value)} />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={!isValidToken}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    onClick={() => redefinirSenha()}
                                >Redefinir
                                </button>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
            <Toast
                message="Senha redefinida com sucesso!"
                show={showToast}
                onClose={() => setShowToast(false)}
            />
            <style jsx>{`
          .wave-bg {
            background: url('/wave.svg');
            background-size: cover;
          }
        `}</style>
        </>
    )
}

export default redefinirSenha
