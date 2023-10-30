import React, { useEffect, useState } from "react"
import Link from "next/link"
import api from "../utils/Api"
import middleware from "../middleware"
import { useRouter } from "next/navigation"

const CadastroUsuario = () => {

    const [user, setUser] = useState()
    const router = useRouter()

    const updateName = e => {
        const fieldName = e.target.name
        setUser(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
    }

    const sendPacienteData = () => {
        api.post('/user', user)
            .then(function (response) {
                if (response.status === 201)
                    alert("Salvo com sucesso")
            })
            .catch(e => {
                alert(e)
            })
    }

    const step2 = () => {
        router.push({
            pathname: "/cadastroUsuarioStep2",
            query: { cadastro: JSON.stringify(user) }
        })
    }

    return (
        <form className="m-5 p-5 rounded-lg shadow-lg">

            <p className="text-gray-600 font-bold">Dados Pessoais</p>
            <hr />
            <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">

                <div className="w-full md:w-1/2 pr-2 pt-3">
                    <label className="text-gray-700 ">Email</label>
                    <input type="email" id="email" name="email" onChange={updateName} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: antonio@gmail.com" />
                </div>

                <div className="w-full md:w-1/2 pt-3">
                    <label className="text-gray-700 ">Senha</label>
                    <input type="password" id="senha" name="senha" onChange={updateName} className="form-input rounded-lg text-gray-600 w-full" placeholder="**********" />
                </div>

                <div className="w-full md:w-3/5 pr-2 pt-3">
                    <label className="text-gray-700 ">Nome completo</label>
                    <input type="text" id="nome" name="nome" onChange={updateName} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex.: Marcelo Algusto" />
                </div>

                <div className="w-full md:w-2/5 pr-2 pt-3">
                    <label className="text-gray-700 ">Celular</label>
                    <input type="text" id="telefone_movel" name="telefone_movel" onChange={updateName} className="form-input rounded-lg text-gray-600 w-full" placeholder="Ex: (61) 99999-9999" />
                </div>

            </div>

            <hr />
            <div className="w-full flex justify-end gap-3">
                <Link href="/cadastroUsuarioStep2" className="w-full">
                    <button
                        className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full mt-5"
                    // onClick={() => router.push({
                    //     pathname: "/cadastroUsuarioStep2",
                    //     query: { cadastro: JSON.stringify(user) }
                    // })}
                    >
                        Continuar
                    </button>
                </Link>
            </div>

        </form >
    )
}

export default CadastroUsuario