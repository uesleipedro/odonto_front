import React, { useEffect, useState, useContext } from "react"
import Select from "react-select";
import api from "../utils/Api"
import { FichaClinicaContext } from '../context/FichaClinicaContext'
import LoadingOverlay from "../components/LoadingOverlay"
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
//import { ptBR } from 'date-fns/locale'
import ptBR from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'
import { formatarMoedaBRL } from "../utils/mask";

registerLocale('pt-BR', ptBR)
setDefaultLocale('pt-BR')

const Pagamento = ({ orcamento, changeScreen, setShowToast, id_paciente, id_empresa }) => {

    const [formaPagamento, setFormaPagamento] = useState([
        { label: "Dinheiro", value: 1 },
        { label: "Transferência ou PIX", value: 2 },
        { label: "Cartão de crédito", value: 3 },
        { label: "Cartão de débito", value: 4 },
        { label: "outro", value: 5 },
    ])
    const [parcelas, setParcelas] = useState([
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
        { label: 6, value: 6 },
        { label: 7, value: 7 },
        { label: 8, value: 8 },
        { label: 9, value: 9 },
        { label: 10, value: 10 },
        { label: 11, value: 11 },
        { label: 12, value: 12 },
    ])
    const [dados, setDados] = useState({ data_primeiro_vencimento: new Date(), quantidade_parcelas: 1, desconto: 0 })
    const [idPagamento, setIdPagamento] = useState(0)
    const { getPagamentoList, getOrcamentoList, idEmpresa } = useContext(FichaClinicaContext)
    const [loadingOverlay, setLoadingOverlay] = useState(false)
    const [primeiroVencimento, setPrimeiroVencimento] = useState(new (Date))

    useEffect(() => {
        const init = async () => {
            const { Collapse, initTE } =
                await import("tw-elements");
            initTE({
                Collapse,
                initTE,
            });
        }


        init()
    }, [])

    const moneyMask = (value) => {
        value = value?.replace('.', '').replace(',', '').replace(/\D/g, '')

        const options = { minimumFractionDigits: 2 }
        const result = new Intl.NumberFormat('pt-BR', options).format(
            parseFloat(value) / 100
        )

        return 'R$ ' + result
    }

    const toDecimalNumeric = (num) => {
        return Number((num
            ?.toString()
            .replace(',', '.')
            .replace(/\D/g, '') / 100
        ).toFixed(2))
    }

    const updateStatusOrcamento = async (id_orcamento) => {
        await api.put('orcamento/status', {
            id_orcamento: id_orcamento,
            status: 'finalizado'
        }).then((response) => {
        })

        getOrcamentoList(id_paciente)
        return
    }


    const cadastroPagamento = async () => {
        return await api.post('pagamento',
            {
                id_orcamento: orcamento?.id_orcamento,
                tipo_desconto: dados.tipo_desconto,
                valor_desconto: toDecimalNumeric(dados.desconto),
                quantidade_parcelas: dados.quantidade_parcelas,
                data_primeiro_vencimento: dados.data_primeiro_vencimento,
                entrada: toDecimalNumeric(dados.entrada),
                data_pagamento: dados.data_pagamento,
                id_empresa: id_empresa,
                valor_total: toDecimalNumeric(orcamento?.preco),
                status: "Aberto",
                id_paciente: orcamento?.id_paciente,
                valor_total: orcamento?.preco
            }
        )
            .then(async function (response) {
                if (response.status === 201) {
                    updateStatusOrcamento(orcamento?.id_orcamento)
                }
                setIdPagamento(Number(response.data.id_pagamento))
                return Number(response.data.id_pagamento)
            })
            .catch(function (error) {
                console.error(error)
            })

    }

    const geraContasReceber = async (contas) => {
        await api.post('contas_receber',
            {
                id_pagamento: contas.id_pagamento,
                nr_parcela: contas.nr_parcela,
                valor: contas.valor,
                dt_vencimento: contas.dt_vencimento,
                status: "Pendente",
                id_paciente: contas.id_paciente,
                id_empresa: id_empresa
            }
        )
            .then(async function (response) {
                await getPagamentoList(id_paciente)
            })
            .catch(function (error) {
                console.error(error)
            })
    }

    const updateField = e => {
        const fieldName = e.target.name

        setDados(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))

        console.log("updateField: ", dados)
    }

    const changeDate = (date) => {
        setPrimeiroVencimento(date.target.value)
        updateField(date)
    }

    const calculoDesconto = async (total) => {
        console.log('entrou calculo desconto', total, dados.desconto)
        return dados.tipo_desconto === 'porcentagem'
            ? total - total * (dados.desconto / 100)
            : total - dados.desconto
    }

    function calcularDatasPrestacoes(dataPrimeiraPrestacao, numeroPrestacoes) {
        let data = new Date(dataPrimeiraPrestacao)

        let datasPrestacoes = [];

        for (let i = 0; i < numeroPrestacoes; i++) {
            let novaData = new Date(data);
            novaData.setMonth(novaData.getMonth() + i);
            datasPrestacoes.push(novaData);
        }

        return datasPrestacoes;
    }

    const geraParcela = async () => {
        setLoadingOverlay(true)
        let valor_com_desconto = await calculoDesconto(orcamento?.preco)
        let valor_entrada = dados?.entrada
        let valor_final = valor_com_desconto - valor_entrada
        let valor_parcela = valor_final / dados.quantidade_parcelas
        let datas_prestacoes = calcularDatasPrestacoes(dados.data_primeiro_vencimento, dados.quantidade_parcelas)
        let id_pagamento = await cadastroPagamento()
            .then(async data => {
                let contador = valor_entrada ? 2 : 1
                let qtd_parcelas = valor_entrada
                    ? dados.quantidade_parcelas + 1
                    : dados.quantidade_parcelas
                for (contador; contador <= qtd_parcelas; contador++) {
                    await geraContasReceber({
                        id_pagamento: data,
                        nr_parcela: contador,
                        valor: valor_parcela,
                        dt_vencimento: datas_prestacoes[contador - 1],
                        id_paciente: Number(orcamento.id_paciente),
                    })
                }

                valor_entrada && await geraContasReceber({
                    id_pagamento: data,
                    nr_parcela: 1,
                    valor: valor_entrada,
                    dt_vencimento: datas_prestacoes[0],
                    id_paciente: Number(orcamento.id_paciente),
                })

            }).then(async response => {
                await changeScreen("listaOrcamento")
            })
        setLoadingOverlay(false)
        setShowToast()
    }

    return (
        <div>
            <div id="accordionExample5">
                <div
                    className="rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                    <h2 className="mb-0" id="headingOne5">
                        <button
                            className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-purble-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-primary [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:[&:not([data-te-collapse-collapsed])]:bg-neutral-800 dark:[&:not([data-te-collapse-collapsed])]:text-primary-400 dark:[&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]"
                            type="button"
                            data-te-collapse-init
                            data-te-target="#collapseOne5"
                            aria-expanded="true"
                            aria-controls="collapseOne5">
                            Forma de Pagamento
                            <span
                                className="-mr-1 ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
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
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </button>
                    </h2>
                    <div
                        id="collapseOne5"
                        className="!visible"
                        data-te-collapse-item
                        data-te-collapse-show
                        aria-labelledby="headingOne5">
                        <div className="px-5 py-4">
                            <Select
                                className="text-gray-500 w-6/12"
                                name="paciente"
                                options={formaPagamento}
                                placeholder="Forma de pagamento"
                                onChange={(e) => {
                                    updateField({
                                        target: {
                                            name: "forma_pagamento",
                                            value: e.value,
                                        },
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="border border-t-0 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                    <h2 className="mb-0" id="headingTwo5">
                        <button
                            className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-purble-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-primary [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:[&:not([data-te-collapse-collapsed])]:bg-neutral-800 dark:[&:not([data-te-collapse-collapsed])]:text-primary-400 dark:[&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]"
                            type="button"
                            data-te-collapse-init
                            data-te-target="#collapseTwo5"
                            aria-expanded="true"
                            aria-controls="collapseTwo5">
                            Desconto
                            <span
                                className="-mr-1 ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
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
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </button>
                    </h2>
                    <div
                        id="collapseTwo5"
                        className="!visible"
                        data-te-collapse-item
                        data-te-collapse-show
                        aria-labelledby="headingTwo5">
                        <div className="px-5 py-4">
                            <div className="w-full md:w-6/12 pt-3">
                                <ul
                                    className="items-center w-full text-sm font-medium text-gray-900 bg-white  rounded-lg sm:flex"
                                    name="status"
                                >
                                    <li className="w-full">
                                        <div className="flex items-center pl-3">
                                            <input
                                                id="status1"
                                                type="radio"
                                                value="porcentagem"
                                                name="tipo_desconto"
                                                className="w-4 h-4"
                                                onChange={updateField}
                                            />
                                            <label
                                                for="status1"
                                                className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Porcentagem (%)
                                            </label>
                                        </div>
                                    </li>
                                    <li className="w-full">
                                        <div className="flex items-center pl-3">
                                            <input
                                                id="status2"
                                                type="radio"
                                                value="real"
                                                name="tipo_desconto"
                                                className="w-4 h-4"
                                                onChange={updateField}
                                            />
                                            <label
                                                for="status2"
                                                className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Real(R$)
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>


                            <div className="w-full md:w-6/12 pt-3">
                                <label className="text-gray-500">Valor</label>
                                <input
                                    type="text"
                                    id="desconto"
                                    name="desconto"
                                    value={formatarMoedaBRL(dados?.desconto)}
                                    placeholder="R$ 0,00"
                                    onChange={(e) => {
                                        updateField({
                                            target: {
                                                name: "desconto",
                                                value: toDecimalNumeric(e.target.value),
                                            },
                                        });
                                    }}
                                    className="form-input rounded-lg text-gray-500 w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="rounded-b-lg border border-t-0 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                    <h2 className="mb-0" id="headingThree5">
                        <button
                            class="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-primary [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:[&:not([data-te-collapse-collapsed])]:bg-neutral-800 dark:[&:not([data-te-collapse-collapsed])]:text-primary-400 dark:[&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]"
                            type="button"
                            data-te-collapse-init
                            data-te-target="#collapseThree5"
                            aria-expanded="true"
                            aria-controls="collapseThree5">
                            Detalhes do pagamento
                            <span
                                className="-mr-1 ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
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
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </button>
                    </h2>
                    <div
                        id="collapseThree5"
                        className="!visible"
                        data-te-collapse-item
                        data-te-collapse-show
                        aria-labelledby="headingThree5">
                        <div className="px-5 py-4">
                            <div className="flex w-full gap-3">
                                <div className="w-6/12 pt-3">
                                    <label className="text-gray-500 ">Quantidade de Parcelas</label>
                                    <Select
                                        className="text-gray-500 w-full"
                                        name="paciente"
                                        options={parcelas}
                                        required
                                        placeholder="Parcelas"
                                        defaultValue={parcelas[0]}
                                        onChange={(e) => {
                                            updateField({
                                                target: {
                                                    name: "quantidade_parcelas",
                                                    value: e.value,
                                                },
                                            });
                                        }}
                                    />
                                </div>

                                <div className="w-full md:w-2/5 pr-2 pt-3">
                                    <label for="dt_nascimento" className="text-gray-700 ">Data 1º Vencimento</label>
                                    <div className="w-full">
                                        <DatePicker
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            scrollableYearDropdown={true}
                                            className="form-input rounded-lg text-gray-600 w-full"
                                            selected={primeiroVencimento}
                                            name="data_primeiro_vencimento"
                                            id="data_primeiro_vencimento"
                                            onChange={(e) =>
                                                changeDate(
                                                    {
                                                        target: {
                                                            value: moment(e).format("YYYY-MM-DD"),
                                                            name: 'data_primeiro_vencimento'
                                                        }
                                                    }
                                                )}
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full gap-3">
                                <div className="w-6/12 pt-3">
                                    <label className="text-gray-500 ">Entrada</label>
                                    <input
                                        type="text"
                                        id="entrada"
                                        value={formatarMoedaBRL(dados.entrada)}
                                        name="entrada"
                                        placeholder="R$ 0,00"
                                        onChange={(e) => {
                                            updateField({
                                                target: {
                                                    name: "entrada",
                                                    value: toDecimalNumeric(e.target.value),
                                                },
                                            });
                                        }}
                                        className="form-input rounded-lg text-gray-500 w-full" />
                                </div>

                                <div className="w-6/12 pt-3">
                                    <label className="text-gray-500 ">Data do pagamento</label>
                                    <input type="date" id="data_pagamento" name="data_pagamento" onChange={updateField} className="form-input rounded-lg text-gray-500 w-full" />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-5 p-3 flex flex-end w-full justify-end items-center">
                </div>
                <p>Total: {formatarMoedaBRL(orcamento?.preco)}</p>
            </div>

            <div className="mb-5 p-3 gap-3 flex flex-end w-full justify-end items-center">
                <button
                    onClick={() => changeScreen("listaOrcamento")}
                    className="bg-red-800 hover:bg-red-500 rounded-lg p-2 text-white font-bold">
                    Voltar
                </button>
                <button
                    onClick={() => geraParcela()}
                    className="bg-purple-800 hover:bg-purple-500 rounded-lg p-2 text-white font-bold">
                    Concluir
                </button>
            </div>

            <LoadingOverlay isLoading={loadingOverlay} />

        </div>
    );
};

export default Pagamento
