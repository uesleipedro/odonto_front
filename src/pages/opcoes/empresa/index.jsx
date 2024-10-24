import React, { useState, useEffect } from "react"
import Image from "next/image"
import api from "../../../utils/Api"
import Swal from "sweetalert2"
import { useAuth } from "../../../auth/useAuth"
import LoadingOverlay from "../../../components/LoadingOverlay"
import { maskCPF_CNPJ, maskPhone } from "../../../utils/mask"
import noImage from "/public/notfoundimage.png"

const Empresa = () => {
    const { user } = useAuth()
    const [empresa, setEmpresa] = useState()
    const [image, setImage] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const id_empresa = user?.user?.foundUser?.id_empresa

    useEffect(() => {
        getEmpresa()
        getLogo()
    }, [id_empresa])

    const getEmpresa = async () => {
        setIsLoading(true)
        await api.get(`empresa/${id_empresa}`)
            .then((res) => {
                setEmpresa(res.data)
            }).catch((e) => {
            })
        setIsLoading(false)
    }

    const getLogo = () => {
        api.get(`/uploads/image/${id_empresa}`).then(res => {
            setImage(`http://localhost:3333/uploads/image/${id_empresa}`)
        }).catch((e) => {
            setImage(noImage)
        })
    }

    const cleanInput = (input) => input?.replace(/\D/g, '')

    const cleanData = async (dataArray) => {
        if (dataArray === null) return

        return await dataArray?.map(item => ({
            ...item,
            cnpj_cpf: cleanInput(item.cnpj_cpf),
            telefone: cleanInput(item.telefone),
            celular: cleanInput(item.celular)
        }))
    }

    const updateField = e => {
        const fieldName = e.target.name
        setEmpresa(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))

        console.log("empresa", empresa)
    }

    const updateEmpresa = async () => {

        let dadosTratados = await cleanData([empresa])

        await api.put(`empresa`, dadosTratados[0])
            .then(async function (response) {
                if (response.status !== 201) {
                    Swal.fire("Problema ao salvar os dados!")
                    return
                }

                try {
                    let re = await uploadImage()
                    console.log("resq image", re)
                    Swal.fire("Salvo com sucesso!")
                } catch (error) {
                    Swal.fire("Problema ao salvar a imagem!")
                }
            })
            .catch(e => {
                console.error(e.error)
            })

        await getEmpresa()
    }

    const uploadImage = async () => {
        if (!empresa.image)
            return

        const formData = new FormData()
        formData.append('image', empresa.image)
        formData.append('id_empresa', id_empresa)

        await api.post(`uploads/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                if (response.status !== 201)
                    Swal.fire("Problema ao salvar imagem")

                return response
            })
            .catch(e => {
                console.error(e.error)
            })
    }

    const handleChangeImage = (e) => {
        if (!URL?.createObjectURL(e?.target?.files[0]))
            return

        setImage(URL?.createObjectURL(e?.target?.files[0]))
        updateField({
            target: {
                name: "image",
                value: e?.target?.files[0]
            }
        })
    }

    return (
        <div className="m-5 p-5 rounded-lg shadow-lg">
            <LoadingOverlay isLoading={isLoading} />
            <p className="text-gray-600 font-bold">Dados da Clínica</p>
            <hr />
            <div className="relative pt-2 flex justify-end w-full h-full">
                <input
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleChangeImage} />
                <Image
                    src={image}
                    alt="Logomarca"
                    width={200}
                    height={200}
                    className="mr-4 basis-1/5"
                />

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="">
                    <label className="text-gray-600 ">Razão social</label>
                    <input
                        type="text"
                        id="razao_social"
                        name="razao_social"
                        value={empresa?.razao_social}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>

                <div>
                    <label className="text-gray-600 ">Nome Fantasia</label>
                    <input
                        type="text"
                        id="nome_fantasia"
                        name="nome_fantasia"
                        value={empresa?.nome_fantasia}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>

                <div>
                    <label className="text-gray-600 ">CNPJ/CPF</label>
                    <input
                        type="text"
                        id="cnpj_cpf"
                        name="cnpj_cpf"
                        value={maskCPF_CNPJ(empresa?.cnpj_cpf)}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>
            </div>

            <p className="text-gray-600 font-bold mt-5">Informações da Clínica</p>
            <hr />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                <div>
                    <label className="text-gray-600 ">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={empresa?.email}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>

                <div>
                    <label className="text-gray-600 ">Telefone Fixo</label>
                    <input
                        type="text"
                        id="telefone"
                        name="telefone"
                        value={maskPhone(empresa?.telefone)}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>

                <div>
                    <label className="text-gray-600 ">Telefone Móvel</label>
                    <input
                        type="text"
                        id="celular"
                        name="celular"
                        value={maskPhone(empresa?.celular)}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>
            </div>

            <p className="text-gray-600 font-bold mt-5">Localização</p>
            <hr />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                <div>
                    <label className="text-gray-600 ">CEP</label>
                    <input
                        type="text"
                        id="cep"
                        name="cep"
                        value={empresa?.cep}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>

                <div>
                    <label className="text-gray-600 ">Logradouro</label>
                    <input
                        type="text"
                        id="logradouro"
                        name="logradouro"
                        value={empresa?.logradouro}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>

                <div>
                    <label className="text-gray-600 ">Número</label>
                    <input
                        type="text"
                        id="numero"
                        name="numero"
                        value={empresa?.numero}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>

                <div>
                    <label className="text-gray-600 ">Bairro</label>
                    <input
                        type="text"
                        id="bairro"
                        name="bairro"
                        value={empresa?.bairro}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>

                <div>
                    <label className="text-gray-600 ">Cidade</label>
                    <input
                        type="text"
                        id="cidade"
                        name="cidade"
                        value={empresa?.cidade}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>


                <div>
                    <label className="text-gray-600 ">UF</label>
                    <input
                        type="text"
                        id="uf"
                        name="uf"
                        value={empresa?.uf}
                        onChange={updateField}
                        className="form-input rounded-lg text-gray-500 w-full placeholder-gray-300" />
                </div>
            </div>

            <hr />
            <div className="flex justify-end gap-3">
                <button
                    onClick={updateEmpresa}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mt-5">
                    Salvar
                </button>
            </div>

        </div>
    )
}

export default Empresa
