import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import api from '../../../../utils/Api'
import { formatarMoedaBRL } from '../../../../utils/mask'
import LoadingOverlay from '../../../../components/LoadingOverlay'
import { useAuth } from '../../../../auth/useAuth'
import moment from 'moment'

const OrcamentoView = () => {
    const router = useRouter()
    const { id_orcamento } = router.query
    const [orcamento, setOrcamento] = useState()
    const { user } = useAuth()
    const id_empresa = user?.user?.foundUser.id_empresa

    useEffect(() => {
        const init = async () => {
            const { Modal, initTE, Ripple } = await import("tw-elements");
            initTE({ Modal, Ripple });
        };
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
        <div className="min-h-screen flex flex-col">
            <header className="bg-purple-500 text-white p-4 text-center">
                <h1 className="text-2xl font-bold">{orcamento[0]?.nome_fantasia}</h1>
                <p className="text-sm font-bold">CNPJ: {orcamento[0]?.cnpj_cpf}</p>
            </header>
            <main className="flex-grow p-4">
                <h1 className="h-full text-center text-2xl font-bold pb-10">Orçamento</h1>
                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <div>
                        <div className='flex flex-row justify-between'>
                            <h2 className="basis-1/2 text-md mb-4"><strong>Nº Orçamento:</strong> {orcamento[0]?.id_orcamento}</h2>
                            <h2 className="basis-1/2 text-md mb-4"><strong>Data do orçamento:</strong> {moment(orcamento[0].date).format("DD/MM/YYYY")}</h2>
                        </div>
                        <div className="flex flex-row">
                            <h2 className="basis-1/2 text-md mb-4"><strong>Nome:</strong> {orcamento[0].nome}</h2>
                            <h2 className="basis-1/2 text-md mb-4"><strong>CPF:</strong> {orcamento[0].cpf}</h2>
                        </div>
                        <div className="flex flex-row">
                            <h2 className="basis-1/2 text-md mb-4"><strong>Telefone:</strong> {orcamento[0].telefone_movel}</h2>
                        </div>
                    </div>
                    <table className="table-auto w-full mb-4">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Descrição</th>
                                <th className="px-4 py-2">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orcamento?.map((item) => (
                                <tr key={item.id}>
                                    <td className="border px-4 py-2">{item.procedimento}</td>
                                    <td className="border px-4 py-2">{formatarMoedaBRL(item.preco_item)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-right font-bold text-xl">
                        Total: {formatarMoedaBRL(orcamento[0]?.preco_total)}
                    </div>
                    <button
                        onClick={handlePrint}
                        className="print:hidden mt-4 px-4 py-2 bg-purple-500 text-white rounded">
                        Imprimir
                    </button>
                </div>
            </main >
            <footer className="bg-purple-500 text-white p-4 text-center">
                <p>© 2024 Clínica Médica. Todos os direitos reservados.</p>
            </footer>
        </div >
    );
};

export default OrcamentoView