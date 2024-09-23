import React, { useEffect, useState } from "react"
import Link from "next/link"
import api from "../../../utils/Api"
import Swal from "sweetalert2"
import { useAuth } from '../../../auth/useAuth'
import Select from 'react-select'

const CadastroNivelAcesso = () => {

    const { user } = useAuth()
    const [nivelAcesso, setNivelAcesso] = useState({ id_empresa: user?.user?.foundUser?.id_empresa })
    const [selectedOptions, setSelectedOptions] = useState();
    const id_empresa = user?.user?.foundUser?.id_empresa
    const [screens, setScreens] = useState()

    useEffect(() => {
        const data = sessionStorage.getItem('cadastroNivelAcesso')
        data && setNivelAcesso(JSON.parse(data))
        setSelectedOptions(JSON.parse(data)?.screens)
    }, [])

    useEffect(() => {
        if (!id_empresa) return
        getScreens()

        setNivelAcesso(existingValues => ({
            ...existingValues,
            ["id_empresa"]: user?.user?.foundUser?.id_empresa,
        }))
    }, [user, id_empresa])

    const getScreens = () => {
        api.get(`screens`)
            .then((response) => {
                setScreens([...response.data])
            })
    }

    const saveAccessLevelScreen = async (id_access_level) => {
        const obj = await renameKeys(selectedOptions, id_access_level)

        api.post(`access_level_screen`, {
            screens: obj,
            id_empresa: id_empresa,
            id_access_levels: id_access_level
        }).then((res) => {
            return res
        })
    }

    const handleChange = (selected) => {
        setSelectedOptions(selected)
    }

    const updateName = e => {
        const fieldName = e.target.name

        if (fieldName === "acessa_todas_agendas") {
            setNivelAcesso(existingValues => ({
                ...existingValues,
                [fieldName]: e.target.checked,
            }))
            return
        }

        setNivelAcesso(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
        console.log(nivelAcesso)
    }

    const sendNivelAcesso = async () => {
        nivelAcesso?.access_level_id
            ? updateNivelAcesso()
            : saveNivelAcesso()
    }

    const saveNivelAcesso = async () => {
        await api.post('/access_level', nivelAcesso)
            .then(async function (response) {
                try {
                    const res = await saveAccessLevelScreen(response?.data?.access_level_id)

                    if (response.status === 201)
                        Swal.fire("Salvo com sucesso!")

                } catch (error) {
                    Swal.fire("Erro ao cadastrar o nível de acesso")
                    console.error(error)
                }
            })
            .catch(e => {
                alert(e)
                console.error(e.error)
            })
    }

    const updateNivelAcesso = async () => {

        const nivelAcessoToSend = new URLSearchParams(nivelAcesso).toString()

        await api.put(`/access_level?${nivelAcessoToSend}`)
            .then(async function (response) {
                try {
                    const res = await saveAccessLevelScreen(nivelAcesso?.access_level_id)

                    if (response.status === 201)
                        Swal.fire("Salvo com sucesso!")

                } catch (error) {
                    Swal.fire("Erro ao cadastrar o nível de acesso")
                    console.error(error)
                }
            })
            .catch(e => {
                alert(e)
                console.error(e.error)
            })
    }

    const renameKeys = (screens, id_access_levels) => {
        let newScreen = screens
        newScreen.forEach(function (obj) {
            obj.id_screen = obj.value
            obj.id_access_levels = id_access_levels
            obj.id_empresa = id_empresa
            delete obj.text;
        })

        return newScreen
    }

    return (
        <div className="m-5 p-5 rounded-lg shadow-lg">

            <p className="text-gray-600 font-bold">Dados do Nível de Acesso</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">

                <div className="w-full md:w-3/5 pr-2 pt-3">
                    <label className="text-gray-700 ">Nome do nível de accesso</label>
                    <input
                        type="text"
                        id="level_name"
                        name="level_name"
                        value={nivelAcesso?.level_name}
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex.: Atendente" />
                </div>

                <div className="w-full md:w-1/2 pr-2 pt-3">
                    <label className="text-gray-700 ">Descrição</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={nivelAcesso?.description}
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex: Atendente da recepção" />
                </div>

                <div className="w-full mt-10">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Selecione as telas de acesso
                    </label>
                    <Select
                        isMulti
                        name="screens"
                        options={screens}
                        value={selectedOptions}
                        onChange={handleChange}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>

                <div className="flex flex-row gap-2 items-center w-full mt-10">
                    <label
                        class="inline-block ps-[0.15rem] hover:cursor-pointer"
                        for="acessa_todas_agendas"
                    >Acessa todas as telas?</label>
                    <input
                        class="me-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-black/25 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-switch-2 after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-purple-800 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ms-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-purple-800 checked:after:shadow-switch-1 checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-switch-3 focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-purple-800 checked:focus:bg-purple-800 checked:focus:before:ms-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-switch-3 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-gray-300 dark:after:bg-surface-dark dark:checked:bg-purple-800 dark:checked:after:bg-purple-800"
                        type="checkbox"
                        role="switch"
                        id="acessa_todas_agendas"
                        name="acessa_todas_agendas"
                        checked={nivelAcesso?.acessa_todas_agendas}
                        onChange={updateName} />
                </div>
            </div>

            <hr />
            <div className="flex justify-end gap-3">
                <button
                    onClick={sendNivelAcesso}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full mt-5">
                    Salvar
                </button>

                <Link href="/opcoes/nivelAcesso/listaNivelAcesso">
                    <button
                        className="bg-white hover:bg-gray-200 text-purple-800 border font-bold py-2 px-4 rounded-full mt-5">
                        Voltar
                    </button>
                </Link>
            </div>

        </div >
    )
}

export default CadastroNivelAcesso
