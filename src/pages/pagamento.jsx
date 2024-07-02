import React, { useEffect, useState } from "react"
import Select from "react-select";
import api from "../utils/Api";

const Pagamento = ({ orcamento }) => {

    const [formaPagamento, setFormaPagamento] = useState([
        { label: "Dinheiro", value: 1 },
        { label: "Transferência ou PIX", value: 2 },
        { label: "Cartão de crédito", value: 3 },
        { label: "Cartão de débito", value: 4 },
        { label: "outro", value: 1 },
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
    const [selectedPagamento, setSelectedPagamento] = useState(0)
    const [dados, setDados] = useState({})
    const [idPagamento, setIdPagamento] = useState(0)

    // Initialization for ES Users

    useEffect(() => {
        const init = async () => {
            const { Collapse, initTE } =
                await import("tw-elements");
            initTE({
                Collapse,
                initTE,
            });
        };
        init();
    })

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
        alert("update status entrou")
        await api.put('orcamento/status', {
            id_orcamento: id_orcamento,
            status: 'finalizado'
        }).then((response) => {
            alert("response", response.status)
        })

        return
    }


    const cadastroPagamento = async () => {
        return await api.post('pagamento',
            {
                id_orcamento: orcamento?.id_orcamento,
                tipo_desconto: dados.tipo_desconto,
                valor_desconto: toDecimalNumeric(dados.desconto),
                quantidade_parcelas: dados.quantidade_parcelas,
                data_primeiro_vencimento: dados.primeiro_vencimento,
                entrada: toDecimalNumeric(dados.entrada),
                data_pagamento: dados.data_pagamento,
                id_empresa: 1,
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
                //router.push('/listaPacientes')
                return Number(response.data.id_pagamento)
            })
            .catch(function (error) {
                console.error(error)
            })
        // await updateStatusOrcamento(orcamento?.id_orcamento)

    }

    const geraContasReceber = async (contas) => {
        
        await api.post('contas_receber',
            {
                id_pagamento: contas.id_pagamento,
                nr_parcela: contas.nr_parcela,
                valor: contas.valor,
                dt_vencimento: contas.dt_vencimento,
                status: "Pendente",
                id_paciente: contas.id_paciente
            }
        )
            .then(async function (response) {

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
    }

    const calculoDesconto = async (total) => {
        return dados.tipo_desconto === 'porcentagem'
            ? toDecimalNumeric(total) - toDecimalNumeric(total) * (dados.valor_desconto / 100)
            : toDecimalNumeric(total) - dados.valor_desconto
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
        // let valor_total = calculoDesconto(orcamento?.preco)
        let valor_parcela = orcamento?.preco / dados.quantidade_parcelas
        let datas_prestacoes = calcularDatasPrestacoes(dados.primeiro_vencimento, dados.quantidade_parcelas)
        cadastroPagamento()
            .then(data => {
                for (let contador = 1; contador <= dados.quantidade_parcelas; contador++) {
                    geraContasReceber({
                        id_pagamento: data,
                        nr_parcela: contador,
                        valor: valor_parcela,
                        dt_vencimento: datas_prestacoes[contador - 1],
                        id_paciente: Number(orcamento.id_paciente)

                    })
                }
            })

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
                            {/* <h1 className='text-gray-500'>Forma de pagamento:</h1> */}
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
                                // onChange={updateField}
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
                                    value={dados.desconto}
                                    placeholder="R$ 0,00"
                                    onChange={(e) => {
                                        updateField({
                                            target: {
                                                name: "desconto",
                                                value: moneyMask(e.target.value),
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
                            // data-te-collapse-collapsed
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
                                        placeholder="Parcelas"
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

                                <div className="w-6/12 pt-3">
                                    <label className="text-gray-500" >Data do 1º vencimento</label>
                                    <input type="date" id="primeiro_vencimento" name="primeiro_vencimento" onChange={updateField} className="form-input rounded-lg text-gray-500 w-full" />
                                </div>

                            </div>

                            <div className="flex w-full gap-3">
                                <div className="w-6/12 pt-3">
                                    <label className="text-gray-500 ">Entrada</label>
                                    <input
                                        type="text"
                                        id="entrada"
                                        value={dados.entrada}
                                        name="entrada"
                                        placeholder="R$ 0,00"
                                        onChange={(e) => {
                                            updateField({
                                                target: {
                                                    name: "entrada",
                                                    value: moneyMask(e.target.value),
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
                    {/* Total: {Number(orcamento?.preco) - Number(dados.desconto/100} */}
                </div>
            </div>

            <div className="mb-5 p-3 flex flex-end w-full justify-end items-center">
                <button
                    onClick={() => geraParcela()}
                    className="bg-purple-800 hover:bg-purple-500 rounded-lg p-2 text-white font-bold">
                    Concluir
                </button>
            </div>
        </div>


    );
};

export default Pagamento;