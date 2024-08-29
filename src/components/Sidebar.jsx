import React from "react"
import Menu from "./Menu"

const Sidebar = ({ children }) => {

	return (
		<div className="flex border-inherit}">
			<div className="hidden md:block w-20 h-screen pt-4 bg-purple-700 flex flex-col justify-between border-inherit">
				<div className=" flex flex-col">
					<Menu />
				</div>
			</div>
			<main className=" p-1 w-full">{children}</main>
		</div>
	)
}

export default Sidebar