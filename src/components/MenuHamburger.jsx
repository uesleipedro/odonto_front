import { useState } from 'react'
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/useAuth';

const MenuHamburger = () => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const { logout, user } = useAuth()

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const menuItems = [
        { name: 'Agenda', link: '/agenda' },
        { name: 'Paciente', link: '/paciente/listaPacientes' },
        { name: 'Financeiro', link: '/financeiro' },
        { name: 'Opções', link: '/usuario/listaUsuarios' }
    ]

    return (
        <nav className="block md:hidden bg-purple-800 p-4 mt-1 w-full rounded-lg border-inherit">
            <div className="flex items-center justify-between">
                <div className="text-white text-xl">OdonTIC</div>
                <button
                    className="text-white focus:outline-none md:hidden"
                    onClick={toggleMenu}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
            <div className={`mt-2 md:flex md:items-center flex flex-col items-center justify-center transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                {menuItems.map((item, index) => (
                    <Link
                        href={item.link}
                        onClick={() => setIsOpen(false)}>
                        <div className="block mt-2 md:inline-block md:mt-0 text-gray-200 hover:text-white mr-4">{item.name}</div>
                    </Link>
                ))}
                <div
                    onClick={() => {
                        logout()
                        router.push("/login")
                    }}
                    className="block mt-2 md:inline-block md:mt-0 text-gray-200 hover:text-white mr-4 pt-10"
                >Sair</div>
            </div>
        </nav>
    );
};

export default MenuHamburger