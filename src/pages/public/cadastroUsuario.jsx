import React, { useState } from "react"
import Link from "next/link"
import api from "../../utils/Api"
import { maskCPF_CNPJ, maskPhone } from "../../utils/mask"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"

const CadastroUsuario = () => {

    const [user, setUser] = useState({ access_levels: 1 })
    const router = useRouter()

    const updateName = e => {
        const fieldName = e.target.name
        setUser(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
    }

    const updateCep = e => {
        updateName(e)

        if (e.target.value.length == 8)
            buscaEndereco(e.target.value)
    }

    const buscaEndereco = async (cep) => {
        if (cep.length < 8) return

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const dados = await response.json()
        setUser({ ...user, ...dados })
    }

    const sendUserData = async () => {
        let userToSend = user
        userToSend.cnpj_cpf = user.cnpj_cpf?.replace(/\D/g, '')
        userToSend.telefone_movel = user.telefone_movel?.replace(/\D/g, '')
        await api.post('/user/userEmpresa', userToSend)
            .then(function (response) {
                if (response.status === 201)
                    Swal.fire("Salvo com sucesso!")

                router.push("/login")

            })
            .catch(e => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: e?.response?.data?.error,
                })
                console.error(e)
            })
    }

    return (
        <div className="m-5 p-5 rounded-lg shadow-lg">

            <p className="text-gray-600 font-bold">Dados Pessoais</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">

                <div className="w-full md:w-1/2 pr-2 pt-3">
                    <label className="text-gray-700 ">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex: antonio@gmail.com" />
                </div>

                <div className="w-full md:w-1/2 pt-3">
                    <label className="text-gray-700 ">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="**********" />
                </div>

                <div className="w-full md:w-3/5 pr-2 pt-3">
                    <label className="text-gray-700 ">Nome completo</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex.: Marcelo Algusto" />
                </div>

                <div className="w-full md:w-2/5 pr-2 pt-3">
                    <label className="text-gray-700 ">Celular</label>
                    <input
                        type="text"
                        id="telefone_movel"
                        name="telefone_movel"
                        value={maskPhone(user?.telefone_movel)}
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex: (61) 99999-9999" />
                </div>

                <div className="w-full md:w-3/4 pr-2 pt-3">
                    <label className="text-gray-700 ">CEP</label>
                    <input
                        type="text"
                        id="cep"
                        name="cep"
                        onChange={updateCep}
                        placeholder="Ex.: 72000-000"
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300" />
                </div>

                <div className="w-full md:w-3/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Logradouro</label>
                    <input
                        type="text"
                        id="logradouro"
                        name="logradouro"
                        value={user?.logradouro}
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex.: Avenida Marechal" />
                </div>

                <div className="w-full md:w-3/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Bairro</label>
                    <input
                        type="text"
                        id="bairro"
                        name="bairro"
                        value={user?.bairro}
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex.: Vila São José" />
                </div>

                <div className="w-full md:w-3/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Cidade</label>
                    <input
                        type="text"
                        id="cidade"
                        name="cidade"
                        value={user?.localidade}
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex.: Brasília" />
                </div>

                <div className="w-full md:w-3/4 pr-2 pt-3">
                    <label className="text-gray-700 ">UF</label>
                    <input
                        type="text"
                        id="uf"
                        name="uf"
                        value={user?.uf}
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex.: DF" />
                </div>

            </div>

            <p className="text-gray-600 font-bold">Dados da clínica</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">

                <div className="w-full md:w-3/4 pr-2 pt-3">
                    <label className="text-gray-700 ">Nome da clinica</label>
                    <input
                        type="text"
                        id="razao_social"
                        name="razao_social"
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="Ex.: Clinica Odonto" />
                </div>

                <div className="w-full md:w-1/1 pr-2 pt-3 flex flex-row gap-4">
                    <div className="flex items-center ">
                        <input
                            id="default-radio-1"
                            type="radio" value=""
                            name="default-radio"
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 placeholder-gray-300" />
                        <label className="ml-2 font-medium text-gray-700">Pessoa física</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            checked
                            id="default-radio-2"
                            type="radio"
                            value=""
                            name="default-radio"
                            className="w-4 h-4 text-blue-600  focus:ring-blue-500  focus:ring-2 placeholder-gray-300" />
                        <label className="ml-2 font-medium text-gray-700">Pessoa jurídica</label>
                    </div>
                </div>

                <div className="w-full md:w-3/4 pt-3">
                    <label className="text-gray-700 ">CNPJ/CPF</label>
                    <input
                        type="text"
                        id="cnpj_cpf"
                        name="cnpj_cpf"
                        value={maskCPF_CNPJ(user?.cnpj_cpf)}
                        onChange={updateName}
                        className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
                        placeholder="000.000.000-00" />
                </div>
            </div>

            <hr />
            <div className="flex justify-end gap-3">
                <button
                    onClick={sendUserData}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full mt-5">
                    Salvar
                </button>

                <Link href="/">
                    <button
                        className="bg-white hover:bg-gray-200 text-purple-800 border font-bold py-2 px-4 rounded-full mt-5">
                        Cancelar
                    </button>
                </Link>
            </div>

        </div>
    )
}

export default CadastroUsuario
