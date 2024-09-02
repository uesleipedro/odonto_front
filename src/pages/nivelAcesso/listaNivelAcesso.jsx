import React, { use, useEffect, useState, useMemo } from "react"
import { FaPencilAlt, FaBookMedical, FaTrashAlt } from "react-icons/fa"
import { BiSolidFileDoc } from "react-icons/bi"
import { MdAttachMoney } from "react-icons/md"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import api from "../../utils/Api"
import { useAuth } from "../../auth/useAuth"
import { usePaciente } from "../../context/PacienteContext"

const ListaNivelAcesso = () => {

    const [accessLevel, setAccessLevel] = useState([])
    const [searchVal, setSearchVal] = useState('')
    const { user } = useAuth()
    const { saveIdPaciente, saveIdEmpresa } = usePaciente()
    const id_empresa = user?.user?.foundUser.id_empresa
    const router = useRouter()

    useEffect(() => {
        getAccessLevels()
        sessionStorage.removeItem('cadastroAccessLevels')
    }, [user])

    const getAccessLevels = async () => {
        await api.get(`access_level/${id_empresa}`)
            .then(response => {
                setAccessLevel([...accessLevel, ...response.data])
            })
            .catch(function (error) {
                console.error(error);
            })
    }

    const handleDeleteAccessLevel = async (id_user) => {
        await api.delete(`access_level/${id_empresa}`)
            .then(response => {
                if (response.status === 204)
                    return
            })
            .catch(error => {
                console.error(error);
            })
        router.refresh()
    }

    const filteredData = useMemo(() => {
        if (searchVal.trim() === '') {
            return accessLevel
        }
        return accessLevel.filter(dataItem => dataItem.nome.toLowerCase().includes(searchVal.toLocaleLowerCase()))
    }, [accessLevel, searchVal])


    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (id_access_level) => {
        MySwal.fire({
            title: 'Deseja realmente excluir?',
            showDenyButton: true,
            confirmButtonText: 'Excluir',
            confirmButtonColor: '#EF4444',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteAccessLevel(id_access_level)
                Swal.fire('Excluído!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
    }

    return (

        <div className="m-5 p-5  rounded-lg shadow-lg">
            <div className="mb-5 flex flex-row flex-wrap w-full justify-between items-center">
                <input type="text" onChange={e => setSearchVal(e.target.value)} className="form-input mr-4 rounded-lg text-gray-600" placeholder="Buscar nível de acesso" />
                <Link href="/nivelAcesso/cadastroNivelAcesso">
                    <button className="bg-purple-800 hover:bg-purple-500 rounded-lg p-2 text-white font-bold">
                        Novo Nível de Acesso
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
                                        <th scope="col" className="px-6 py-3">ID</th>
                                        <th scope="col" className="px-6 py-3 ">Nome do Nível de Acesso</th>
                                        <th scope="col" className="px-6 py-3">Descrição</th>
                                        <th scope="col" className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredData.map((data) => (
                                        <tr key={data.access_level_id}>
                                            <Link
                                                href={{
                                                    pathname: `/nivelAcesso/cadastro/`,
                                                }}

                                            >
                                                <td onClick={() => {
                                                    saveIdPaciente(data.id_paciente)
                                                    saveIdEmpresa(data.id_empresa)
                                                }}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data?.access_level_id}</td>
                                            </Link>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.level_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data?.description}</td>
                                            <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                                <Link
                                                    href={{ pathname: "/nivelAcesso/cadastroNivelAcesso" }}
                                                    onClick={() => {
                                                        sessionStorage.removeItem("cadastroNivelAcesso")
                                                        sessionStorage.setItem('cadastroNivelAcesso', JSON.stringify(data))
                                                    }}
                                                    className="text-purple-800 hover:text-purple-900"
                                                >
                                                    <FaPencilAlt />
                                                </Link>
                                                <a className="text-purple-800 hover:text-purple-900" href="#"
                                                    onClick={() => showSwalWithLink(data.access_level_id)}
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

export default ListaNivelAcesso
