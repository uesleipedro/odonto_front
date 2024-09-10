import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import { usePathname } from "next/navigation"
import Menu from "./Menu"
import LoadingOverlay from "./LoadingOverlay"
import SubMenu from "./SubMenu"

const Sidebar = ({ children }) => {
	const [isCssLoaded, setCssLoaded] = useState(false)
	const [showSubmenu, setShowSubMenu] = useState()
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		setShowSubMenu(pathname.startsWith("/opcoes") ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 max-w-0')
	}, [pathname])

	useEffect(() => {
		const handleLoad = () => setCssLoaded(true)

		if (document.readyState === 'complete') {
			setCssLoaded(true)
		} else {
			window.addEventListener('load', handleLoad)
		}

		return () => window.removeEventListener('load', handleLoad)
	}, [])

	if (!isCssLoaded) {
		return <LoadingOverlay isLoading={!isCssLoaded} />
	}



	return (
		<div className="flex border-inherit}">
			<div className="hidden md:block w-20 h-screen pt-4 bg-purple-700 flex flex-col justify-between border-inherit">
				<div className=" flex flex-col">
					<Menu />
				</div>
			</div>
			<div
				className={`hidden md:block transition-all duration-500 ease-in-out overflow-hidden ${showSubmenu}`}
			>
				<SubMenu />
			</div>
			<main className="w-full">{children}</main>
		</div>
	)
}

export default Sidebar