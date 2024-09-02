import React, { useEffect, useState } from "react"
import Link from "next/link"
import api from "../../utils/Api"
import Swal from "sweetalert2"
import { useAuth } from '../../auth/useAuth'
import Select from 'react-select'

const CadastroNivelAcesso = () => {

    const { user } = useAuth()
    const [nivelAcesso, setNivelAcesso] = useState({ id_empresa: user?.user?.foundUser?.id_empresa })
    const [selectedOptions, setSelectedOptions] = useState([]);
    const id_empresa = user?.user?.foundUser?.id_empresa
    const [screens, setScreens] = useState()
    const [screensToSave, setScreensToSave] = useState()

    useEffect(() => {
        const data = sessionStorage.getItem('cadastroNivelAcesso')
        data && setNivelAcesso(JSON.parse(data))
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
        api.get(`screens/${id_empresa}`)
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
        console.log("Selecte", selected)
    }

    const updateName = e => {
        const fieldName = e.target.name
        setNivelAcesso(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
    }

    const sendNivelAcesso = async () => {

        await api.post('/access_level', nivelAcesso)
            .then(async function (response) {
                try {
                    const res = await saveAccessLevelScreen(response?.data?.access_level_id)

                    if (response.status === 201)
                        Swal.fire("Salvo com sucesso!")

                } catch (error) {
                    Swal.fire("Erro ao cadastrar o nível de acesso")
                    console.log(error)
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

                <div className="max-w-md mx-auto mt-10">
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
            </div>

            <hr />
            <div className="flex justify-end gap-3">
                <button
                    onClick={sendNivelAcesso}
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

export default CadastroNivelAcesso
