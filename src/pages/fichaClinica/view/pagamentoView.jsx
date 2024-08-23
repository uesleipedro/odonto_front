import { react, useState, useEffect } from 'react'
import { formatarMoedaBRL } from '../../../utils/mask';
import moment from 'moment';

const PagamentoView = ({ dados, toogleViewPagamento, showViewPagamento }) => {

    useEffect(() => {
        const init = async () => {
            const { Modal, initTE, Ripple } = await import("tw-elements");
            initTE({ Modal, Ripple });
        };
        init()
    }, [])

    function handlePrint() {
        window.print()
    }

    if (!showViewPagamento) return null

    return (
        <div
            data-te-modal-init
            className="fixed left-0 top-0 z-[1055] block h-full w-full overflow-y-auto overflow-x-hidden outline-none bg-black/[.4]"
            id="exampleModalVarying"
            tabindex="-1"
            aria-labelledby="exampleModalVaryingLabel"
        >
            <div
                data-te-modal-dialog-ref
                className=" pointer-events-none relative w-auto opacity-100 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:my-7 min-[576px]:max-w-[500px]"
            >
                <div className=" block min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
                    <div className="bg-purple-600 flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                        <h5
                            className="text-white text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                            id="exampleModalVaryingLabel"
                        >
                            Dados do Pagamento
                        </h5>
                        <button
                            type="button"
                            className="text-white box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                            data-te-modal-dismiss
                            aria-label="Close"
                            onClick={toogleViewPagamento}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="relative flex-auto p-4" data-te-modal-body-ref>
                        <p><strong>Nº Pagamento:</strong> {dados?.id_pagamento}</p>
                        <p><strong>Nº Parcela:</strong> {dados?.nr_parcela}</p>
                        <p><strong>Data de vencimento:</strong> {moment(dados?.dt_vencimento).format("DD/MM/YYYY")}</p>
                        <p><strong>Data de recebimento:</strong> {moment(dados?.dt_recebimento).format("DD/MM/YYYY")}</p>
                        <p><strong>Status: {dados?.status}</strong></p>
                        <p><strong>Valor:</strong> {formatarMoedaBRL(dados?.valor)}</p>
                    </div>
                    <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                        <button
                            type="button"
                            className="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-red-accent-100 focus:bg-red-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                            data-te-modal-dismiss
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            onClick={toogleViewPagamento}
                        >
                            Fechar
                        </button>
                        {/* <button
                            type="button"
                            className="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-red-accent-100 focus:bg-red-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                            data-te-modal-dismiss
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            onClick={handlePrint}
                        >
                            Emprimir
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PagamentoView
