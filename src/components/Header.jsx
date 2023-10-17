import React, { useEffect } from "react"
import { FiSettings, FiHelpCircle, FiPhone } from "react-icons/fi"
import UseAuth from "../auth/useAuth";
import { useRouter } from 'next/navigation'

const Header = () => {
    const router = new useRouter()

    useEffect(() => {
        const init = async () => {
            const {
                Dropdown,
                Ripple,
                initTE,
            } = await import("tw-elements");
            initTE({
                Dropdown,
                Ripple
            });
        };
        init();
    }, [])

    return (
        <div className='flex items-center justify-between px-4 pt-4 pb-4 font-bold text-gray-600 text-white bg-purple-800 rounded-lg m-1'>
            <h2 className="text-3xl">OdonTIC</h2>
            <div className="flex gap-4 items-center text-lg text-white">
                <FiPhone className="cursor-pointer" />
                <FiHelpCircle className="cursor-pointer" />
                <FiSettings className="cursor-pointer" />
                <span
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                        UseAuth.logout()
                        router.push("/login")
                    }}
                >
                    Sair
                </span>
                {/* <DropMenu /> */}
                {/* <h2>Bem-vindo, José Carlos</h2> */}
            </div>
        </div>
    )
}

const DropMenu = () => {
    return (
        <div className="relative" data-te-dropdown-ref>
            <button
                className="flex items-center whitespace-nowrap rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] motion-reduce:transition-none dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                type="button"
                id="dropdownMenuButton1"
                data-te-dropdown-toggle-ref
                aria-expanded="false"
                data-te-ripple-init
                data-te-ripple-color="light">
                Dropdown button
                <span className="ml-2 w-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5">
                        <path
                            fill-rule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clip-rule="evenodd" />
                    </svg>
                </span>
            </button>
            <ul
                className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
                aria-labelledby="dropdownMenuButton1"
                data-te-dropdown-menu-ref>
                <li>
                    <a
                        className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                        href="#"
                        data-te-dropdown-item-ref
                    >Action</a
                    >
                </li>
                <li>
                    <a
                        className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                        href="#"
                        data-te-dropdown-item-ref
                    >Another action</a
                    >
                </li>
                <li>
                    <a
                        className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                        href="#"
                        data-te-dropdown-item-ref
                    >Something else here</a
                    >
                </li>
            </ul>
        </div>
    )
}

export default Header