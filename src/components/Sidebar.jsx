import React from "react";
import Link from "next/link"
import Image from "next/image"
import { RxCalendar, RxDashboard, RxPerson } from "react-icons/rx"
import { FiSettings } from "react-icons/fi"
import { HiUserGroup } from "react-icons/hi"
import { FaRegMoneyBillAlt } from "react-icons/fa"

const Sidebar = ({ children }) => {
	return (
		<div className="flex border-inherit">
			<div className="w-20 m-1 h-screen pt-4 mt-2 bg-purple-800 rounded-lg flex flex-col justify-between border-inherit">
				<div className="flex flex-col">
					<Link href="/agenda">
						<div className="flex flex-col ml-2 items-center text-white hover:text-purple-800 hover:bg-white cursor-pointer my-4 rounded-l-lg inline-block">
							<RxCalendar size={30} />
							<span className="text-sm">Agenda</span>
						</div>
					</Link>
					<Link href="/listaPacientes">
						<div className="flex flex-col ml-2 pr-1 items-center text-white hover:text-purple-800 hover:bg-white cursor-pointer my-4 rounded-l-lg inline-block">
							<HiUserGroup size={30} />
							<span className="text-sm">Pacientes</span>
						</div>
					</Link>
					<Link href="/financeiro">
						<div className="flex flex-col items-center pr-1  ml-2 text-white hover:text-purple-800 hover:bg-white cursor-pointer  my-3 rounded-l-lg inline-block">
							<FaRegMoneyBillAlt size={25} />
							<span className="text-sm">Financeiro</span>
						</div>
					</Link>
					<Link href="/opcoes">
						<div className="flex flex-col items-center ml-2 text-white hover:text-purple-800 hover:bg-white cursor-pointer my-4 rounded-l-lg inline-block">
							<FiSettings size={25} />
							<span className="text-sm">Opções</span>
						</div>
					</Link>
				</div>
			</div>
			<main className="ml-20 w-full">{children}</main>
		</div>
	)
}

export default Sidebar