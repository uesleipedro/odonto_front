import React, { useEffect } from "react"
import ListaProcedimento from "./listaProcedimento"

const fichaClinica = () => {

    useEffect(() => {
        const init = async () => {
            const { Input, initTE, Tab } = await import("tw-elements");
            initTE({ Input, Tab });
        };
        init();
    }, [])


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
                            Ueslei Pedro Rangel
                        </h2>

                        <div className="flex flex-wrap">
                            <div className="mb-4 w-full md:w-4/12">
                                <p className="font-bold">Telefone:</p>
                                <p> (61)9999-99999</p>
                            </div>
                            <div className="mb-4 w-full md:w-4/12">
                                <p className="font-bold">email:</p>
                                <p>teste@teste.com</p>
                            </div>
                            <div className="mb-4 w-full md:w-4/12">
                                <p className="font-bold">Idade:</p>
                                <p>32</p>
                            </div>
                            <div className="mb-4 w-full md:w-4/12">
                                <p className="font-bold">Paciente desde:</p>
                                <p> 04/06/2023</p>
                            </div>
                            <div className="mb-4 w-full md:w-4/12">
                                <p className="font-bold">Dentista responsável:</p>
                                <p>Dr. Estranho</p>
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
                    >Procedimento</a
                    >
                </li>
                <li role="presentation">
                    <a
                        href="#tabs-profile"
                        className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                        data-te-toggle="pill"
                        data-te-target="#tabs-profile"
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
                    <ListaProcedimento />
                </div>
                <div
                    className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="tabs-profile"
                    role="tabpanel"
                    aria-labelledby="tabs-profile-tab">
                    Tab 2 content
                </div>
                {/* <div
                    className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="tabs-messages"
                    role="tabpanel"
                    aria-labelledby="tabs-profile-tab">
                    Tab 3 content
                </div>
                <div
                    className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="tabs-contact"
                    role="tabpanel"
                    aria-labelledby="tabs-contact-tab">
                    Tab 4 content
                </div> */}
            </div>

        </section >
    )
}

export default fichaClinica