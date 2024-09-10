import React, { useState, useContext, useEffect } from "react"
import { FaTrashAlt } from "react-icons/fa"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import api from "../../utils/Api"
import { FichaClinicaContext } from "../../context/FichaClinicaContext"
import moment from 'moment'
import Toast from "../../components/Toast"
import LoadingOverlay from "../../components/LoadingOverlay"
import CadastroProcedimento from "../../components/CadastroProcedimento"
import TeethDiagram from "../../components/TeethDiagram"
import CadastroEvolucoes from "../../components/CadastroEvolucoes"
import { useAuth } from '../../auth/useAuth'
import TimeLine from "../../components/TimeLine"

const ListaProcedimento = ({ id_paciente, id_empresa }) => {
    const { procedimento, loading, getProcedimentoList } = useContext(FichaClinicaContext)
    const [toggleInsertUpdate, setToggleInsertUpdate] = useState('insert')
    const [post, setPost] = useState({})
    const [showToast, setShowToast] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [showCadastroEvolucoes, setShowCadastroEvolucoes] = useState(false)
    const { user } = useAuth()
    const id_user = user?.user?.foundUser.id_user
    const [evolucoes, setEvolucoes] = useState()
    const [evolucao, setEvolucao] = useState()
    const [listaDentesComProcedimento, setListaDentesComProcedimento] = useState()

    useEffect(() => {
        getEvolucoes()
        getDentesComProcedimento()
    }, [])

    const getDentesComProcedimento = async () => {
        await api.get(`dentes/dentesComProcedimento?id_paciente=${id_paciente}&id_empresa=${id_empresa}`)
            .then(response => {
                setListaDentesComProcedimento(response.data[0]?.dentes)
            })
    }

    const getEvolucoes = async () => {
        await api.get(`evolucao?id_empresa=${id_empresa}&id_paciente=${id_paciente}`)
            .then(response => {
                setEvolucoes([...response.data])
            })
    }

    const updateProcedimento = async (id_procedimento) => {
        let procedimentoFiltrado = await procedimento.filter(dataItem => dataItem.id_procedimento === id_procedimento)
        setPost(procedimentoFiltrado[0])
        toogleShow()
    }

    const setTooth = async (numero_dente) => {
        setToggleInsertUpdate('insert')
        setPost({
            dente: numero_dente,
            face_dente: '',
            estado: 'A realizar',
            adicionado: moment(Date()).format('YYYY-MM-DD'),
            id_paciente: Number(id_paciente),
            preco: "R$ 0,00"
        })
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

    const toogleShowCadastroEvolucoes = (dados) => {
        setEvolucao(dados)
        if (!dados) setEvolucao(null)
        setShowCadastroEvolucoes(!showCadastroEvolucoes)

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
            <div className="inline-grid grid-cols-1 md:grid-cols-2 gap-4 wrapp w-full">
                <div>
                    <div className="mb-5 flex flex-row flex-wrap justify-between items-center">
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
                    <div className="pt-5 pl-5 pr-5">
                        <TeethDiagram
                            setTooth={setTooth}
                            id_paciente={id_paciente}
                            id_empresa={id_empresa}
                            listaDentesComProcedimento={listaDentesComProcedimento}
                        />
                    </div>
                </div>
                <div className="w-full">
                    <h2 className="pb-1 pt-2 text-2xl font-bold">
                        Evolução
                    </h2>
                    <div className="flex flex-col justify-center">
                        {/* <p className="p-4">O paciente não possui evoluções adicionadas.</p> */}
                        <button onClick={() => toogleShowCadastroEvolucoes(null)}
                            className="bg-purple-800 hover:bg-purple-500 rounded-full w-10 h-10 text-white font-bold mb-5"
                        >+</button>
                        <div className=" pl-5 border rounded-lg shadow overflow-scroll max-h-96">
                            <TimeLine evolucoes={evolucoes} getEvolucoes={getEvolucoes} />
                        </div>

                    </div>

                </div>
            </div>

            <div className="flex flex-col mt-10">
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

            <CadastroEvolucoes
                showCadastroEvolucoes={showCadastroEvolucoes}
                toogleShowCadastroEvolucoes={toogleShowCadastroEvolucoes}
                dados={{
                    id_paciente,
                    id_empresa,
                    id_user
                }}
                evolucao={evolucao}
                getEvolucoes={getEvolucoes}
            />

            <CadastroProcedimento
                show={show}
                toogleShow={toogleShow}
                id_paciente={id_paciente}
                dadosProcedimento={post}
                insertUpdate={toggleInsertUpdate}
                getDentesComProcedimento={getDentesComProcedimento}
            />
        </div >
    )
}

export default ListaProcedimento
