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

const ListaPagamento = ({ id_paciente }) => {

    const [pagamento, setPagamento] = useState([])
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
            const { Datepicker, Input, initTE, Modal, Ripple, Dropdown } = await import("tw-elements");
            initTE({ Datepicker, Input, Modal, Ripple, Dropdown });
        };
        init();
    }, [])


    useEffect(() => {
        const getPagamentoList = async () => {
            await api.get(`pagamento/paciente/${id_paciente}`)
                .then(response => {
                    setPagamento([...pagamento, ...response.data])
                })
                .catch(function (error) {
                    console.error(error);
                })
        }
        getPagamentoList()
    }, []);

    const toCurrency = (num) => {
        return ('R$ ' + num
            .toString()
            .replace('.', ','))

    }


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
                                            <th scope="col" className="px-6 py-3">Id</th>
                                            <th scope="col" className="px-6 py-3 ">Vencimento</th>
                                            <th scope="col" className="px-6 py-3">Parcela</th>
                                            <th scope="col" className="px-6 py-3">Valor</th>
                                            <th scope="col" className="px-6 py-3">Recebimento</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                            <th scope="col" className="px-6 py-3">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {pagamento.map((data) => (
                                            <tr key={data.id_pagamento}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.id_pagamento}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{moment(data.data_primeiro_vencimento).format('DD/MM/YYYY')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.quantidade_parcelas}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{toCurrency(data.valor_total)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">-</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.status}</td>
                                                <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">

                                                    <div class="relative" data-te-dropdown-ref>
                                                        <button
                                                            class="flex items-center whitespace-nowrap rounded bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#fbfbfb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.3),0_4px_18px_0_rgba(251,251,251,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.3),0_4px_18px_0_rgba(251,251,251,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.3),0_4px_18px_0_rgba(251,251,251,0.2)] motion-reduce:transition-none"
                                                            type="button"
                                                            id="dropdownMenuButton9"
                                                            data-te-dropdown-toggle-ref
                                                            aria-expanded="false"
                                                            data-te-ripple-init>
                                                            Light
                                                            <span class="ml-2 w-2">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                    class="h-5 w-5">
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                                        clip-rule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        </button>
                                                        <ul
                                                            class="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
                                                            aria-labelledby="dropdownMenuButton9"
                                                            data-te-dropdown-menu-ref>
                                                            <li>
                                                                <a
                                                                    class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                                                    href="#"
                                                                    data-te-dropdown-item-ref
                                                                >Action</a
                                                                >
                                                            </li>
                                                            <li>
                                                                <a
                                                                    class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                                                    href="#"
                                                                    data-te-dropdown-item-ref
                                                                >Another action</a
                                                                >
                                                            </li>
                                                            <li>
                                                                <a
                                                                    class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                                                    href="#"
                                                                    data-te-dropdown-item-ref
                                                                >Something else here</a
                                                                >
                                                            </li>
                                                        </ul>
                                                    </div>
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