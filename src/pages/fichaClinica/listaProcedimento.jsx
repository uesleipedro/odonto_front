import React, { useState, useContext } from "react"
import { FaTrashAlt } from "react-icons/fa"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import api from "../../utils/Api"
import { FichaClinicaContext } from "../../context/FichaClinicaContext"
import moment from 'moment'
import Toast from "../../components/Toast"
import LoadingOverlay from "../../components/LoadingOverlay"
import CadastroProcedimento from "../../components/CadastroProcedimento"

const ListaProcedimento = ({ id_paciente }) => {
    const { procedimento, loading, getProcedimentoList } = useContext(FichaClinicaContext)
    const [toggleInsertUpdate, setToggleInsertUpdate] = useState('insert')
    const [post, setPost] = useState({})
    const [showToast, setShowToast] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [show, setShow] = useState(false)

    const updateProcedimento = async (id_procedimento) => {
        let procedimentoFiltrado = await procedimento.filter(dataItem => dataItem.id_procedimento === id_procedimento)
        setPost(procedimentoFiltrado[0])
        toogleShow()
    }

    const handleDeleteProcedimento = async (id_procedimento) => {
        await api.delete(`procedimento/${id_procedimento}`)
            .then(response => {
                if (response.status === 204)
                    return
            })
            .catch(error => {
                console.error(error);
            })
        await getProcedimentoList()
    }

    const toogleShow = () => {
        setShow(!show)
    }

    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (id_procedimento) => {
        MySwal.fire({
            title: 'Deseja realmente excluir?',
            showDenyButton: true,
            confirmButtonText: 'Excluir',
            confirmButtonColor: '#EF4444',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteProcedimento(id_procedimento)
                Swal.fire('Excluído!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
    }

    return (
        <div className=" p-5  rounded-lg shadow-lg">
            <div className="mb-5 flex flex-row flex-wrap w-full justify-between items-center">
                <button onClick={() => {
                    setPost({
                        face_dente: '',
                        estado: 'A realizar',
                        adicionado: moment(Date()).format('YYYY-MM-DD'),
                        id_paciente: Number(id_paciente),
                        preco: "R$ 0,00"
                    })
                    setToggleInsertUpdate('insert')
                    toogleShow()
                }} className="bg-purple-800 hover:bg-purple-500 rounded-lg p-2 text-white font-bold">
                    Novo procedimento
                </button>

            </div>

            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="border rounded-lg shadow overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-purple-800 dark:bg-purple-700">
                                    <tr className="text-white text-left font-medium">
                                        <th scope="col" className="px-6 py-3">Adicionado</th>
                                        <th scope="col" className="px-6 py-3 ">Dente</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Procedimento</th>
                                        <th scope="col" className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {loading ? <p>Loading...</p> : procedimento?.map((data) => (
                                        <tr key={data.id_procedimento} className="cursor-pointer">
                                            <td onClick={async () => {
                                                setToggleInsertUpdate('update')
                                                await updateProcedimento(data.id_procedimento)
                                            }}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{moment(data.adicionado).format('DD/MM/YYYY')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.dente}{data.face_dente}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.estado}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.procedimento}</td>
                                            <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                                <a className="text-purple-800 hover:text-purple-900" href="#"
                                                    onClick={() => showSwalWithLink(data.id_procedimento)}
                                                >
                                                    <FaTrashAlt />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Toast
                    message="Procedimento salvo com sucesso!"
                    show={showToast}
                    onClose={() => setShowToast(false)}
                />

                <LoadingOverlay isLoading={isLoading} />
            </div>

            <CadastroProcedimento
                show={show}
                toogleShow={toogleShow}
                id_paciente={id_paciente}
                dadosProcedimento={post}
                insertUpdate={toggleInsertUpdate}
            />
        </div >
    )
}

export default ListaProcedimento
