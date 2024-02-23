import React, { use, useEffect, useState, useMemo } from "react"
import { FaTooth, FaBookMedical, FaTrashAlt } from "react-icons/fa"
import { IoEyeSharp } from "react-icons/io5";
import Link from "next/link"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import api from "../utils/Api"
import BasicModal from "../components/BasicModal"
import Cookies from "js-cookie"
import { useAuth } from "../auth/useAuth"
import moment from "moment";
import GeraOrcamento from "./geraOrcamento";

// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoiRGFydGhWYWRlciIsImlhdCI6MTY5NjU5ODI2MCwiZXhwIjoxNjk2NzcxMDYwfQ.GakWs7gLYzD1iAnIIS8p9Wu26i1aVi7PZAehATyzEuQ"
const token = Cookies.get("jwt")
// const token = JSON.parse(user).token

const ListaPagamento = () => {

    const [orcamento, setOrcamento] = useState([])
    const [searchVal, setSearchVal] = useState('')
    const [idToDelete, setIdToDelete] = useState(0)
    const [geraOrcamento, setGeraOrcamento] = useState(false)
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


    useEffect(() => {
        const getOrcamentoList = async () => {
            await api.get('orcamento')
                .then(response => {
                    setOrcamento([...orcamento, ...response.data])
                })
                .catch(function (error) {
                    console.error(error);
                })
        }
        getOrcamentoList()
        console.log('orcamento', orcamento)
    }, []);


    const handleDeleteOrcamenot = async (id_orcamento) => {
        await api.delete(`paciente/${id_orcamento}`)
            .then(response => {
                if (response.status === 204)
                    return
            })
            .catch(error => {
                console.error(error);
            })
        router.refresh()
    }


    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (id_orcamento) => {
        MySwal.fire({
            title: 'Deseja realmente excluir?',
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Excluir',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteOrcamento(id_orcamento)
                Swal.fire('Excluído!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
    }


    return (
        <div className="m-5 p-5  rounded-lg shadow-lg">
            <div className="mb-5 flex flex-row flex-wrap w-full justify-between items-center">
                {/* <Link href="#tabs-procedimento"> */}
                <button
                    onClick={() => setGeraOrcamento(true)}
                    className="bg-purple-800 hover:bg-purple-500 rounded-lg p-2 text-white font-bold">
                    Novo Orçamento
                </button>
                {/* </Link> */}
            </div>
            {!geraOrcamento &&
                < div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="border rounded-lg shadow overflow-hidden">
                                <table className="min-w-full">
                                    <thead className="bg-purple-800 dark:bg-purple-700">
                                        <tr className="text-white text-left font-medium">
                                            <th scope="col" className="px-6 py-3">Data</th>
                                            <th scope="col" className="px-6 py-3 ">Adicionado por</th>
                                            <th scope="col" className="px-6 py-3">Valor</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                            <th scope="col" className="px-6 py-3">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {orcamento.map((data) => (
                                            <tr key={data.cpf}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{moment(data.date).format('DD/MM/YYYY')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.id_profissional}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.preco}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.status}</td>
                                                <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">

                                                    <Link href="/fichaClinica" className="text-purple-800 hover:text-purple-900">
                                                        <IoEyeSharp />
                                                    </Link>
                                                    <a className="text-purple-800 hover:text-purple-900" href="#"
                                                        onClick={() => showSwalWithLink(data.id_paciente)}
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
            }
            {geraOrcamento &&
                <GeraOrcamento />
            }

            <BasicModal
                title="Excluir Paciente"
                body="Deseja realmente excluir esse paciente?"
                doIt={(event) => handleDeletePaciente(idToDelete)}

            />
        </div >
    )
}

export default ListaPagamento