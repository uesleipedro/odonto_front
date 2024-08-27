import { useState } from "react"
import api from "../utils/Api"
import Swal from "sweetalert2"
import LoadingOverlay from "./LoadingOverlay"

const CadastroEvolucoes = ({ toogleShowCadastroEvolucoes, showCadastroEvolucoes, dados, getEvolucoes, evolucao }) => {

    if (!showCadastroEvolucoes) return

    const [texto, setTexto] = useState()
    const { id_paciente, id_empresa, id_user } = dados
    const [loading, setLoading] = useState(false)

    const saveEvolucao = async () => {
        api.post(`evolucao`, {
            id_paciente,
            texto,
            id_profissional: id_user,
            id_empresa
        }).then(response => {
            Swal.fire("Evolução salva com sucesso!")
        }).then(async () => {
            setLoading(true)
            await getEvolucoes()
            setLoading(false)
            toogleShowCadastroEvolucoes()
        })
    }

    return (
        <div
            data-te-modal-init
            className="fixed left-0 top-0 z-[1055] block h-full w-full overflow-y-auto overflow-x-hidden outline-none bg-black/[.8]"
            id="exampleModalVarying"
            tabindex="-1"
            aria-labelledby="exampleModalVaryingLabel"
        >
            <LoadingOverlay isLoading={loading} />
            <div
                data-te-modal-dialog-ref
                className=" pointer-events-none relative w-auto opacity-100 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:my-7 min-[576px]:max-w-[500px]">
                <div
                    className=" block min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
                    <div
                        className="bg-purple-600 flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                        <h5
                            className="text-white text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                            id="exampleModalVaryingLabel">
                            Evoluções
                        </h5>
                        <button
                            type="button"
                            className="text-white box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                            data-te-modal-dismiss
                            aria-label="Close"
                            onClick={() => toogleShowCadastroEvolucoes()}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="h-6 w-6">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="relative flex-auto p-4" data-te-modal-body-ref>
                        <form>
                            <div className="mb-3">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-900">Profissional</h3>
                                <input
                                    type="text"
                                    className="relative m-0 -mr-0.5 block w-full flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-400 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                                    id="message-text"
                                    value={'Admin'}
                                    name="profissional"
                                    disabled
                                />
                            </div>

                            <div className="mb-3">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Evolução</h3>
                                <textarea
                                    className="relative m-0 -mr-0.5 block w-full flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-400 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                                    id="message-text"
                                    onChange={e => setTexto(e.target.value)}
                                    name="observacao"
                                    value={evolucao?.texto}
                                ></textarea>
                            </div>
                        </form>
                    </div>
                    <div
                        className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">

                        <button
                            type="button"
                            className="inline-block rounded bg-purple-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                            data-te-modal-dismiss
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            onClick={() => toogleShowCadastroEvolucoes()}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="ml-1 inline-block rounded bg-purple-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            onClick={saveEvolucao}
                        >
                            Salvar Evolução
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CadastroEvolucoes