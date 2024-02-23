import React, { useEffect, useState } from "react"
import Select from "react-select";

const Pagamento = () => {

    const [formaPagamento, setFormaPagamento] = useState([
        { label: "Dinheiro", value: 1 },
        { label: "Transferência ou PIX", value: 2 },
        { label: "Cartão de crédito", value: 3 },
        { label: "Cartão de débito", value: 4 },
        { label: "outro", value: 1 },
    ])
    const [parcelas, setParcelas] = useState([
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
        { label: 6, value: 6 },
        { label: 7, value: 7 },
        { label: 8, value: 8 },
        { label: 9, value: 9 },
        { label: 10, value: 10 },
        { label: 11, value: 11 },
        { label: 12, value: 12 },
    ])
    const [selectedPagamento, setSelectedPagamento] = useState(0)

    // Initialization for ES Users

    useEffect(() => {
        const init = async () => {
            const { Collapse, initTE } =
                await import("tw-elements");
            initTE({
                Collapse,
                initTE,
            });
        };
        init();
    })

    return (
        <div>
            <h1 className='text-gray-500'>Forma de pagamento:</h1>
            <Select
                className="text-gray-500 w-6/12"
                name="paciente"
                options={formaPagamento}
                placeholder="Profissional"
                onChange={(e) => {
                    setSelectedPagamento(e.value)
                }}
            />

            <div className="w-full md:w-6/12 pt-3">
                <ul
                    className="items-center w-full text-sm font-medium text-gray-900 bg-white  rounded-lg sm:flex"
                    name="status"
                // onChange={updateField}
                >
                    <li className="w-full">
                        <div className="flex items-center pl-3">
                            <input
                                id="status1"
                                type="radio"
                                value="1"
                                name="status"
                                className="w-4 h-4"
                            />
                            <label
                                for="status1"
                                className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                Porcentagem (%)
                            </label>
                        </div>
                    </li>
                    <li className="w-full">
                        <div className="flex items-center pl-3">
                            <input
                                id="status2"
                                type="radio"
                                value="2"
                                name="status"
                                className="w-4 h-4"
                            />
                            <label
                                for="status2"
                                className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                Real(R$)
                            </label>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="w-full md:w-6/12 pt-3">
                <label className="text-gray-500 ">Valor</label>
                <input type="number" id="desconto" name="desconto" onChange={() => { }} className="form-input rounded-lg text-gray-500 w-full" />
            </div>

            <div className="flex w-full gap-3">
                <div className="w-6/12 pt-3">
                    <label className="text-gray-500 ">Quantidade de Parcelas</label>
                    <Select
                        className="text-gray-500 w-full"
                        name="paciente"
                        options={parcelas}
                        placeholder="Parcelas"
                        onChange={(e) => {
                            setSelectedPagamento(e.value)
                        }}
                    />
                </div>

                <div className="w-6/12 pt-3">
                    <label className="text-gray-500 ">Data do 1º vencimento</label>
                    <input type="text" id="desconto" name="desconto" onChange={() => { }} className="form-input rounded-lg text-gray-500 w-full" />
                </div>

            </div>

            <div className="flex w-full gap-3">
                <div className="w-6/12 pt-3">
                    <label className="text-gray-500 ">Entrada</label>
                    <input type="text" id="desconto" name="desconto" onChange={() => { }} className="form-input rounded-lg text-gray-500 w-full" />
                </div>

                <div className="w-6/12 pt-3">
                    <label className="text-gray-500 ">Data do pagamento</label>
                    <input type="text" id="desconto" name="desconto" onChange={() => { }} className="form-input rounded-lg text-gray-500 w-full" />
                </div>

            </div>


            <div id="accordionExample5">
                <div
                    class="rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                    <h2 class="mb-0" id="headingOne5">
                        <button
                            class="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-primary [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:[&:not([data-te-collapse-collapsed])]:bg-neutral-800 dark:[&:not([data-te-collapse-collapsed])]:text-primary-400 dark:[&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]"
                            type="button"
                            data-te-collapse-init
                            data-te-target="#collapseOne5"
                            aria-expanded="true"
                            aria-controls="collapseOne5">
                            Accordion Item #1
                            <span
                                class="-mr-1 ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="h-6 w-6">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </button>
                    </h2>
                    <div
                        id="collapseOne5"
                        class="!visible"
                        data-te-collapse-item
                        data-te-collapse-show
                        aria-labelledby="headingOne5">
                        <div class="px-5 py-4">
                            <strong>This is the first item's accordion body.</strong> It is
                            shown by default, until the collapse plugin adds the appropriate
                            classes that we use to style each element. These classes control
                            the overall appearance, as well as the showing and hiding via CSS
                            transitions. You can modify any of this with custom CSS or
                            overriding our default variables. It's also worth noting that just
                            about any HTML can go within the <code>.accordion-body</code>,
                            though the transition does limit overflow.
                        </div>
                    </div>
                </div>
                <div
                    class="border border-t-0 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                    <h2 class="mb-0" id="headingTwo5">
                        <button
                            class="group relative flex w-full items-center rounded-none border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-primary [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:[&:not([data-te-collapse-collapsed])]:bg-neutral-800 dark:[&:not([data-te-collapse-collapsed])]:text-primary-400 dark:[&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]"
                            type="button"
                            data-te-collapse-init
                            data-te-collapse-collapsed
                            data-te-target="#collapseTwo5"
                            aria-expanded="false"
                            aria-controls="collapseTwo5">
                            Accordion Item #2
                            <span
                                class="-mr-1 ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="h-6 w-6">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </button>
                    </h2>
                    <div
                        id="collapseTwo5"
                        class="!visible hidden"
                        data-te-collapse-item
                        aria-labelledby="headingTwo5">
                        <div class="px-5 py-4">
                            <strong>This is the second item's accordion body.</strong> It is
                            hidden by default, until the collapse plugin adds the appropriate
                            classes that we use to style each element. These classes control
                            the overall appearance, as well as the showing and hiding via CSS
                            transitions. You can modify any of this with custom CSS or
                            overriding our default variables. It's also worth noting that just
                            about any HTML can go within the <code>.accordion-body</code>,
                            though the transition does limit overflow.
                        </div>
                    </div>
                </div>
                <div
                    class="rounded-b-lg border border-t-0 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                    <h2 class="mb-0" id="headingThree5">
                        <button
                            class="group relative flex w-full items-center border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-primary [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:[&:not([data-te-collapse-collapsed])]:bg-neutral-800 dark:[&:not([data-te-collapse-collapsed])]:text-primary-400 dark:[&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(75,85,99)] [&[data-te-collapse-collapsed]]:rounded-b-[15px] [&[data-te-collapse-collapsed]]:transition-none"
                            type="button"
                            data-te-collapse-init
                            data-te-collapse-collapsed
                            data-te-target="#collapseThree5"
                            aria-expanded="false"
                            aria-controls="collapseThree5">
                            Accordion Item #3
                            <span
                                class="-mr-1 ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="h-6 w-6">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </button>
                    </h2>
                    <div
                        id="collapseThree5"
                        class="!visible hidden"
                        data-te-collapse-item
                        aria-labelledby="headingThree5">
                        <div class="px-5 py-4">
                            <strong>This is the third item's accordion body.</strong> It is
                            hidden by default, until the collapse plugin adds the appropriate
                            classes that we use to style each element. These classes control
                            the overall appearance, as well as the showing and hiding via CSS
                            transitions. You can modify any of this with custom CSS or
                            overriding our default variables. It's also worth noting that just
                            about any HTML can go within the <code>.accordion-body</code>,
                            though the transition does limit overflow.
                        </div>
                    </div>
                </div>
            </div>


        </div>


    );
};

export default Pagamento;