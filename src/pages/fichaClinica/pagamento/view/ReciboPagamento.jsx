import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import n2words from "n2words"
import moment from "moment"
import { useAuth } from "../../../../auth/useAuth"
import LoadingOverlay from "../../../../components/LoadingOverlay"
import { formatarMoedaBRL, maskCPF_CNPJ } from "../../../../utils/mask"
import { usePaciente } from "../../../../context/PacienteContext"
import api from "../../../../utils/Api"
import noImage from "/public/notfoundimage.png"

const ReciboPagamento = () => {
    const printRef = useRef()
    const [reciboPagamento, setReciboPagamento] = useState()
    const [valorPorExtenso, setValorPorExtenso] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const { dadosPaciente } = usePaciente()
    const [logo, setLogo] = useState(noImage)
    const { user } = useAuth()
    const dadosEmpresa = user?.user?.foundUser
    const router = useRouter()

    useEffect(() => {
        const carregarValores = () => {
            const data = sessionStorage.getItem('viewReciboPagamento')
            setReciboPagamento(JSON.parse(data))
            setIsLoading(true)
        }
        carregarValores()
        getLogo()
    }, [dadosEmpresa])

    useEffect(() => {
        console.log("dadosPaciente", JSON.stringify(dadosPaciente))
    }, [dadosPaciente])

    useEffect(() => {
        if (reciboPagamento !== null && reciboPagamento !== undefined) {
            const words = n2words(reciboPagamento?.valor, { lang: 'pt' });
            setValorPorExtenso(words)
        }
    }, [reciboPagamento])

    const getLogo = () => {
        api.get(`/uploads/image/${dadosEmpresa?.id_empresa}`).then(res => {
            setLogo(`http://localhost:3333/uploads/image/${dadosEmpresa.id_empresa}`)
        }).catch((e) => {
            setLogo(noImage)
        })
    }

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML
        const originalContents = document.body.innerHTML
        document.body.innerHTML = printContents
        window.print()
        document.body.innerHTML = originalContents
    }

    const receiptVia = (index) => (
        < div key={index} className="border border-gray-300 p-1 mb-1" >

            <div className="flex flex-column gap-10">
                <div className="flex items-center ml-20">
                    <Image
                        src={logo}
                        alt="Logomarca"
                        width={200}
                        height={200}
                        className="mr-4 basis-1/5"
                    />
                </div>

                <div>
                    <div className="text-xl font-semibold">{dadosEmpresa?.nome_fantasia}</div>
                    <p> <span className="font-semibold">CNPJ: </span>{maskCPF_CNPJ(dadosEmpresa?.cnpj_cpf)}</p>
                    <p>{`${dadosEmpresa?.logradouro} ${dadosEmpresa?.bairro} ${dadosEmpresa?.cidade} ${dadosEmpresa?.uf}, ${dadosEmpresa.numero}`}</p>
                    <p>{dadosEmpresa?.cep}</p>
                    <p>{dadosEmpresa?.email}</p>
                    <p className="basis-1/4">Recibo Nº: <span className="font-semibold">{reciboPagamento?.id_pagamento}</span></p>
                    <p className="basis-1/4">O valor de: <span className="font-semibold">{formatarMoedaBRL(reciboPagamento?.valor)}</span></p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center mt-2">
                <div className="flex flex-row w-full justify-center mb-5">

                </div>
                <p>Recebemos de {reciboPagamento?.nome}, com CPF {maskCPF_CNPJ(reciboPagamento?.cpf)}, a quantidade de {valorPorExtenso} reais, referente a tratamento odontológico e por ser verdade,
                    afirmamos o presente recibo.
                </p>
            </div>

            <div className="flex justify-between items-end mt-3">
                <div className="text-right">
                    <p>Data: <span className="font-semibold">{moment(reciboPagamento?.dt_recebimento).format("DD/MM/YYYY") ?? ''}</span></p>
                </div>
                <div className="border-t border-gray-400 w-48 text-center mt-2">
                    <p>Assinatura</p>
                </div>
            </div>
        </div >
    )

    if (reciboPagamento === '') {
        return <LoadingOverlay isLoading={true} />
    }

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
                {[1].map((via) => receiptVia(via))}
            </div>
        </>
    )
}

export default ReciboPagamento