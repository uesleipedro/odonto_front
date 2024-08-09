import React, { useState } from "react"
import { useAuth } from "../auth/useAuth"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import Head from 'next/head'
import Swal from "sweetalert2"
import api from "../utils/Api"
import Toast from "../components/Toast"
import withReactContent from 'sweetalert2-react-content'

const login = () => {
    const [usuario, setUsuario] = useState("")
    const [passwd, setPasswd] = useState("")
    const [showToast, setShowToast] = useState(false)
    const [solicitado, setSolicitado] = useState(false)
    const router = new useRouter()
    const { login } = useAuth()

    const access = async () => {
        if (usuario === "" || passwd === "") {
            Swal.fire("Preencha os campos corretamente!")
            return
        }

        const authorized = await login({ usuario, passwd })

        if (!authorized) {
            Swal.fire("Erro na autenticação!")
            return
        }
        router.push("/")
    }

    const recuperarSenha = async () => {
        if (usuario == "") {
            Swal.fire("Preencha o campo usuário!")
            return
        }

        await api.post(`user/recuperarSenha`, { email: usuario })
            .then((data) => {
                data.status == 200 && setShowToast(true)
            }).catch((err) => {
                Swal.fire("Verifique o nome de usuário e tente novamente!")
            })
        //await Swal.fire("Verifique seu email para resertar a senha!")
        router.push(`/redefinirSenha/${usuario}`)
    }

    const inputToken = () => {
        Swal.fire({
            title: "Insira o Token enviado para o seu email!",
            input: "text",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: false,
            confirmButtonText: "Verificar",
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: async (token) => {
                try {
                    return await api.post('user/checkToken', {
                        email: usuario,
                        token
                    }).then((response) => {
                        console.log("response", response)
                        return response
                    })
                } catch (error) {
                    return false
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed && result.value.status == 200)
                router.push(`/redefinirSenha/${usuario}`)
            else
                Swal.fire("Token incorreto")
            // console.log(">>>", result.value.status)
            // if (result.isConfirmed) {
            // }
        });
    }

    const MySwal = withReactContent(Swal)
    const enviarEmail = () => {
        MySwal.fire({
            title: 'Atenção!',
            text: `Assim que clicar em OK será enviado um token para seu email para que a senha possa ser alterada`,
            showDenyButton: false,
            confirmButtonText: 'OK',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                recuperarSenha()
                //Swal.fire('Alterado!', '', 'success')
            } else if (result.isDenied) {
                updateEvents()
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
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
                            <a
                                href="#"
                                onClick={() => {
                                    solicitado
                                        ? inputToken()
                                        : enviarEmail()
                                }}
                                className="inline-block align-baseline font-bold text-sm text-white hover:text-white"
                            >Esqueceu sua senha?
                            </a>
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
            <Toast
                message="Foram enviadas instruções para redefinição de senha para o seu email!"
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

export default login
