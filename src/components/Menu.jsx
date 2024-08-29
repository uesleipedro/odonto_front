import React, { useState } from 'react'
import Link from "next/link"
import { RxCalendar } from "react-icons/rx"
import { FiSettings } from "react-icons/fi"
import { HiUserGroup } from "react-icons/hi"
import { FaRegMoneyBillAlt } from "react-icons/fa"

const Menu = () => {
    const [selectedItem, setSelectedItem] = useState('/')

    const menuItems = [
        { name: 'Agenda', icon: <RxCalendar size={20} />, link: '/agenda' },
        { name: 'Paciente', icon: <HiUserGroup size={20} />, link: '/paciente/listaPacientes' },
        { name: 'Financeiro', icon: <FaRegMoneyBillAlt size={20} />, link: '/financeiro' },
        { name: 'Opções', icon: <FiSettings size={20} />, link: '/usuario/listaUsuarios' }
    ]

    const handleItemClick = (name) => {
        setSelectedItem(name)
    }

    const style = "flex flex-col pl-1 pr-1 items-center transition font-bold delay-100 hover:text-purple-800 hover:bg-white cursor-pointer my-4 inline-block"
    return (
        <>
            {
                menuItems.map((item, index) => (
                    <Link href={item.link}>
                        <div
                            key={index}
                            onClick={() => handleItemClick(item.name)}
                            className={
                                item.name === selectedItem
                                    ? style + ' text-purple-800 bg-white'
                                    : style + ' text-white'
                            }
                        >
                            {item.icon}
                            <span className="text-sm">{item.name}</span>
                        </div>
                    </Link>
                ))
            }
        </>
    )
}

export default Menu