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
			<div className="w-15 m-1 h-screen p-4 mt-2 bg-purple-800 rounded-lg border-r-[1px] flex flex-col justify-between border-inherit">
				<div className="flex flex-col items-center">
					<Link href="/agenda">
						<div className="bg-purple-800 text-white p-3 rounded-lg inline-block">
							<RxCalendar size={20} />
						</div>
					</Link>
					<span className="border-b-[1px] border-gray-100 w-full p-2"></span>
					<Link href="/listaPacientes">
						<div className="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block">
							<HiUserGroup size={20} />
						</div>
					</Link>
					<Link href="/financeiro">
						<div className="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block">
							<FaRegMoneyBillAlt size={20} />
						</div>
					</Link>
					<Link href="/opcoes">
						<div className="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block">
							<FiSettings size={20} />
						</div>
					</Link>
				</div>
			</div>
			<main className="ml-20 w-full">{children}</main>
		</div>
	)
}

export default Sidebar