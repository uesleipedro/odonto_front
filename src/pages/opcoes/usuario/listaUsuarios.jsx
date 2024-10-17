import React, { useEffect, useState, useMemo } from "react"
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import Link from "next/link"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import api from "../../../utils/Api"
import { useAuth } from "../../../auth/useAuth"
import { usePaciente } from "../../../context/PacienteContext"

const ListaUsuarios = () => {

    const [users, setUsers] = useState([])
    const [searchVal, setSearchVal] = useState('')
    const { user } = useAuth()
    const { saveIdPaciente, saveIdEmpresa } = usePaciente()
    const id_empresa = user?.user?.foundUser.id_empresa
    const checkStatus = {
        true: "Ativo",
        false: "Inativo"
    }

    useEffect(() => {
        getUsuarios()
        sessionStorage.removeItem('cadastroUsuario')
    }, [user])

    const getUsuarios = async () => {
        await api.get(`user/empresa2/${id_empresa}`)
            .then(response => {
                console.log('response', response.data)
                setUsers([...response.data])
            })
            .catch(function (error) {
                console.error(error)
            })
    }

    const handleDeleteUser = async (id_user) => {
        return await api.delete(`user/`,
            {
                data: {
                    id_user: id_user,
                    id_empresa: id_empresa
                }
            })
            .then(response => {
                if (response.status === 204)
                    console.log(response)
                return { success: true, message: "Excluído com sucesso" }
            })
            .catch(error => {
                return { success: false, message: error?.response?.data?.message }
            })
    }

    const filteredData = useMemo(() => {
        if (searchVal.trim() === '') {
            return users
        }
        return users.filter(dataItem => dataItem.nome.toLowerCase().includes(searchVal.toLocaleLowerCase()))
    }, [users, searchVal])


    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (id_user) => {
        MySwal.fire({
            title: 'Deseja realmente excluir?',
            showDenyButton: true,
            confirmButtonText: 'Excluir',
            confirmButtonColor: '#EF4444',
            denyButtonText: `Cancelar`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await handleDeleteUser(id_user)
                getUsuarios()
                if (res.success) {
                    return Swal.fire(res.message, '', 'success')
                }

                return Swal.fire(res.message, '', 'info')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }

        })
    }

    return (

        <div className="m-5 p-5  rounded-lg shadow-lg">
            <div className="mb-5 flex flex-row flex-wrap w-full justify-between items-center">
                <input type="text" onChange={e => setSearchVal(e.target.value)} className="form-input mr-4 rounded-lg text-gray-600" placeholder="Buscar usuário" />
                <Link href="cadastroUsuarioInterno">
                    <button className="bg-success hover:bg-success-700 rounded-lg p-2 text-white font-bold">
                        Novo Usuário
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
                                        <th scope="col" className="px-6 py-3">Nome</th>
                                        <th scope="col" className="px-6 py-3 ">Email</th>
                                        <th scope="col" className="px-6 py-3">Nível de Acesso</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredData.map((data) => (
                                        <tr key={data.nome}>
                                            <td onClick={() => {
                                                saveIdPaciente(data.id_paciente)
                                                saveIdEmpresa(data.id_empresa)
                                            }}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.nome}</td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data?.level_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{checkStatus[data?.status]}</td>
                                            <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                                <Link
                                                    href={{ pathname: "cadastroUsuarioInterno" }}
                                                    onClick={() => {
                                                        sessionStorage.removeItem("cadastroUsuario")
                                                        sessionStorage.setItem('cadastroUsuario', JSON.stringify(data))
                                                    }}
                                                    className="text-warning hover:text-warning-700"
                                                >
                                                    <FaPencilAlt />
                                                </Link>
                                                <a className="text-danger hover:text-danger-700" href="#"
                                                    onClick={() => showSwalWithLink(data.id_user)}
                                                >
                                                    <FaTrashAlt />
                                                </a>
                                                <a className="text-danger hover:text-danger-700" href="#">

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

export default ListaUsuarios
