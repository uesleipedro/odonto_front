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
    const [modal, setModal] = useState(false)
    const [dataPagamento, setDataPagamento] = useState(new Date())
    const [dadosPagamento, setDadosPagamento] = useState({ "status": "finalizado" })

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

    const finalizarPagamento = () => {
        api.put('pagamento/finalizar', dadosPagamento)
            .then(function (response) {
                if (response.status === 201) {
                    alert("Salvo com sucesso")
                }
            })
            .catch(e => {
                alert(e)
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

                                                    <button
                                                        onClick={() => {
                                                            setModal(true)
                                                            setDadosPagamento(existingValues => ({
                                                                ...existingValues,
                                                                ["id_pagamento"]: data.id_pagamento,
                                                            }))
                                                        }}

                                                        type="button"
                                                        className="inline-block rounded bg-neutral-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-600 shadow-light-3 transition duration-150 ease-in-out hover:bg-neutral-200 hover:shadow-light-2 focus:bg-neutral-200 focus:shadow-light-2 focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-light-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">
                                                        Finalizar pagamento
                                                    </button>

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
            {
                geraOrcamento &&
                <GeraOrcamento />
            }

            {
                modal &&
                <div
                    data-te-modal-init
                    className="fixed left-0 top-0 z-[1055] block h-full w-full overflow-y-auto overflow-x-hidden outline-none bg-black/[.8]"
                    id="exampleModalVarying"
                    tabindex="-1"
                    aria-labelledby="exampleModalVaryingLabel"
                >
                    <div
                        data-te-modal-dialog-ref
                        className=" pointer-events-none relative w-auto opacity-100 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:my-7 min-[576px]:max-w-[500px]">
                        <div
                            className=" block min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
                            <div
                                className="bg-purple-600 flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                <h5
                                    className="text-white text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                                    id="exampleModalVaryingLabel">
                                    Realizar pagamento
                                </h5>
                                <button
                                    type="button"
                                    className="text-white box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                    data-te-modal-dismiss
                                    aria-label="Close"
                                    onClick={() => setModal(false)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        className="h-6 w-6">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="relative flex-auto p-4" data-te-modal-body-ref>
                                <form>

                                    <div className="mb-3 flex flex-row text-bold gap-2">
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Data do pagamento</h3>
                                        <div className="flex flex-row items-center mb-4 gap-5">

                                            < div className="flex items-center gap-1 " >
                                                <input
                                                    name="data"
                                                    id="data"
                                                    type="date"
                                                    value={dadosPagamento.data_pagamento}
                                                    onChange={(e) =>
                                                        setDadosPagamento(existingValues => ({
                                                            ...existingValues,
                                                            ["data_pagamento"]: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full h-full rounded" />
                                                <label for="data" className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300"></label>
                                            </div>

                                        </div>
                                    </div>

                                </form>
                            </div>
                            <div
                                className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">

                                <button
                                    type="button"
                                    className="inline-block rounded bg-purple-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                                    data-te-modal-dismiss
                                    data-te-ripple-init
                                    data-te-ripple-color="light"
                                    onClick={() => { setModal(false) }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="ml-1 inline-block rounded bg-purple-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                    data-te-ripple-init
                                    data-te-ripple-color="light"
                                    onClick={() => { finalizarPagamento() }}
                                >
                                    Salvar Pagamento
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            }

            <BasicModal
                title="Excluir Paciente"
                body="Deseja realmente excluir esse paciente?"
                doIt={(event) => handleDeletePaciente()}

            />
        </div >
    )
}

export default ListaPagamento