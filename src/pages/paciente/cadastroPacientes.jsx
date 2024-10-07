import React, { useEffect, useState } from "react"
import Link from "next/link"
import api from "../../utils/Api"
import { useRouter } from 'next/router'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale'
import { useAuth } from '../../auth/useAuth'
import 'react-datepicker/dist/react-datepicker.css'
import { maskCPF_CNPJ, maskPhone } from "../../utils/mask"
import Swal from "sweetalert2"

const CadastroPacientes = () => {
    const router = useRouter()
    const { user } = useAuth()
    const id_empresa = user?.user?.foundUser.id_empresa
    const [paciente, setPaciente] = useState({ id_empresa: Number(id_empresa) })
    const [dataNascimento, setDataNascimento] = useState(
        paciente?.dt_nascimento
            ? moment(paciente?.dt_nascimento).toDate()
            : null
    )

    useEffect(() => {
        let data = sessionStorage.getItem('cadastroPacientes')
        setPaciente(JSON.parse(data))
        updateField({
            target: {
                name: "id_empresa",
                value: id_empresa
            }
        })
        registerLocale('ptBR', ptBR)
        setDefaultLocale('ptBR')
    }, [])

    const updateField = e => {
        const fieldName = e.target.name

        setPaciente(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
    }

    const changeDate = (date) => {
        setDataNascimento(date.target.value)
        updateField(date)
    }

    const sendPacienteData = async () => {
        if (typeof paciente?.nome !== "string") {
            Swal.fire("preencha o campo nome")
            return
        }

        paciente?.id_paciente == undefined
            ? await cadastroPaciente(paciente)
            : await updatePaciente(paciente)


        router.push('/paciente/listaPacientes')
    }

    const cleanInput = (input) => input?.replace(/\D/g, '')

    const cleanData = async (dataArray) => {
        if (dataArray === null) return

        return await dataArray?.map(item => ({
            ...item,
            cpf: cleanInput(item.cpf),
            telefone_fixo: cleanInput(item.telefone_fixo),
            telefone_movel: cleanInput(item.telefone_movel),
            telefone_responsavel: cleanInput(item.telefone_responsavel),
        }))
    }

    const cadastroPaciente = async (dados) => {
        let dadosTratados = await cleanData([dados])

        await api.post('paciente', dadosTratados[0])
            .then(function (response) {
                if (response.status === 201)
                    Swal.fire("Salvo com sucesso")

            })
            .catch(function (error) {
                console.error(error)
            })
    }

    const updatePaciente = async (dados) => {
        let dadosTratados = await cleanData([dados])

        await api.put('paciente', dadosTratados[0])
            .then(function (response) {
                if (response.status === 201)
                    Swal.fire("Salvo com sucesso")

            })
            .catch(function (error) {
                console.error(error)
            })
    }

    return (
        <div className="m-5 p-5 rounded-lg shadow-lg">

            <div className="flex justify-end gap-3">
                <Link href="/paciente/listaPacientes">
                    <button className="bg-purple-700 hover:bg-purple-500 text-white border font-bold py-2 px-4 rounded-full mt-5">
                        Voltar
                    </button>
                </Link>
            </div>

            <p className="text-gray-600 font-bold">Dados Pessoais</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">

                <div className="w-full md:w-1/2 pr-2 pt-3">
                    <label className="text-gray-700 ">Nome Completo</label>
                    <input required value={paciente?.nome} type="text" id="nome" name="nome" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: João da Cunha" />
                </div>

                <div className="w-full md:w-1/2 pt-3">
                    <label className="text-gray-700 ">CPF</label>
                    <input value={maskCPF_CNPJ(paciente?.cpf)} type="cpf" id="cpf" name="cpf" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="000.000.000-00" />
                </div>

                <div className="w-full md:w-2/5 pr-2 pt-3">
                    <label className="text-gray-700 ">RG</label>
                    <input value={paciente?.rg} type="text" id="rg" name="rg" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" />
                </div>

                <div className="w-full md:w-2/5 pr-2 pt-3">
                    <label for="dt_nascimento" className="text-gray-700 ">Data de nascimento</label>
                    <div className="w-full">

                        <DatePicker
                            className="form-input rounded-lg text-gray-600 w-full"
                            name="dt_nascimento"
                            id="dt_nascimento"
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            scrollableYearDropdown={true}
                            dateFormat="dd/MM/yyyy"
                            selected={paciente?.dt_nascimento}
                            onChange={(e) =>
                                changeDate(
                                    {
                                        target: {
                                            value: e,
                                            name: 'dt_nascimento'
                                        }
                                    }
                                )}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/5 pt-3">
                    <label className="text-gray-700 ">Sexo</label>
                    <select value={paciente?.sexo} id="sexo" name="sexo" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: João da Cunha">
                        <option value=""></option>
                        <option value="m">Masculino</option>
                        <option value="f">Feminino</option>
                    </select>
                </div>

                <div className="w-full md:w-2/4 pt-3 pr-3">
                    <label className="text-gray-700 ">Estado civil</label>
                    <select value={paciente?.estado_civil} id="estado_civil" name="estado_civil" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: João da Cunha">
                        <option value=""></option>
                        <option value="s">Solteiro (a)</option>
                        <option value="c">Casado (a)</option>
                        <option value="d">Divorciado (a)</option>
                        <option value="v">Viúvo (a)</option>
                    </select>
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Plano de saúde</label>
                    <input value={paciente?.plano_saude} type="text" id="plano_saude" name="plano_saude" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" />
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Número carteirinha</label>
                    <input value={paciente?.numero_carteirinha} type="text" id="numero_carteirinha" name="numero_carteirinha" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" />
                </div>

            </div>

            <p className="text-gray-600 font-bold">Contato</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">

                <div className="w-full md:w-2/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Telefone fixo</label>
                    <input value={maskPhone(paciente?.telefone_fixo)} type="text" id="telefone_fixo" name="telefone_fixo" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: (61) 3333-3333" />
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Telefone móvel</label>
                    <input value={maskPhone(paciente?.telefone_movel)} type="text" id="telefone_movel" name="telefone_movel" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: (61) 99999-9999" />
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Email</label>
                    <input value={paciente?.email} type="email" id="email" name="email" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: fulano@gmail.com" />
                </div>
            </div>

            <p className="text-gray-600 font-bold">Dados do responável</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">
                <div className="w-full md:w-2/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Nome do reponsável</label>
                    <input value={paciente?.nome_responsavel} type="text" id="nome_responsavel" name="nome_responsavel" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: João da Cunha" />
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Telefone do responsável</label>
                    <input value={maskPhone(paciente?.telefone_responsavel)} type="text" id="telefone_responsavel" name="telefone_responsavel" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: (61) 99999-9999" />
                </div>

                <div className="w-full md:w-2/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Email do reponsável</label>
                    <input value={paciente?.email_responsavel} type="email" id="email_responsavel" name="email_responsavel" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: fulano@gmail.com" />
                </div>
            </div>

            <p className="text-gray-600 font-bold">Endereço</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">
                <div className="w-full md:w-3/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Logradouro</label>
                    <input type="text" className="form-input rounded-lg text-gray-600 w-full" />
                </div>

                <div className="w-full md:w-1/4 pt-3">
                    <label className="text-gray-700 ">Número</label>
                    <input type="text" className="form-input rounded-lg text-gray-600 w-full" />
                </div>

                <div className="w-full md:w-2/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Bairro</label>
                    <input type="email" className="form-input rounded-lg text-gray-600 w-full" />
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Município</label>
                    <input type="email" className="form-input rounded-lg text-gray-600 w-full" />
                </div>

                <div className="w-full md:w-1/4 pr-2 pt-3">
                    <label className="text-gray-700 ">UF</label>
                    <input type="email" className="form-input rounded-lg text-gray-600 w-full" />
                </div>

                <div className="w-full md:w-3/4 pt-3">
                    <label className="text-gray-700 ">CEP</label>
                    <input type="email" className="form-input rounded-lg text-gray-600 w-full" />
                </div>

                <div className="w-full md:w-2/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Cidade</label>
                    <input type="email" className="form-input rounded-lg text-gray-600 w-full" />
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Complemento</label>
                    <input type="email" className="form-input rounded-lg text-gray-600 w-full" />
                </div>

            </div>

            <hr />
            <div className="flex justify-end gap-3">
                <button onClick={sendPacienteData} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full mt-5">
                    Salvar
                </button>

                <Link href="/paciente/listaPacientes">
                    <button className="bg-white hover:bg-gray-200 text-purple-800 border font-bold py-2 px-4 rounded-full mt-5">
                        Voltar
                    </button>
                </Link>
            </div>

        </div >
    )
}

export default CadastroPacientes
