import React, { useState, useEffect, useRef } from "react"
import n2words from "n2words"
import { useAuth } from "../../../../auth/useAuth"
import { formatarMoedaBRL, maskCPF_CNPJ } from "../../../../utils/mask"
import { usePaciente } from "../../../../context/PacienteContext"

const ReciboPagamento = () => {
    const printRef = useRef()
    const [reciboPagamento, setReciboPagamento] = useState()
    const [valorPorExtenso, setValorPorExtenso] = useState()
    const { dadosPaciente } = usePaciente()
    const { user } = useAuth()
    const dadosEmpresa = user?.user?.foundUser

    useEffect(() => {
        const data = sessionStorage.getItem('viewReciboPagamento')
        setReciboPagamento(JSON.parse(data))
        console.log("dadosempresa", dadosEmpresa)
    }, [])

    useEffect(() => {
        if (reciboPagamento !== null && reciboPagamento !== undefined) {
            const words = n2words(reciboPagamento?.valor, { lang: 'pt' });
            setValorPorExtenso(words)
        }
    }, [reciboPagamento]);

    const receiptInfo = {
        companyLogo: "/logo.png",
        companyName: "Empresa Exemplo Ltda.",
        receiptNumber: "12345",
        amountReceived: "R$ 1.000,00",
        date: "31/08/2024",
        payerName: "João da Silva",
        payerCPF: "123.456.789-00",
    }


    const handlePrint = () => {
        const printContents = printRef.current.innerHTML
        const originalContents = document.body.innerHTML
        document.body.innerHTML = printContents
        window.print()
        document.body.innerHTML = originalContents
    }

    const receiptVia = (index) => (
        <div key={index} className="border border-gray-300 p-1 mb-1">

            <div className="flex flex-column gap-10">
                <div className="flex items-center ml-20">
                    {/* <img src={receiptInfo.companyLogo} alt="Logomarca" className="w-16 h-16 mr-4" /> */}
                    <p className="text-xl font-bold">LogoMarca</p>
                </div>

                <div>
                    <div className="text-xl font-semibold">{dadosEmpresa?.nome_fantasia}</div>
                    <p> <span className="font-semibold">CNPJ: </span>{maskCPF_CNPJ(dadosEmpresa?.cnpj_cpf)}</p>
                    <p>{dadosEmpresa?.endereco}</p>
                    <p>{dadosEmpresa?.cep}</p>
                    <p>{dadosEmpresa?.email}</p>
                    <p className="basis-1/4">Recibo Nº: <span className="font-semibold">{reciboPagamento?.id_pagamento}</span></p>
                    <p className="basis-1/4">O valor de: <span className="font-semibold">{formatarMoedaBRL(reciboPagamento?.valor)}</span></p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center mt-2">
                <div className="flex flex-row w-full justify-center mb-5">

                </div>
                <p>Recebemos de {dadosPaciente?.nome}, com CPF {maskCPF_CNPJ(dadosPaciente?.cpf)}, a quantidade de {valorPorExtenso} reais, referente a tratamento odontológico e por ser verdade,
                    afirmamos o presente recibo.
                </p>
            </div>

            <div className="flex justify-between items-end mt-3">
                <div className="text-right">
                    <p>Data: <span className="font-semibold">{receiptInfo.date}</span></p>
                </div>
                <div className="border-t border-gray-400 w-48 text-center mt-2">
                    <p>Assinatura</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="flex items-center justify-center w-full m-5">
                <button
                    onClick={handlePrint}
                    className="print:hidden mt-4 px-4 py-2 bg-purple-500 text-white rounded">
                    Imprimir
                </button>
            </div>
            <div ref={printRef} className="container mx-auto mt-8">
                {[1, 2, 3].map((via) => receiptVia(via))}
            </div>
        </>
    )
}

export default ReciboPagamento