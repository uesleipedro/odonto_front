import React from "react"
import Menu from "./Menu"

const Sidebar = ({ children }) => {

	return (
		<div className="flex border-inherit}">
			<div className=" hidden md:block w-20 m-1 h-screen pt-4 mt-2 bg-purple-800 rounded-lg flex flex-col justify-between border-inherit">
				<div className="flex flex-col">
					<Menu />
				</div>
			</div>
			<main className="ml-2 mr-2 w-full">{children}</main>
		</div>
	)
}

export default Sidebar