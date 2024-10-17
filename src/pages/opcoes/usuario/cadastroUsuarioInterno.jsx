import React, { useEffect, useState } from "react"
import Link from "next/link"
import api from "../../../utils/Api"
import Swal from "sweetalert2"
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../auth/useAuth'
import withReactContent from 'sweetalert2-react-content'

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

    const toogleUserStatus = async (e) => {
        console.log(e.target.checked)

        await api.put(`/user/status`, {
            id_empresa,
            id_user: userData?.id_user,
            status: !userData?.status
        })
            .then(function (response) {
                if (response.status === 201) {
                    sessionStorage.removeItem('cadastroUsuario')
                    router.push('/opcoes/usuario/listaUsuarios')
                }

            })
            .catch(e => {
                alert(e)
                console.error(e.error)
            })
    }

    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (e) => {
        MySwal.fire({
            title: 'Deseja realmente alterar o status??',
            showDenyButton: true,
            confirmButtonText: 'Alterar',
            confirmButtonColor: '#EF4444',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                toogleUserStatus(e)
                Swal.fire('Alterado com sucesso!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
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

                <div className="flex flex-row gap-2 items-center w-full mt-10">
                    <label
                        class="inline-block ps-[0.15rem] hover:cursor-pointer"
                        for="acessa_financeiro_paciente"
                    >Usuário ativo?</label>
                    <input
                        class="me-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-black/25 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-switch-2 after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-purple-800 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ms-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-purple-800 checked:after:shadow-switch-1 checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-switch-3 focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-purple-800 checked:focus:bg-purple-800 checked:focus:before:ms-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-switch-3 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-gray-300 dark:after:bg-surface-dark dark:checked:bg-purple-800 dark:checked:after:bg-purple-800"
                        type="checkbox"
                        role="switch"
                        id="acessa_financeiro_paciente"
                        name="acessa_financeiro_paciente"
                        checked={userData?.status}
                        onChange={showSwalWithLink} />
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
