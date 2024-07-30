"use client"

import { useEffect, useState, useContext } from "react"
import ListaProcedimento from "../listaProcedimento"
import ListaOrcamento from "../listaOrcamento"
import ListaPagamento from "../listaPagamento"
import CadastroAnamnese from "../cadastroAnamnese"
import { useRouter } from 'next/router'
import { useRouter as uR } from 'next/navigation'
import api from "../../utils/Api"
import moment from "moment"
import { FichaClinicaProvider, FichaClinicaContext } from '../../context/FichaClinicaContext'
import { usePaciente } from '../../context/PacienteContext'
import LoadingOverlay from '../../components/LoadingOverlay'

const PacienteProfile = () => {
    const router = useRouter();

    const [paciente, setPaciente] = useState({})
    const [isLoading, setIsloading] = useState(true)
    const { procedimento, loading, getProcedimentoList } = useContext(FichaClinicaContext)
    const { idPaciente, idEmpresa } = usePaciente()

    useEffect(() => {
        const init = async () => {
            const { Datepicker, Input, initTE, Modal, Ripple, TEToast, Tab } = await import("tw-elements");
            initTE({ Datepicker, Input, Modal, Ripple, TEToast, Tab });
        };
        init();
    }, [])

    useEffect(() => {
        getPaciente()
    }, [])

    useEffect(() => {
        console.log("paciente",paciente)

    },[paciente])

    const getPaciente = async () => {
        setIsloading(true)
        await api.get(`paciente/one/${idPaciente}/${idEmpresa}`)
            .then(response => {
                setPaciente(response.data)
            })
            .catch(function (error) {
                console.error(error);
            })
        setIsloading(false)
    }

    return (
        <section
            className="w-full rounded-md text-center shadow-lg md:p-5 md:text-left"
        >
            <LoadingOverlay isLoading={isLoading} />

            <div className="md:flex md:flex-row block rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800 dark:shadow-black/20">
                <div className="w-full shrink-0 grow-0 basis-auto ">
                    <div className="px-2 py-2 md:px-2">
                        <h2 className="pb-2 text-3xl font-bold">
                            {paciente?.nome}
                        </h2>

                        <div className="flex flex-wrap">
                            <div className="mb-4 w-full md:w-4/12">
                                <p className="font-bold">Telefone:</p>
                                <p> {paciente?.telefone_movel}</p>
                            </div>
                            <div className="mb-4 w-full md:w-4/12">
                                <p className="font-bold">email:</p>
                                <p>{paciente?.email}</p>
                            </div>
                            <div className="mb-4 w-full md:w-4/12">
                                <p className="font-bold">Idade:</p>
                                <p>{moment(new Date).diff(paciente?.dt_nascimento, "years")}</p>
                            </div>
                            <div className="mb-4 w-full md:w-4/12">
                                <p className="font-bold">Paciente desde:</p>
                                <p> {moment(paciente?.inserted_at).format("DD/MM/YYYY")} </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ul
                className="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
                role="tablist"
                data-te-nav-ref>
                <li role="presentation">
                    <a
                        href="#tabs-procedimento"
                        className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                        data-te-toggle="pill"
                        data-te-target="#tabs-procedimento"
                        data-te-nav-active
                        role="tab"
                        aria-controls="tabs-procedimento"
                        aria-selected="true"
                    >Procedimento</a>
                </li>
                <li role="presentation">
                    <a
                        href="#tabs-financeiro"
                        className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                        data-te-toggle="pill"
                        data-te-target="#tabs-financeiro"
                        role="tab"
                        aria-controls="tabs-profile"
                        aria-selected="false"
                    >Financeiro</a
                    >
                </li>
                <li role="presentation">
                    <a
                        href="#tabs-anamnese"
                        className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                        data-te-toggle="pill"
                        data-te-target="#tabs-anamnese"
                        role="tab"
                        aria-controls="tabs-anamnese"
                        aria-selected="false"
                    >Anamnese</a
                    >
                </li>
            </ul>

            <div className="mb-6">
                <div
                    className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="tabs-procedimento"
                    role="tabpanel"
                    aria-labelledby="tabs-home-tab"
                    data-te-tab-active>
                    <ListaProcedimento
                        id_paciente={idPaciente}
                        procedimento={procedimento}
                        loading={loading}
                        getProcedimentoList={getProcedimentoList}
                    />
                </div>
                <div
                    className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="tabs-financeiro"
                    role="tabpanel"
                    aria-labelledby="tabs-financeiro-tab">

                    <ul
                        className="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
                        role="tablist"
                        data-te-nav-ref>
                        <li role="presentation">
                            <a
                                href="#tabs-orcamento"
                                className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                                data-te-toggle="pill"
                                data-te-target="#tabs-orcamento"
                                data-te-nav-active
                                role="tab"
                                aria-controls="tabs-orcamento"
                                aria-selected="true"
                            >Orçamento</a>
                        </li>
                        <li role="presentation">
                            <a
                                href="#tabs-pagamento"
                                className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                                data-te-toggle="pill"
                                data-te-target="#tabs-pagamento"
                                role="tab"
                                aria-controls="tabs-pagamento"
                                aria-selected="false"
                            >Pagamento</a
                            >
                        </li>
                    </ul>
                    <div className="mb-6">
                        <div
                            className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                            id="tabs-orcamento"
                            role="tabpanel"
                            aria-labelledby="tabs-orcamento-tab"
                            data-te-tab-active>
                            <ListaOrcamento id_paciente={idPaciente} id_empresa={idEmpresa} />
                        </div>
                        <div
                            className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                            id="tabs-pagamento"
                            role="tabpanel"
                            aria-labelledby="tabs-pagamento-tab">
                            <ListaPagamento id_paciente={idPaciente} />
                        </div>
                    </div>

                </div>

                <div
                    className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="tabs-anamnese"
                    role="tabpanel"
                    aria-labelledby="tabs-anamnese-tab"
                >
                    <CadastroAnamnese id_paciente={idPaciente} />
                </div>

            </div>

        </section >
    )
}

export default PacienteProfile
