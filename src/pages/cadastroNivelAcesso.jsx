import React, { useEffect, useState } from "react"
import Link from "next/link"
import api from "../utils/Api"
import { maskPhone } from "../utils/mask"
import Swal from "sweetalert2"
import { useAuth } from '../auth/useAuth'

const CadastroNivelAcesso = () => {

    const { user } = useAuth()
    const [nivelAcesso, setNivelAcesso] = useState({id_empresa: user?.user?.foundUser?.id_empresa || 13})

    const updateName = e => {
        const fieldName = e.target.name
        setNivelAcesso(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
    }

    const sendNivelAcesso = async () => {
        console.log("userToSend", nivelAcesso)
        
        await api.post('/access_level', nivelAcesso)
            .then(function (response) {
                if (response.status === 201)
                    Swal.fire("Salvo com sucesso!")
            })
            .catch(e => {
                alert(e)
                console.error(e.error)
            })
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
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex: Atendente da recepção" />
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
