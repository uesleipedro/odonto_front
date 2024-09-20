import React, { useEffect, useState, useMemo } from "react"
import { FaBarcode } from "react-icons/fa"
import { ImCancelCircle } from "react-icons/im"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2'
import moment from "moment"
import withReactContent from 'sweetalert2-react-content'
import api from "../../utils/Api"
import { useAuth } from "../../auth/useAuth"
import { usePaciente } from "../../context/PacienteContext"
import LoadingOverlay from "../../components/LoadingOverlay"

const ListaUsuarios = () => {

    const [boletos, setBoletos] = useState([])
    const [searchVal, setSearchVal] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()
    const { saveIdPaciente, saveIdEmpresa } = usePaciente()
    const id_empresa = user?.user?.foundUser.id_empresa
    const router = useRouter()
    const status = {
        paid: "Pago",
        waiting: "Pendente",
        canceled: "Cancelado"
    }
    const coresStatus = {
        paid: "text-success",
        waiting: "text-warning",
        canceled: "text-danger",
    }

    useEffect(() => {
        getBoletos()
    }, [])


    const getBoletos = async () => {
        setIsLoading(true)
        await api.get(`/efi/listaBoletos?id_empresa=${id_empresa}`)
            .then(response => {
                console.log('response', response.data.data)
                setBoletos([...response.data.data])
            })
            .catch(function (error) {
                console.error(error)
            })
        setIsLoading(false)
    }

    const setVirgulaDecimal = e => {
        return String(e).replace(/(\d+)(\d{2})$/, "$1,$2")
    }

    const handleCancelaBoleto = async (id) => {
        await api.put(`efi/cancelaBoleto`, {
            id_empresa,
            id
        })
            .then(async (response) => {
                
            })
            .catch(error => {
                console.error(error)
            })
        router.refresh()
    }

    const filteredData = useMemo(() => {
        if (searchVal.trim() === '') {
            return boletos
        }
        return boletos.filter(dataItem => dataItem?.customer?.name?.toLowerCase().includes(searchVal.toLocaleLowerCase()))
    }, [boletos, searchVal])


    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (id) => {
        MySwal.fire({
            title: 'Deseja realmente cancelar o boleto?',
            showDenyButton: true,
            confirmButtonText: 'Cancelar Boleto',
            confirmButtonColor: '#EF4444',
            denyButtonText: `Voltar`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading(true)
                await handleCancelaBoleto(id)
                setIsLoading(false)
                Swal.fire('Cancelado!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
    }

    if (isLoading) return (<LoadingOverlay isLoading={isLoading} />)

    return (

        <div className="m-5 p-5  rounded-lg shadow-lg">
            <div className="mb-5 flex flex-row flex-wrap w-full justify-between items-center">
                <input type="text" onChange={e => setSearchVal(e.target.value)} className="form-input mr-4 rounded-lg text-gray-600" placeholder="Buscar Paciente" />
                <Link href="cadastroUsuarioInterno">
                    <button className="bg-green-600 hover:bg-green-500 rounded-lg p-2 text-white font-bold">
                        Sincronizar com EFI Bank
                    </button>
                </Link>
            </div>

            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="border rounded-lg shadow overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-purple-800 dark:bg-purple-700">
                                    <tr className="text-white text-left font-medium">
                                        <th scope="col" className="px-6 py-3">Nº</th>
                                        <th scope="col" className="px-6 py-3 ">Valor</th>
                                        <th scope="col" className="px-6 py-3">status</th>
                                        <th scope="col" className="px-6 py-3">Paciente</th>
                                        <th scope="col" className="px-6 py-3">Dt Vencimento</th>
                                        <th scope="col" className="px-6 py-3">Dt Pagamento</th>
                                        <th scope="col" className="px-6 py-3">Opções</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredData.map((data) => (
                                        <tr key={data.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data?.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">R$ {setVirgulaDecimal(data?.total)}</td>
                                            <td onClick={() => { }}
                                                className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${coresStatus[data?.status]}`}>{status[data?.status]}</td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.customer?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">
                                                {moment(data?.payment?.banking_billet?.expire_at).format("DD/MM/YYYY")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">
                                                {data?.payment?.paid_at && moment(data?.payment?.paid_at).format("DD/MM/YYYY")}
                                            </td>
                                            <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                                <a className="text-grey-800 hover:text-grey-900" title="Gerar Boleto" rel="noopener noreferrer" href="#"
                                                    onClick={() => {
                                                        window.open(data?.payment?.banking_billet?.link, '_blank')
                                                    }}
                                                >
                                                    <FaBarcode />
                                                </a>


                                                <a className="text-red-800 hover:text-red-900" title="Cancelar Pagamento" rel="noopener noreferrer" href="#"
                                                    onClick={() => {
                                                        showSwalWithLink(data?.id)
                                                    }}
                                                >
                                                    <ImCancelCircle />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ListaUsuarios
