import React, { useState, useEffect } from "react"
import Link from "next/link"
import api from "../../../../utils/Api"
import Swal from "sweetalert2"
import { useRouter } from 'next/router'
import { useAuth } from '../../../../auth/useAuth'
import LoadingOverlay from "../../../../components/LoadingOverlay"

const Credenciais = ({ data }) => {
    const router = useRouter()
    const { user } = useAuth()
    const [credentialData, setCredentialData] = useState(data)
    const [isLoading, setIsLoading] = useState(false)
    const id_empresa = user?.user?.foundUser?.id_empresa

    useEffect(() => {
        getCredential()
    }, [])

    const getCredential = async () => {
        setIsLoading(true)
        await api.get(`efiCredential/getCredential?id_empresa=${id_empresa}`)
            .then((res) => {
                setCredentialData(res.data[0])
            })
        setIsLoading(false)
    }

    const updateField = e => {
        const fieldName = e.target.name
        setCredentialData(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
    }

    const updateCredential = async () => {

        await api.put(`/efiCredential/updateCredential`, credentialData)
            .then(function (response) {
                if (response.status === 201)
                    Swal.fire("Salvo com sucesso!")
            })
            .catch(e => {
                alert(e)
                console.error(e.error)
            })
        router.push('/opcoes/boleto/credenciais')
    }

    const saveCredential = async () => {

        const credentialToSend = credentialData
        credentialToSend.id_empresa = id_empresa

        await api.post('/efiCredential/saveCredential', credentialToSend)
            .then(function (response) {
                if (response.status === 201)
                    Swal.fire("Salvo com sucesso!")
            })
            .catch(e => {
                alert(e)
                console.error(e.error)
            })
        router.push('/opcoes/boleto/credenciais')
    }

    const sendUser = async () => {
        setIsLoading(true)
        credentialData?.id_credential
            ? await updateCredential()
            : await saveCredential()
        setIsLoading(false)
    }

    return (
        <div className="m-5 p-5 rounded-lg shadow-lg">
            <LoadingOverlay isLoading={isLoading} />
            <p className="text-gray-600 font-bold">Credenciais do Banco EFÍ</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">

                <div className="w-full md:w-3/5 pr-2 pt-3">
                    <label className="text-gray-700 ">Client ID</label>
                    <input
                        type="text"
                        id="client_id"
                        name="client_id"
                        value={credentialData?.client_id}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300" />
                </div>

                <div className="w-full md:w-1/2 pr-2 pt-3">
                    <label className="text-gray-700 ">Client Secret</label>
                    <input
                        type="text"
                        id="client_secret"
                        name="client_secret"
                        value={credentialData?.client_secret}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="" />
                </div>

                <div className="w-full md:w-1/2 pt-3">
                    <label className="text-gray-700 ">Certificado</label>
                    <input
                        type="file"
                        id="certificate_path"
                        name="certificate_path"
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="" />
                </div>

            </div>

            <hr />
            <div className="flex justify-end gap-3">
                <button
                    onClick={sendUser}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full mt-5">
                    Salvar
                </button>
            </div>

        </div>
    )
}

export default Credenciais
