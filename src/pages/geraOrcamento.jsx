import React, { useState, useEffect } from 'react'
import api from '../utils/Api'
import moment from 'moment'
import Select from "react-select";

const GeraOrcamento = ({ id_paciente }) => {

    const [procedimentos, setProcedimentos] = useState([])
    const [valorOrcamento, setValorOrcamento] = useState(0)
    const [profissionais, setProfissionais] = useState([
        { label: 'Dr. Fulano', value: 1 }
    ])
    const [selectedProfissional, setSelectedProfissional] = useState(0)


    useEffect(() => {
        const getProcedimentoList = async () => {
            await api.get('procedimento')
                .then(response => {
                    setProcedimentos([...response.data])
                })
                .catch(function (error) {
                    console.error(error);
                })
        }
        getProcedimentoList()
    }, [])

    const handleToggleCheck = (index) => (e) => {
        const newArray = procedimentos.map((item, i) => {
            if (index === i) {
                let value = e.target.name === "check"
                    ? e.target.checked
                    : e.target.value

                return { ...item, [e.target.name]: value }
            } else {
                return item
            }
        })

        setProcedimentos(newArray)
    }

    const updatePrice = (index) => (e) => {
        const newArray = procedimentos.map((item, i) => {
            if (index === i) {
                return { ...item, [e.target.name]: e.target.value }
            } else {
                return item
            }
        })

        setProcedimentos(newArray)
    }

    const sendOrcamentoData = async () => {
        api.post('/orcamento', {
            id_empresa: 1,
            id_profissional: selectedProfissional,
            id_paciente: 1,
            preco: valorOrcamento,
            date: moment().toDate(),
            status: 'pendente',
            id_paciente: id_paciente
        })
            .then(async (response) => {
                if (response.status === 201)
                    alert("Salvo com sucesso")
                return response.data.id_orcamento
            }).then((e) => {
                sendProcedimentoOrcamento(e)
            })
            .catch(e => {
                alert(e)
            })
    }

    const sendProcedimentoOrcamento = (id_orcamento) => {
        procedimentos.map(e => {
            if (!e.check) return

            api.post('/procedimento_orcamento', {
                id_procedimento: e.id_procedimento,
                id_orcamento: id_orcamento,
                preco: e.preco
            })
                .then(function (response) {
                    if (response.status === 201)
                        alert("Salvo com sucesso")
                })
                .catch(e => {
                    alert(e)
                })
        })
    }

    useEffect(() => {
        const calculaValorOrcamento = () => {
            let value = 0
            procedimentos.map(e => {
                if (e.check)
                    value += Number(e.preco)
            })

            setValorOrcamento(value)
        }

        calculaValorOrcamento()
    }, [procedimentos])

    const geraOrcamento = () => {
        sendOrcamentoData()

    }


    return (
        <div className="p-5  rounded-lg shadow-lg">
            <h1 className='text-gray-500'>Selecione um profissional:</h1>
            <Select
                className="text-gray-500 w-6/12"
                name="paciente"
                options={profissionais}
                placeholder="Profissional"
                onChange={(e) => {
                    setSelectedProfissional(e.value)
                }}
            />

            <div className="flex flex-col mt-4">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="border rounded-lg shadow overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-purple-800 dark:bg-purple-700">
                                    <tr className="text-white text-left font-medium">
                                        <th scope="col" className="px-6 py-3">
                                            <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                                                <input
                                                    class="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                                    type="checkbox"
                                                    value=""
                                                    id="checkboxDefault" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">Dente</th>
                                        <th scope="col" className="px-6 py-3 ">Procedimento</th>
                                        <th scope="col" className="px-6 py-3">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {procedimentos.map((data, index) => (
                                        <tr key={data.id_procedimento} className="cursor-pointer">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">
                                                <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                                                    <input
                                                        class="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                                        type="checkbox"
                                                        checked={procedimentos.check}
                                                        value=""
                                                        name="check"
                                                        onChange={handleToggleCheck(index)}
                                                    />
                                                </div>
                                            </td>
                                            <td onClick={() => {
                                                setToggleInsertUpdate('update')
                                                updateProcedimento(data.id_procedimento)
                                            }}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.dente}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.procedimento}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">
                                                <span className="mr-2">R$</span>
                                                <input
                                                    name="preco"
                                                    id={data.id_procedimento}
                                                    value={data.preco}
                                                    onChange={updatePrice(index)}
                                                    type="number" />
                                            </td>
                                        </tr>
                                    ))}
                                    <span>Total: R$ {valorOrcamento}</span>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-5 p-3 flex flex-end w-full justify-end items-center">
                <button
                    onClick={geraOrcamento}
                    className="bg-purple-800 hover:bg-purple-500 rounded-lg p-2 text-white font-bold">
                    Gerar Orçamento
                </button>
            </div>
        </div>
    )
}

export default GeraOrcamento