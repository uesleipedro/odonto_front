import React, { useContext, useState } from "react"
import { FaMoneyBillAlt, FaTrashAlt } from "react-icons/fa"
import { IoEyeSharp } from "react-icons/io5"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import api from "../../utils/Api"
import { FichaClinicaContext } from "../../context/FichaClinicaContext"
import moment from "moment";
import GeraOrcamento from "./geraOrcamento"
import Pagamento from "./pagamento"
import { formatarMoedaBRL } from "../../utils/mask"
import LoadingOverlay from '../../components/LoadingOverlay'
import Toast from '../../components/Toast'

const ListaOrcamento = ({ id_paciente, id_empresa }) => {
    const [selectedOrcamento, setSelectedOrcamento] = useState(0)
    const [screen, setScreen] = useState("listaOrcamento")
    const [isLoading, setIsLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const { orcamento, getOrcamentoList, getProcedimentoList, loading } = useContext(FichaClinicaContext)

    const changeScreen = (value) => {
        setScreen(value)
        getOrcamentoList()
    }

    const statusColor = {
        "finalizado": "text-success",
        "Pendente pagamento": "text-warning",
        "Cancelado": "text-danger",
    }


    const handleDeleteOrcamento = async (id_orcamento, id_paciente) => {
        await api.delete(`orcamento/${id_orcamento}`)
            .then(async response => {
                await estornaProcedimento(id_orcamento)
                await deletePagamento(id_orcamento)
                await deleteProcedimentoOrcamentoByOrcamento(id_orcamento)

                if (response.status === 204)
                    return
            })
            .catch(error => {
                console.error(error);
            })
        setIsLoading(true)
        await getOrcamentoList()
        await getProcedimentoList()
        setIsLoading(false)
    }

    const deleteProcedimentoOrcamentoByOrcamento = async (id_orcamento) => {
        await api.delete(`procedimento_orcamento/by_orcamento/${id_orcamento}/${id_empresa}`)
            .catch(error => {
                console.error(error)
            })
    }

    const deletePagamento = async (id_orcamento) => {
        return await api.delete(`pagamento/${id_orcamento}`)
            .then(async response => {
                return response.id_pagamento
            })
    }

    const deleteContasReceber = async (id_pagamento) => {
        await api.delete(`contas_receber/${id_pagamento}`)
    }

    const estornaProcedimento = async (id_orcamento) => {
        await api.put(`procedimento/estorno/${id_orcamento}`)
    }

    const toogleOverlay = () => {
        setIsLoading(!isLoading)
    }

    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (id_paciente, id_orcamento) => {
        MySwal.fire({
            title: 'Deseja realmente excluir?',
            showDenyButton: true,
            confirmButtonText: 'Excluir',
            confirmButtonColor: '#EF4444',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteOrcamento(id_orcamento, id_paciente)
                Swal.fire('Excluído!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
    }

    return (
        <div className="m-5 p-5  rounded-lg shadow-lg">
            <div className="mb-5 flex flex-row flex-wrap w-full justify-between items-center">
                {screen !== "pagamento" &&
                    <button
                        onClick={() => setScreen("geraOrcamento")}
                        className="bg-success hover:bg-success-600 rounded-lg p-2 text-white font-bold">
                        Novo Orçamento
                    </button>
                }
            </div>
            {screen === "listaOrcamento" &&
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
                                            <th scope="col" className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {loading ? <p>Loading...</p> : orcamento?.map((data, index) => (
                                            <tr key={data.cpf}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{moment(data.date).format('DD/MM/YYYY')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.nome_profissional}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{formatarMoedaBRL(data?.preco)}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${statusColor[data.status]}`}>{data.status}</td>
                                                <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">

                                                    <a href={`/fichaClinica/view/orcamentoView/${data.id_orcamento}`} target="_blank" className="text-purple-800 hover:text-purple-900">
                                                        <IoEyeSharp />
                                                    </a>
                                                    <a className="text-danger hover:text-danger-600" href="#"
                                                        onClick={() => showSwalWithLink(data.id_paciente, data.id_orcamento)}
                                                    >
                                                        <FaTrashAlt />
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-purple-900 font-bold cursor-pointer">
                                                    <a
                                                        className="pointer"
                                                        onClick={() => {
                                                            setSelectedOrcamento(index)
                                                            setScreen("pagamento")
                                                        }}
                                                    >
                                                        {data.status === 'finalizado'
                                                            ? <></>
                                                            : <><FaMoneyBillAlt /> Ir para pagamento</>}
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

                    <LoadingOverlay isLoading={isLoading} />
                </div>
            }
            {screen === "geraOrcamento" &&
                <GeraOrcamento
                    id_paciente={id_paciente}
                    toogleOverlay={toogleOverlay}
                    changeScreen={changeScreen}
                    setShowToast={() => setShowToast(true)} />
            }

            {screen === "pagamento" &&
                <Pagamento
                    orcamento={orcamento[selectedOrcamento]}
                    changeScreen={changeScreen}
                    setShowToast={() => setShowToast(true)}
                    id_paciente={id_paciente}
                    id_empresa={id_empresa} />
            }
        </div >
    )
}

export default ListaOrcamento
