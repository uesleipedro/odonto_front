import React, { useEffect, useState } from "react"
import Link from "next/link"
import api from "../utils/Api"
import { maskPhone } from "../utils/mask"
import Swal from "sweetalert2"
import { useRouter } from 'next/router'
import { useAuth } from '../auth/useAuth'

const CadastroUsuario = () => {
    const router = useRouter()
    const { user } = useAuth()
    const [userData, setUserData] = useState()
    const [accessLevels, setAccessLevels] = useState([])
    const [idEmpresa, setIdEmpresa] = useState(user?.user?.foundUser?.id_empresa)

    useEffect(() => {
        getAccessLevels()
    }, [idEmpresa])

    const getAccessLevels = async () => {
        let id_empresa = await user?.user?.foundUser?.id_empresa
        api.get(`/access_level/13`)
            .then((response) => {
                console.log('response', response)
                setAccessLevels([...response.data])
            })
    }

    const updateName = e => {
        const fieldName = e.target.name
        setUserData(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
    }

    const sendPacienteData = async () => {
        let userToSend = userData
        userToSend.cnpj_cpf = userData.cnpj_cpf?.replace(/\D/g, '')
        userToSend.telefone_movel = userData.telefone_movel?.replace(/\D/g, '')
        userToSend.access_levels = Number(userData.access_levels)
        userToSend.id_empresa = 13
        console.log("userToSend", userToSend)
        await api.post('/user', userToSend)
            .then(function (response) {
                if (response.status === 201)
                    Swal.fire("Salvo com sucesso!")
            })
            .catch(e => {
                alert(e)
                console.error(e.error)
            })

        router.push('/listaUsuarios')
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
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex.: Marcelo Algusto" />
                </div>

                <div className="w-full md:w-1/2 pr-2 pt-3">
                    <label className="text-gray-700 ">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex: antonio@gmail.com" />
                </div>

                <div className="w-full md:w-2/5 pr-2 pt-3">
                    <label className="text-gray-700 ">Celular</label>
                    <input
                        type="text"
                        id="telefone_movel"
                        name="telefone_movel"
                        value={maskPhone(userData?.telefone_movel)}
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex: (61) 99999-9999" />
                </div>

                <div className="w-full md:w-1/5 pt-3">
                    <label className="text-gray-700 ">Nível de Acesso</label>
                    <select
                        id="access_levels"
                        name="access_levels"
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full"
                        placeholder="">
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
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="**********" />
                </div>

            </div>

            <hr />
            <div className="flex justify-end gap-3">
                <button
                    onClick={sendPacienteData}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full mt-5">
                    Salvar
                </button>

                <Link href="/">
                    <button
                        className="bg-white hover:bg-gray-200 text-purple-800 border font-bold py-2 px-4 rounded-full mt-5">
                        Cancelar
                    </button>
                </Link>
            </div>

        </div>
    )
}

export default CadastroUsuario
