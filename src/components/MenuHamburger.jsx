import { useState } from 'react'
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/useAuth';

const MenuHamburger = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [submenuStyle, setSubmenuStyle] = useState('hidden')
    const router = useRouter()
    const { logout } = useAuth()
    const menuItems = [
        { name: 'Agenda', link: '/agenda' },
        { name: 'Paciente', link: '/paciente/listaPacientes' },
        { name: 'Financeiro', link: '/financeiro' },
        { name: 'Opções', link: '/opcoes/usuario/listaUsuarios' }
    ]
    const subMenuItems = [
        { name: 'Usuário', link: '/opcoes/usuario/listaUsuarios' },
        { name: 'Nível Acesso', link: '/opcoes/nivelAcesso/listaNivelAcesso' },
        { name: 'Credenciais Boleto', link: '/opcoes/boleto/credenciais' },
        { name: 'Empresa', link: '/opcoes/empresa' },
    ]


    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const openSubmenu = () => {
        setSubmenuStyle('display')
    }

    const handleClick = (item) => {
        if (item.name === 'Opções') {
            openSubmenu()
            return
        }

        handleNavegate(item.link)
        setIsOpen(!isOpen)
    }

    const handleNavegate = (link) => {
        router.push(link)
    }

    const handleLogout = () => {
        logout()
        router.push("/login")
    }


    return (
        <nav className="block md:hidden bg-purple-800  w-full border-inherit">
            <div className="flex items-center justify-between p-3">
                <button
                    className="text-white focus:outline-none md:hidden"
                    onClick={toggleMenu}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <div className="text-white text-xl">OdonTIC</div>
            </div>
            <div className={`z-40 bg-purple-800 fixed left-0 items-start p-3 flex flex-col  transition duration-500 ease-in-out overflow-hidden ${isOpen ? 'h-screen w-4/5 opacity-100' : 'h-0 w-0 opacity-0'}`}>
                {menuItems.map((item) => (
                    <div onClick={() => handleClick(item)} className="block mt-2 md:inline-block md:mt-0 text-xl text-gray-200 hover:text-white mr-4">{item.name}
                        {item.link === '/opcoes/usuario/listaUsuarios' &&
                            <ul className={`ml-10 text-xl text-gray-200 hover:text-white ${submenuStyle}`}>
                                {subMenuItems.map(e => (
                                    <li onClick={() => handleClick(e)}>{e.name}</li>
                                ))}
                            </ul>
                        }
                    </div>
                ))}
                <div
                    onClick={handleLogout}
                    className="block mt-2 text-xl md:inline-block md:mt-0 text-gray-200 hover:text-white mr-4 pt-10"
                >Sair</div>
            </div>
        </nav>
    )
}

export default MenuHamburger