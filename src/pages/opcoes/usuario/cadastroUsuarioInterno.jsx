import React, { useEffect, useState } from "react"
import Link from "next/link"
import api from "../../../utils/Api"
import Swal from "sweetalert2"
import { useRouter } from 'next/router'
import { useAuth } from '../../../auth/useAuth'

const CadastroUsuario = () => {
    const router = useRouter()
    const { user } = useAuth()
    const [userData, setUserData] = useState()
    const [accessLevels, setAccessLevels] = useState([])
    const id_empresa = user?.user?.foundUser?.id_empresa

    useEffect(() => {
        const data = sessionStorage.getItem('cadastroUsuario')
        setUserData(JSON.parse(data))
    }, [])

    useEffect(() => {
        if (!id_empresa) return

        getAccessLevels()

    }, [user, id_empresa])

    const getAccessLevels = async () => {
        api.get(`access_level/${id_empresa}`)
            .then((response) => {
                setAccessLevels([...response.data])
            })
    }

    const updateField = e => {
        const fieldName = e.target.name
        setUserData(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
        console.log(userData)
    }

    const updateUser = async () => {
        if (
            !userData?.access_levels ||
            !userData?.email ||
            !userData?.nome ||
            !userData?.senha
        ) {
            Swal.fire("Preencha todos os campos!")
            return
        }

        const userToSend = new URLSearchParams(userData).toString()

        await api.put(`/user?${userToSend}`)
            .then(function (response) {
                if (response.status === 201)
                    Swal.fire("Atualizado com sucesso!")
            })
            .catch(e => {
                alert(e)
                console.error(e.error)
            })
        sessionStorage.removeItem('cadastroUsuario')
        router.push('/opcoes/usuario/listaUsuarios')
    }

    const saveUser = async () => {
        if (
            !userData?.access_levels ||
            !userData?.email ||
            !userData?.nome ||
            !userData?.senha
        ) {
            Swal.fire("Preencha todos os campos!")
            return
        }

        const userToSend = userData
        userToSend.id_empresa = id_empresa

        await api.post('/user', userToSend)
            .then(function (response) {
                if (response.status === 201)
                    Swal.fire("Salvo com sucesso!")
            })
            .catch(e => {
                if (
                    e?.response?.data?.status === 400 ||
                    e?.response?.status === 409
                )
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: e?.response?.data?.error
                    })
            })
        sessionStorage.removeItem('cadastroUsuario')
        router.push('/opcoes/usuario/listaUsuarios')
    }

    const sendUser = async () => {
        userData?.id_user
            ? updateUser()
            : saveUser()
    }

    return (
        <div className="m-5 p-5 rounded-lg shadow-lg">

            <p className="text-gray-600 font-bold">Dados do Usuário</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">

                <div className="w-full md:w-3/5 pr-2 pt-3">
                    <label className="text-gray-700 ">Nome completo</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={userData?.nome}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex.: Marcelo Algusto" />
                </div>

                <div className="w-full md:w-1/2 pr-2 pt-3">
                    <label className="text-gray-700 ">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData?.email}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex: antonio@gmail.com" />
                </div>

                <div className="w-full md:w-1/5 pt-3">
                    <label className="text-gray-700 ">Nível de Acesso</label>
                    <select
                        id="access_levels"
                        name="access_levels"
                        onChange={updateField}
                        value={userData?.access_levels}
                        className="form-input rounded-lg text-gray-600 w-full"
                        placeholder="">
                        <option value={0}></option>
                        {accessLevels.map(level =>
                            <option value={Number(level.access_level_id)}>{level?.level_name}</option>
                        )}
                    </select>
                </div>

                <div className="w-full md:w-1/2 pt-3">
                    <label className="text-gray-700 ">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="**********" />
                </div>

            </div>

            <hr />
            <div className="flex justify-end gap-3">
                <button
                    onClick={sendUser}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full mt-5">
                    Salvar
                </button>

                <Link href="/opcoes/usuario/listaUsuarios">
                    <button
                        className="bg-white hover:bg-gray-200 text-purple-800 border font-bold py-2 px-4 rounded-full mt-5">
                        Voltar
                    </button>
                </Link>
            </div>

        </div>
    )
}

export default CadastroUsuario
