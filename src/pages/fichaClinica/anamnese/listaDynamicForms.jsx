import React, { useEffect, useState, useMemo } from "react"
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import api from "../../../utils/Api"
import { useAuth } from "../../../auth/useAuth"

const ListaDynamicForms = () => {

    const [searchVal, setSearchVal] = useState('')
    const [formDy, setForm] = useState()
    const { user } = useAuth()
    const id_empresa = user?.user?.foundUser.id_empresa
    const router = useRouter()

    useEffect(() => {
        getDynamicForm()
    }, [user])

    const getDynamicForm = async () => {
        await api.get(`dynamicForm/formList`, {
            params: {
                id_empresa: 13
            }
        })
            .then(response => {
                console.log("response dynamic", response.data)
                setForm(response.data)
            })
            .catch(e => {
                Swal.fire('Erro ao obter o formulário')
            })
    }

    // const handleDeleteAccessLevel = async (data) => {


    //     await api.delete(`access_level?access_level_id=${data.access_level_id}&id_empresa=${id_empresa}`)
    //         .then(async response => {
    //             console.log('neltro response', response)
    //             if (response?.status === 201) {
    //                 getAccessLevels()
    //                 return
    //             }

    //             if (response.response.status === 400) {
    //                 console.log(response.message)
    //             }

    //             if (response?.data?.status === "sucesso")
    //                 router.refresh()
    //         })
    //         .catch(error => {
    //             if (error?.response?.data?.status)
    //                 Swal.fire(error?.response?.data?.message)
    //             return
    //         })
    // }

    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (data) => {
        MySwal.fire({
            title: 'Deseja realmente excluir?',
            showDenyButton: true,
            confirmButtonText: 'Excluir',
            confirmButtonColor: '#EF4444',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteAccessLevel(data)
                Swal.fire('Excluído!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
    }

    return (
        <div className="m-5 p-5  rounded-lg shadow-lg">
            <div className="mb-5 flex flex-row flex-wrap w-full justify-between items-center">
                <div></div>
                <Link href="formBuilder">
                    <button className="bg-success hover:bg-success-700 rounded-lg p-2 text-white font-bold">
                        Novo Formulário
                    </button>
                </Link>
            </div>

            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="border rounded-lg shadow overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-purple-800 dark:bg-purple-700">
                                    <tr className="text-white text-left font-medium">
                                        <th scope="col" className="px-6 py-3 ">Nome do Formulário</th>
                                        <th scope="col" className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {formDy?.map((data, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.name}</td>
                                            <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                                <a className="text-warning hover:text-warning-700" href={`/fichaClinica/anamnese/formBuilder/${data.id_form}`}
                                                // onClick={() => showSwalWithLink(data)}
                                                >
                                                    <FaPencilAlt />
                                                </a>
                                                <a className="text-danger hover:text-danger-700" href="#"
                                                // onClick={() => showSwalWithLink(data)}
                                                >
                                                    <FaTrashAlt />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ListaDynamicForms
