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

                <div className="w-full md:w-1/2 pt-3">
                    <input
                        class="me-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-black/25 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-switch-2 after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ms-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-switch-1 checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-switch-3 focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ms-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-switch-3 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-white/25 dark:after:bg-surface-dark dark:checked:bg-primary dark:checked:after:bg-primary"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault" />
                    <label
                        class="inline-block ps-[0.15rem] hover:cursor-pointer"
                        for="flexSwitchCheckDefault"
                    >Sandbox</label
                    >
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
