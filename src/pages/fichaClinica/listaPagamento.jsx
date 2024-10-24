import { useEffect, useState, useContext, useMemo } from "react"
import { FaCheck, FaEye, FaBarcode } from "react-icons/fa"
import { HiArrowNarrowRight } from "react-icons/hi"
import { ImCancelCircle } from "react-icons/im"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import moment from "moment"
import { useRouter } from 'next/router'
import api from "../../utils/Api"
import GeraOrcamento from "./geraOrcamento"
import { FichaClinicaContext } from '../../context/FichaClinicaContext'
import Toast from '../../components/Toast'
import LoadingOverlay from "../../components/LoadingOverlay"

const ListaPagamento = ({ dadosPaciente }) => {

  const { pagamento, loading, getPagamentoList } = useContext(FichaClinicaContext)
  const [geraOrcamento, setGeraOrcamento] = useState(false)
  const [modal, setModal] = useState(false)
  const [dadosPagamento, setDadosPagamento] = useState({ "status": "Pago" })
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedPayment, setExpandedPayment] = useState(null)
  const router = useRouter()
  const status = {
    Pago: "text-success",
    Pendente: "text-warning",
    Cancelado: "text-danger",
  }
  const [expandedRows, setExpandedRows] = useState([]);

  //Necessário para funcionamento das abas
  useEffect(() => {
    const init = async () => {
      const { Datepicker, Input, initTE, Modal, Ripple, TEToast, Tab } = await import("tw-elements")
      initTE({ Datepicker, Input, Modal, Ripple, TEToast, Tab })
    };
    init()

  }, [])

  const handleRowClick = (id) => {
    const isExpanded = expandedRows.includes(id);
    if (isExpanded) {
      setExpandedRows(expandedRows.filter(rowId => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const isRowExpanded = (id) => expandedRows.includes(id);

  const toCurrency = (num) => {
    return ('R$ ' + num
      ?.toString()
      ?.replace('.', ','))
  }

  const pagamentoAgrupado = useMemo(() => {
    if (!pagamento)
      return

    const agrupados = pagamento?.reduce((acc, current) => {
      const { id_pagamento, nr_parcela, valor, data_vencimento } = current

      if (!acc[id_pagamento]) {
        acc[id_pagamento] = {
          id_pagamento,
          parcelas: [],
          total_pagamento: 0
        }
      }

      acc[id_pagamento].parcelas.push(current)

      acc[id_pagamento].total_pagamento += valor

      return acc
    }, {})

    return Object.values(agrupados)
  }, [pagamento])

  const toggleParcelas = (id) => {
    setExpandedPayment(expandedPayment === id ? null : id)
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
    await getPagamentoList()
    setShowToast(true)
  }

  const handleRedirectRecibo = async (data) => {
    if (!data.dt_recebimento) {
      Swal.fire("O recibo só pode ser gerado após o pagamento!")
      return
    }
    sessionStorage.removeItem("viewReciboPagamento")
    sessionStorage.setItem('viewReciboPagamento', JSON.stringify({ ...data, ...dadosPaciente }))
    window.open('/fichaClinica/pagamento/view/ReciboPagamento', '_blank')
  }

  const estornarPagamento = async (id_pagamento, nr_parcela) => {
    await api.put(`contas_receber/estornar`,
      {
        'id_pagamento': id_pagamento,
        'nr_parcela': nr_parcela
      }).then()
    getPagamentoList()
  }

  const handleGeraBoleto = async (e, total_pagamento) => {
    e.qtd_parcelas > 1
      ? handleGeraCarnet(e, total_pagamento)
      : handleGeraBoletoUnico(e)

    await getPagamentoList()
  }

  const handleGeraBoletoUnico = async (e) => {
    setIsLoading(true)
    if (!dadosPaciente.nome || !dadosPaciente.cpf) {
      Swal.fire("O nome e CPF do paciente devem estar cadastrado para emissão de boletos")
      return
    }

    await api.post(`/efi/createBoleto`, {
      dadosPagamento: e,
      dadosBoleto: {
        items: [
          {
            name: "Tratamento clínico",
            value: Number(String(e.valor.toFixed(2)).replace('.', '')),
            amount: 1
          }
        ],
        payment: {
          banking_billet: {
            expire_at: moment(e.dt_vencimento).format("YYYY-MM-DD"),
            customer: {
              name: dadosPaciente.nome,
              cpf: dadosPaciente.cpf
            }
          }
        },
        metadata: {
          custom_id: String(e?.id_pagamento)
        }
      }
    })
      .then((res) => {
        window.open(res.data?.data?.billet_link, '_blank')
      })
    setIsLoading(false)
  }

  const handleGeraCarnet = async (e, total_pagamento) => {
    setIsLoading(true)
    if (!dadosPaciente.nome || !dadosPaciente.cpf) {
      Swal.fire("O nome e CPF do paciente devem estar cadastrado para emissão de boletos")
      return
    }

    await api.post(`/efi/createCarnet`, {
      dadosPagamento: e,
      dadosCarnet: {
        items: [
          {
            name: "Tratamento clínico",
            value: Number(String(total_pagamento.toFixed(2)).replace('.', '')),
            amount: 1
          }
        ],
        expire_at: moment(e.dt_vencimento).format("YYYY-MM-DD"),
        customer: {
          name: dadosPaciente.nome,
          cpf: dadosPaciente.cpf
        },
        metadata: {
          custom_id: String(e?.id_pagamento)
        },
        configurations: {
          fine: 200,
          interest: 33
        },
        message: "Tratamento clínico",
        repeats: e.qtd_parcelas,
        split_items: true
      }
    })
      .then((res) => {
        window.open(res.data?.data?.billet_link, '_blank')
      })
    setIsLoading(false)
  }

  const MySwal = withReactContent(Swal)
  const showSwalWithLink = (id_pagamento, id_parcela) => {
    MySwal.fire({
      title: 'Deseja realmente estornar?',
      showDenyButton: true,
      confirmButtonText: 'Estornar',
      confirmButtonColor: '#EF4444',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        estornarPagamento(id_pagamento, id_parcela)
        Swal.fire('Estornado!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Nenhuma alteração foi realizada', '', 'info')
      }
    }).catch((error) => {
      console.error(error)
    })
  }

  return (
    <div className="m-5 p-5  rounded-lg shadow-lg">
      <LoadingOverlay isLoading={isLoading} />
      <div className="mb-5 flex flex-row flex-wrap w-full justify-between items-center">

      </div>
      {!geraOrcamento &&
        < div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg shadow overflow-hidden">
                <table className="min-w-full transition-all duration-300 ease-in-out">
                  <thead className="bg-purple-800 dark:bg-purple-700 w-full">
                    <tr className="text-white text-left font-medium cursor-pointer">
                      <th scope="col" className="px-6 py-3">Parcela</th>
                      <th scope="col" className="px-6 py-3 ">Vencimento</th>
                      <th scope="col" className="px-6 py-3">Valor</th>
                      <th scope="col" className="px-6 py-3">Recebimento</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {pagamentoAgrupado?.map((row, index) => (
                      <>
                        <tr key={row.id} className="cursor-pointer" onClick={() => handleRowClick(row.id_pagamento)}>
                          <td className="flex flex-row gap-4 pl-4 py-4  text-sm text-gray-500 font-bold cursor-pointer">
                            Pagamento nº: {row.id_pagamento} - Valor Total: {toCurrency(row.total_pagamento)}
                            <p
                              onClick={() => {
                                if (
                                  row.parcelas[0]?.link_carnet
                                  || row.parcelas[0]?.link_boleto
                                ) {
                                  window.open(
                                    row.parcelas[0]?.link_carnet ?? row.parcelas[0]?.link_boleto,
                                    '_blank')
                                  return
                                }

                                handleGeraBoleto(row.parcelas[0], row.total_pagamento)
                              }}
                            >
                              <FaBarcode />
                            </p>
                          </td>
                        </tr>

                        {isRowExpanded(row.id_pagamento) && (
                          <>
                            {row?.parcelas.map((parcela, index) => (
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{parcela.nr_parcela}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{moment(parcela.dt_vencimento).format('DD/MM/YYYY')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{toCurrency(parcela.valor)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{parcela.dt_recebimento && moment(parcela.dt_recebimento).format('DD/MM/YYYY')}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold ${status[parcela.status]}`}>{parcela.status}</td>
                                <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">

                                  <a className="text-purple-800 hover:text-purple-900" title="Confirmar pagamento" href="#"
                                    onClick={() => {
                                      setModal(true)
                                      setDadosPagamento(existingValues => ({
                                        ...existingValues,
                                        ["id_pagamento"]: parcela.id_pagamento,
                                        ["nr_parcela"]: parcela.nr_parcela
                                      }))
                                    }}
                                  >
                                    <FaCheck />
                                  </a>
                                  <a
                                    className="text-purple-800 hover:text-purple-900 cursor-pointer"
                                    onClick={() => handleRedirectRecibo(parcela)}>
                                    <FaEye />
                                  </a>

                                  <a className="text-purple-800 hover:text-purple-900" title="Cancelar Pagamento" rel="noopener noreferrer" href="#"
                                    onClick={() => {
                                      showSwalWithLink(parcela.id_pagamento, parcela.nr_parcela)
                                    }}
                                  >
                                    <ImCancelCircle />
                                  </a>
                                  {parcela.forma_pagamento === 5 &&
                                    <a className="text-purple-800 hover:text-purple-900" title="Gerar Boleto" rel="noopener noreferrer" href="#"
                                      onClick={() => {
                                        if (parcela.link_boleto) {
                                          window.open(parcela.link_boleto, '_blank')
                                          return
                                        }

                                        handleGeraBoleto(parcela, row.total_pagamento)
                                      }}
                                    >
                                      <FaBarcode />
                                    </a>
                                  }
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </>
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

        </div>}

      {geraOrcamento && <GeraOrcamento />}

      {modal &&
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
        </div >}
    </div >
  )
}

export default ListaPagamento
