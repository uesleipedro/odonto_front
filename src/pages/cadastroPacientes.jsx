import React, { useEffect, useState } from "react"
import Link from "next/link"
import api from "../utils/Api"
import { useRouter } from 'next/router'

const CadastroPacientes = () => {
    const router = useRouter()
    const data = router.query;
    const [paciente, setPaciente] = useState(data)

    const updateField = e => {
        const fieldName = e.target.name
        setPaciente(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
    }

    const sendPacienteData = async () => {
        if (typeof paciente?.nome !== "string") {
            alert("preencha o campo nome")
            return
        }

        paciente.id_paciente == ! ""
            ? await cadastroPaciente()
            : await updatePaciente()


        router.push('/listaPacientes')
    }

    const cadastroPaciente = async () => {
        await api.post('paciente', paciente)
            .then(function (response) {
                if (response.status === 201)
                    alert("Salvo com sucesso")

            })
            .catch(function (error) {
                
            })
    }

    const updatePaciente = async () => {
        await api.put('paciente', paciente)
            .then(function (response) {
                if (response.status === 201)
                    alert("Salvo com sucesso")

            })
            .catch(function (error) {
                
            })
    }

    return (
        <div className="m-5 p-5 rounded-lg shadow-lg">

            <p className="text-gray-600 font-bold">Dados Pessoais</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">

                <div className="w-full md:w-1/2 pr-2 pt-3">
                    <label className="text-gray-700 ">Nome Completo</label>
                    <input required value={paciente.nome} type="text" id="nome" name="nome" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: João da Cunha" />
                </div>

                <div className="w-full md:w-1/2 pt-3">
                    <label className="text-gray-700 ">CPF</label>
                    <input value={paciente.cpf} type="cpf" id="cpf" name="cpf" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="000.000.000-00" />
                </div>

                <div className="w-full md:w-2/5 pr-2 pt-3">
                    <label className="text-gray-700 ">RG</label>
                    <input value={paciente.rg} type="text" id="rg" name="rg" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" />
                </div>

                <div className="w-full md:w-2/5 pr-2 pt-3">
                    <label className="text-gray-700 ">Data de nascimento</label>
                    <input value={paciente.dt_nascimento} type="date" id="dt_nascimento" name="dt_nascimento" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: João da Cunha" />
                </div>

                <div className="w-full md:w-1/5 pt-3">
                    <label className="text-gray-700 ">Sexo</label>
                    <select value={paciente.sexo} id="sexo" name="sexo" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: João da Cunha">
                        <option value=""></option>
                        <option value="m">Masculino</option>
                        <option value="f">Feminino</option>
                    </select>
                </div>

                <div className="w-full md:w-2/4 pt-3 pr-3">
                    <label className="text-gray-700 ">Estado civil</label>
                    <select value={paciente.estado_civil} id="estado_civil" name="estado_civil" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: João da Cunha">
                        <option value=""></option>
                        <option value="s">Solteiro (a)</option>
                        <option value="c">Casado (a)</option>
                        <option value="d">Divorciado (a)</option>
                        <option value="v">Viúvo (a)</option>
                    </select>
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Plano de saúde</label>
                    <input value={paciente.plano_saude} type="text" id="plano_saude" name="plano_saude" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" />
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Número carteirinha</label>
                    <input value={paciente.numero_carteirinha} type="text" id="numero_carteirinha" name="numero_carteirinha" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" />
                </div>

            </div>

            <p className="text-gray-600 font-bold">Contato</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">

                <div className="w-full md:w-2/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Telefone fixo</label>
                    <input value={paciente.telefone_fixo} type="text" id="telefone_fixo" name="telefone_fixo" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: (61) 3333-3333" />
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Telefone móvel</label>
                    <input value={paciente.telefone_movel} type="text" id="telefone_movel" name="telefone_movel" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: (61) 99999-9999" />
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Email</label>
                    <input value={paciente.email} type="email" id="email" name="email" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: fulano@gmail.com" />
                </div>
            </div>

            <p className="text-gray-600 font-bold">Dados do responável</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">
                <div className="w-full md:w-2/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Nome do reponsável</label>
                    <input value={paciente.nome_responsavel} type="text" id="nome_responsavel" name="nome_reponsavel" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: João da Cunha" />
                </div>

                <div className="w-full md:w-2/4 pt-3">
                    <label className="text-gray-700 ">Telefone do responsável</label>
                    <input value={paciente.telefone_responsavel} type="text" id="telefone_responsavel" name="telefone_responsavel" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: (61) 99999-9999" />
                </div>

                <div className="w-full md:w-2/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Email do reponsável</label>
                    <input value={paciente.email_responsavel} type="email" id="email_responsavel" name="email_responsavel" onChange={updateField} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: fulano@gmail.com" />
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

                <Link href="/listaPacientes">
                    <button className="bg-white hover:bg-gray-200 text-purple-800 border font-bold py-2 px-4 rounded-full mt-5">
                        Cancelar
                    </button>
                </Link>
            </div>

        </div >
    )
}

export default CadastroPacientes