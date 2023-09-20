import React from "react"
import { FiSettings, FiHelpCircle, FiPhone } from "react-icons/fi"

const Header = () => {
    return (
        <div className='flex items-center justify-between px-4 pt-4 pb-4 font-bold text-gray-600 text-white bg-purple-800 rounded-lg m-1'>
            <h2 className="text-3xl">OdonTIC</h2>
            <div className="flex gap-4 items-center text-lg text-white">
                <FiPhone className="cursor-pointer"/>
                <FiHelpCircle className="cursor-pointer"/>
                <FiSettings className="cursor-pointer"/>
                <h2>Bem-vindo, José Carlos</h2>
            </div>
        </div>
    )
}

export default Header