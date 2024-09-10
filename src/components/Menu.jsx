import { RxCalendar } from "react-icons/rx"
import { FiSettings } from "react-icons/fi"
import { HiUserGroup } from "react-icons/hi"
import { FaRegMoneyBillAlt } from "react-icons/fa"
import { usePathname, useRouter } from 'next/navigation'

const Menu = () => {
    const pathname = usePathname()
    const router = new useRouter()
    const menuItems = [
        { name: 'Agenda', icon: <RxCalendar size={20} />, link: '/agenda' },
        { name: 'Paciente', icon: <HiUserGroup size={20} />, link: '/paciente/listaPacientes' },
        { name: 'Financeiro', icon: <FaRegMoneyBillAlt size={20} />, link: '/financeiro' },
        { name: 'Opções', icon: <FiSettings size={20} />, link: '/opcoes/usuario/listaUsuarios' }
    ]

    const handleNavigate = (link) => {
        router.push(link)
    }

    const style = "flex flex-col pl-1 pr-1 items-center transition font-bold delay-100 hover:text-purple-800 hover:bg-white cursor-pointer my-4 inline-block"
    return (
        <>
            {
                menuItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleNavigate(item.link)}
                        className={
                            item.link.startsWith(pathname)
                                ? style + ' text-purple-800 bg-white'
                                : style + ' text-white'
                        }
                    >
                        {item.icon}
                        <span className="text-sm">{item.name}</span>
                    </div>
                ))
            }
        </>
    )
}

export default Menu