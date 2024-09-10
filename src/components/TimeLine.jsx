import moment from "moment"
import { useState } from "react"
import { FaPencilAlt, FaTrash } from "react-icons/fa"
import CadastroEvolucoes from "./CadastroEvolucoes"
import api from "../utils/Api"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const TimeLine = ({ evolucoes, getEvolucoes }) => {
    const [showCadastroEvolucoes, setShowCadastroEvolucoes] = useState(false)
    const [dados, setDados] = useState()

    const editEvolucao = async (e) => {
        setDados(e)
        setShowCadastroEvolucoes(!showCadastroEvolucoes)
    }

    const toogleShowCadastroEvolucoes = () => {
        setDados({})
        setShowCadastroEvolucoes(!showCadastroEvolucoes)
    }

    const deleteEvolucao = async (e) => {
        await api.delete(`evolucao?id_evolucao=${e.id_evolucao}&id_empresa=${e.id_empresa}`)
            .then(response => {
                if(response.status === 204){
                    getEvolucoes()
                    Swal.fire("Excluído com")
                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (e) => {
        MySwal.fire({
            title: 'Deseja realmente excluir?',
            showDenyButton: true,
            confirmButtonText: 'Excluir',
            confirmButtonColor: '#EF4444',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                deleteEvolucao(e)
                Swal.fire('Excluído!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
    }

    return (
        <>
            <ol className="border-s border-neutral-300 dark:border-neutral-500">
                {evolucoes?.map((e) => (
                    <li>
                        <div className="flex-start flex items-center pt-3">
                            <div
                                className="-ms-[5px] me-3 h-[9px] w-[9px] rounded-full bg-neutral-300 dark:bg-neutral-500"></div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-300">{moment(e.updated_at).format("DD/MM/YYYY")}</p>
                        </div>
                        <div className="mb-6 ms-4 mt-2 border">
                            <div className="flex justify-end p-5" >
                                <button onClick={() => editEvolucao(e)}
                                    className="flex justify-center items-center bg-purple-500 hover:bg-purple-500 rounded-full w-10 h-10 text-white font-bold mb-5"
                                ><FaPencilAlt /></button>

                                <button onClick={() => showSwalWithLink(e)}
                                    className="flex justify-center items-center bg-red-500 hover:bg-red-500 rounded-full w-10 h-10 text-white font-bold mb-5"
                                ><FaTrash /></button>
                            </div>

                            <p className="mb-3 text-neutral-500 dark:text-neutral-300">{e.texto}</p>
                            <p><span className="mb-3 text-neutral-500 dark:text-neutral-300">Profissional: </span>{e.nome}</p>
                        </div>
                    </li>
                ))}
            </ol>
            <CadastroEvolucoes
                showCadastroEvolucoes={showCadastroEvolucoes}
                toogleShowCadastroEvolucoes={toogleShowCadastroEvolucoes}
                dados={dados}
                evolucao={dados}
                getEvolucoes={getEvolucoes}
            />
        </>
    )
}

export default TimeLine