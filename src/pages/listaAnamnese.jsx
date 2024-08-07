import React, { use, useEffect, useState, useMemo } from "react"
import { FaTooth, FaBookMedical, FaTrashAlt } from "react-icons/fa"
import { BiSolidFileDoc } from "react-icons/bi"
import { MdAttachMoney } from "react-icons/md"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import api from "../utils/Api"
import Cookies from "js-cookie"
import { useAuth } from "../auth/useAuth"

// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoiRGFydGhWYWRlciIsImlhdCI6MTY5NjU5ODI2MCwiZXhwIjoxNjk2NzcxMDYwfQ.GakWs7gLYzD1iAnIIS8p9Wu26i1aVi7PZAehATyzEuQ"
const token = Cookies.get("jwt")
// const token = JSON.parse(user).token

const ListaAnamnese = () => {

    const [anamnese, setAnamnese] = useState([])
    const [searchVal, setSearchVal] = useState('')
    const [idToDelete, setIdToDelete] = useState(0)
    const router = useRouter()

    const { user } = useAuth()

    // const authHeader = () => {
    //     //const token = getTokenFromCookies();
    //     return {
    //         headers: {
    //             Authorization: "Bearer " + Cookies.get("jwt"),
    //         },
    //     };
    // };

    useEffect(() => {
        const init = async () => {
            const { Datepicker, Input, initTE, Modal, Ripple } = await import("tw-elements");
            initTE({ Datepicker, Input, Modal, Ripple });
        };
        init();
    }, [])

    // const handleDeleteAnamnese = async (id_anamnese) => {
    //     await api.delete(`anamnese/${id_anamnese}`)
    //         .then(response => {
    //             if (response.status === 204)
    //                 return
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         })
    //     router.refresh()
    // }

    const filteredData = useMemo(() => {
        if (searchVal.trim() === '') {
            return anamnese
        }
        return anamnese.filter(dataItem => dataItem.nome.toLowerCase().includes(searchVal.toLocaleLowerCase()))
    }, [anamnese, searchVal])


    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (id_anamnese) => {
        MySwal.fire({
            title: 'Deseja realmente excluir?',
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Excluir',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteanamnese(id_anamnese)
                Swal.fire('Excluído!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
    }


    return (
        <div className="m-5 p-5  rounded-lg shadow-lg">
            <div className="mb-5 flex flex-row flex-wrap w-full justify-between items-center">
                <input type="text" onChange={e => setSearchVal(e.target.value)} className="form-input mr-4 rounded-lg text-gray-600" placeholder="Buscar anamnese" />
                <Link href="/cadastroanamneses">
                    <button className="bg-purple-800 hover:bg-purple-500 rounded-lg p-2 text-white font-bold">
                        Nova Anamnese
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
                                        <th scope="col" className="px-6 py-3 ">Prontuário</th>
                                        <th scope="col" className="px-6 py-3">anamnese desde</th>
                                        <th scope="col" className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredData.map((data) => (
                                        <tr key={data.cpf}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.nome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.rg}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.cpf}</td>
                                            <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                                <a className="text-purple-800 hover:text-purple-900" href="#">
                                                    <FaTooth />
                                                </a>
                                                <a className="text-purple-800 hover:text-purple-900" href="#">
                                                    <FaBookMedical />
                                                </a>
                                                <a className="text-purple-800 hover:text-purple-900" href="#">
                                                    <BiSolidFileDoc />
                                                </a>
                                                <a className="text-purple-800 hover:text-purple-900" href="#">
                                                    <MdAttachMoney />
                                                </a>
                                                <a className="text-purple-800 hover:text-purple-900" href="#"
                                                    onClick={() => showSwalWithLink(data.id_anamnese)}
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
        </div>
    )
}

export default ListaAnamnese