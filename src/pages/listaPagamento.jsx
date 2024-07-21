import { useEffect, useState, useMemo, useContext } from "react"
import { FaCheck, FaTrashAlt, FaEye } from "react-icons/fa"
import { ImCancelCircle } from "react-icons/im"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import moment from "moment"
import api from "../utils/Api"
import GeraOrcamento from "./geraOrcamento"
import { FichaClinicaContext } from '../context/FichaClinicaContext'
import { usePaciente } from '../context/PacienteContext'
import Toast from '../components/Toast'

const ListaPagamento = ({id_paciente}) => {

    const { pagamento, loading, getPagamentoList } = useContext(FichaClinicaContext)
   // const { idPaciente, saveIdPaciente } = usePaciente()
    const [searchVal, setSearchVal] = useState('')
    const [idToDelete, setIdToDelete] = useState(0)
    const [geraOrcamento, setGeraOrcamento] = useState(false)
    const [modal, setModal] = useState(false)
    const [dataPagamento, setDataPagamento] = useState(new Date())
    const [dadosPagamento, setDadosPagamento] = useState({ "status": "Pago" })
    const [showPagamento, setShowPagamento] = useState(false)
    const [showToast, setShowToast] = useState(false)

    const router = useRouter()

    /*useEffect(() => {
        const init = async () => {
            const { Input, initTE, Modal, Ripple } = await import("tw-elements");
            initTE({ Input, Modal, Ripple });
        };
        init()
    }, [])*/
    useEffect(() => {
        const init = async () => {
            const { Datepicker, Input, initTE, Modal, Ripple, TEToast, Tab } = await import("tw-elements");
            initTE({ Datepicker, Input, Modal, Ripple, TEToast, Tab });
        };
        init();
    }, [])

    const toCurrency = (num) => {
        return ('R$ ' + num
            .toString()
            .replace('.', ','))
    }

    const finalizarPagamento = async () => {
        await api.put('contas_receber/finalizar', dadosPagamento)
            .then(function (response) {
                if (response.status === 201) {
                    getPagamentoList()
                    setModal(false)
                }
            })
            .catch(e => {
                alert(e)
            })
        await getPagamentoList(id_paciente)
        setShowToast(true)        
    }

    const estornarPagamento = async (id_pagamento, nr_parcela) => {
        await api.put(`contas_receber/estornar`,
            {
                'id_pagamento': id_pagamento,
                'nr_parcela': nr_parcela
            }).then()
        getPagamentoList(id_paciente)
    }

    const estornarOrcamento = async (id_orcamento) => {
        await api.put(`orcamento/estornar/${id_orcamento}`)
    }

    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (id_pagamento, id_parcela) => {
        MySwal.fire({
            title: 'Deseja realmente estornar?',
            showDenyButton: true,
            confirmButtonText: 'Estornar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                estornarPagamento(id_pagamento, id_parcela)
                Swal.fire('Estornado!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
    }

    return (
        <div className="m-5 p-5  rounded-lg shadow-lg">
            <div className="mb-5 flex flex-row flex-wrap w-full justify-between items-center">

            </div>
            {!geraOrcamento &&
                < div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="border rounded-lg shadow overflow-hidden">
                                <table className="min-w-full">
                                    <thead className="bg-purple-800 dark:bg-purple-700">
                                        <tr className="text-white text-left font-medium">
                                            <th scope="col" className="px-6 py-3">Nº Pagamento</th>
                                            <th scope="col" className="px-6 py-3">Parcela</th>
                                            <th scope="col" className="px-6 py-3 ">Vencimento</th>
                                            <th scope="col" className="px-6 py-3">Valor</th>
                                            <th scope="col" className="px-6 py-3">Recebimento</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                            <th scope="col" className="px-6 py-3">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {loading ? <p>Loadnig...</p> : pagamento?.map((data) => (
                                            <tr key={data.id_pagamento}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.id_pagamento}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.nr_parcela}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{moment(data.dt_vencimento).format('DD/MM/YYYY')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{toCurrency(data.valor)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{moment(data.data_pagamento).format('DD/MM/YYYY')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.status}</td>
                                                <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">

                                                    <a className="text-purple-800 hover:text-purple-900" title="Visualizar" href="#"
                                                        onClick={() => {
                                                            setModal(true)
                                                            setDadosPagamento(existingValues => ({
                                                                ...existingValues,
                                                                ["id_pagamento"]: data.id_pagamento,
                                                                ["nr_parcela"]: data.nr_parcela
                                                            }))
                                                        }}
                                                    >
                                                        <FaCheck />
                                                    </a>
                                                    <a className="text-purple-800 hover:text-purple-900" title="Visualizar" href="#"
                                                        onClick={() => {
                                                            //showPagamento()
                                                            //setA(data)
                                                        }}
                                                    >
                                                        <FaEye />
                                                    </a>
                                                    <a className="text-purple-800 hover:text-purple-900" title="Cancelar Pagamento" href="#"
                                                        onClick={() => {
                                                            showSwalWithLink(data.id_pagamento, data.nr_parcela)
                                                        }}
                                                    >
                                                        <ImCancelCircle />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                  <Toast
                      message="Salvo com sucesso!"
                      show={showToast}
                      onClose={() => setShowToast(false)}
                  />


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
                                                    value={dadosPagamento.dt_recebimento}
                                                    onChange={(e) =>
                                                        setDadosPagamento(existingValues => ({
                                                            ...existingValues,
                                                            ["dt_recebimento"]: e.target.value,
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
        </div >
    )
}

export default ListaPagamento
