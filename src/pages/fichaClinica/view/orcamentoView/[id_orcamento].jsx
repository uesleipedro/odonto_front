import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import api from '../../../../utils/Api'
import { formatarMoedaBRL, maskCPF_CNPJ, maskPhone } from '../../../../utils/mask'
import LoadingOverlay from '../../../../components/LoadingOverlay'
import { useAuth } from '../../../../auth/useAuth'
import moment from 'moment'
import Image from 'next/image'
import png from "/public/1.png"

const OrcamentoView = () => {
    const router = useRouter()
    const { id_orcamento } = router.query
    const [orcamento, setOrcamento] = useState()
    const { user } = useAuth()
    const id_empresa = user?.user?.foundUser.id_empresa
    const empresa = user?.user?.foundUser

    useEffect(() => {
        const init = async () => {
            const { Modal, initTE, Ripple } = await import("tw-elements")
            initTE({ Modal, Ripple })
        }
        init()
    }, [])

    useEffect(() => {
        if (router.isReady && id_orcamento) {
            api.get(`orcamento/view/${id_orcamento}/${id_empresa}`)
                .then(async response => {
                    setOrcamento([...response.data])
                    console.log(response.data)
                })
                .catch(function (error) {
                    console.error(error)
                })
        }
    }, [router.isReady, id_orcamento])

    const handlePrint = () => {
        window.print()
    }

    if (!orcamento) {
        return <LoadingOverlay isLoading={!orcamento} />
    }

    return (
        <div className="flex flex-col justify-between w-full h-screen">
            <div className="flex justify-center w-full">
                <button
                    onClick={handlePrint}
                    className="print:hidden mt-4 px-4 py-2 bg-success-600 text-white rounded w-1/5">
                    Imprimir
                </button>
            </div>
            <div className="flex flex-row">
                <Image
                    src={png}
                    alt="Logomarca"
                    width={200}
                    height={200}
                    className="mr-4 basis-1/5"
                />

                <div className="flex flex-col basis-3/5">
                    <h2 className="text-lg font-bold"><strong> {orcamento[0]?.nome_fantasia}</strong></h2>
                    <h2 className="text-md font-bold"><strong> {`${empresa.logradouro}, ${empresa.numero}`}</strong></h2>
                    <h2 className="text-md font-bold"><strong> {`${empresa.bairro} ${empresa.cidade}`}</strong></h2>
                    <h2 className="text-md font-bold"><strong> {empresa.cep}</strong></h2>
                </div>
                <div className="basis-1/5">{moment(Date()).format("DD/MM/YYYY")}</div>
            </div>

            <div className="flex flex-col place-items-center align-center justify-center pt-10 gap-5">
                <h1 className="font-bold">PLANO DE TRATAMENTO</h1>
                <h1 className="">{`${orcamento[0].nome} - Celular: ${maskPhone(orcamento[0].telefone_movel)} - CPF: ${maskCPF_CNPJ(orcamento[0].cpf)}`}</h1>
                <h1 className="">{`Plano tratamento de ${orcamento[0].nome}`}</h1>
            </div>

            <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                        <tr>
                            <th scope="col" className="">Procedimento</th>
                            <th scope="col" className="">Dentista</th>
                            <th scope="col" className="">Dente/Região</th>
                            <th scope="col" className="px-4 py-2">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orcamento?.map((item) => (
                            <tr className="border-b border-neutral-200 dark:border-white/10" key={item.id}>
                                <td scope="row" className="whitespace-nowrap px-4 py-2 font-medium">{item.procedimento}</td>
                                <td scope="row" className="border px-4 py-2">{orcamento[0].nome_profissional}</td>
                                <td scope="row" className="border px-4 py-2">{`${item.dente} - ${item.face_dente}`}</td>
                                <td scope="row" className="border px-4 py-2">{formatarMoedaBRL(item.preco_item)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pt-10 text-right font-bold text-xl">
                Valor Total: {formatarMoedaBRL(orcamento[0]?.preco_total)}
            </div>

            <div>
                <div className="flex flex-col place-items-center align-center justify-center">
                    Assino este declarando verdadeiras as informações escritas acima
                </div>

                <div className="flex flex-row justify-between h-10 mt-10">
                    <div className=" flex flex-col justify-center basis-2/6">
                        ________________
                        {orcamento[0].nome}
                    </div>
                    <div className="flex basis-2/6"></div>
                    <div className="flex basis-2/6">
                        <hr />
                        {orcamento[0].nome_profissional}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default OrcamentoView