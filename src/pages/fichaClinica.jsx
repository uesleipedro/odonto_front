import React, { useEffect, useState } from "react"
import ListaProcedimento from "./listaProcedimento"
import ListaOrcamento from "./listaOrcamento";
import ListaPagamento from "./listaPagamento";
import { useRouter } from "next/router";
import api from "../utils/Api";

const fichaClinica = () => {
    const router = useRouter();
    const data = router.query;
    const [id_paciente, setId_paciente] = useState(data.id_paciente)
    const [paciente, setPaciente] = useState({})


    useEffect(() => {
        const init = async () => {
            const { Input, initTE, Tab } = await import("tw-elements");
            initTE({ Input, Tab });
        };
        init();
    }, [])

    useEffect(() => {
        const getPaciente = async () => {
            await api.get(`paciente/${id_paciente}`)
                .then(response => {
                    setPaciente(response.data)
                })
                .catch(function (error) {
                    console.error(error);
                })
        }
        getPaciente()
        console.log('paciente', paciente)
    }, []);


    return (
        <section
            className="w-full rounded-md text-center shadow-lg md:p-5 md:text-left"
        // style={{ background_image: url("https://tecdn.b-cdn.net/img/Photos/Others/background2.jpg") } 
        >
            <div className="md:flex md:flex-row block rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800 dark:shadow-black/20">
                {/* <div
                    className="mx-auto mb-6 flex w-36 items-center justify-center md:mx-0 md:w-96 lg:mb-0">
                    <img
                        src="https://tecdn.b-cdn.net/img/Photos/Avatars/img%20%2810%29.jpg"
                        className="rounded-full shadow-md dark:shadow-black/30"
                        alt="woman avatar" />
                </div> */}
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
                                <p>{paciente?.dt_nascimento}</p>
                            </div>
                            <div className="mb-4 w-full md:w-4/12">
                                <p className="font-bold">Paciente desde:</p>
                                <p> ... </p>
                            </div>
                            <div className="mb-4 w-full md:w-4/12">
                                <p className="font-bold">Dentista responsável:</p>
                                <p>...</p>
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
                {/* <li role="presentation">
                    <a
                        href="#tabs-messages"
                        className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                        data-te-toggle="pill"
                        data-te-target="#tabs-messages"
                        role="tab"
                        aria-controls="tabs-messages"
                        aria-selected="false"
                    >Messages</a
                    >
                </li>
                <li role="presentation">
                    <a
                        href="#tabs-contact"
                        className="disabled pointer-events-none my-2 block border-x-0 border-b-2 border-t-0 border-transparent bg-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-400 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent dark:text-neutral-600"
                        data-te-toggle="pill"
                        data-te-target="#tabs-contact"
                        role="tab"
                        aria-controls="tabs-contact"
                        aria-selected="false"
                    >Contact</a
                    >
                </li>*/}
            </ul>

            <div className="mb-6">
                <div
                    className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="tabs-procedimento"
                    role="tabpanel"
                    aria-labelledby="tabs-home-tab"
                    data-te-tab-active>
                    <ListaProcedimento id_paciente={id_paciente} />
                </div>
                <div
                    className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="tabs-financeiro"
                    role="tabpanel"
                    aria-labelledby="tabs-financeiro-tab">

                    {/* TESTE */}
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
                            <ListaOrcamento id_paciente={data.id_paciente} />
                        </div>
                        <div
                            className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                            id="tabs-pagamento"
                            role="tabpanel"
                            aria-labelledby="tabs-pagamento-tab">
                            <ListaPagamento id_paciente={data.id_paciente} />
                        </div>
                    </div>

                    {/* TESTE */}


                </div>
            </div>

        </section >
    )
}

export default fichaClinica