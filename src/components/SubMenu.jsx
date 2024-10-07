import { useRouter, usePathname } from 'next/navigation'

const SubMenu = () => {
    const router = new useRouter()
    const pathname = usePathname()

    const menuItems = [
        { name: 'Usuário', link: '/opcoes/usuario/listaUsuarios' },
        { name: 'Nível Acesso', link: '/opcoes/nivelAcesso/listaNivelAcesso' },
        { name: 'Credenciais Boleto', link: '/opcoes/boleto/credenciais' },
        { name: 'Empresa', link: '/opcoes/empresa' },
    ]

    const handleClick = async (item) => {
        router.push(item?.link)
    }

    const style = "cursor-pointer font-bold hover:bg-white hover:text-purple-800 transition delay-100 p-2"

    return (
        <div className="flex flex-row h-full">
            <div className="h-full">
                <ul className="flex flex-col gap-2  h-full bg-purple-600">
                    {menuItems.map(item => (
                        <li
                            className={
                                item.link == pathname
                                    ? style + ' text-purple-800 bg-white'
                                    : style + ' text-white'
                            }
                            onClick={() => handleClick(item)}
                        >{item?.name}</li>
                    ))}

                </ul>
            </div>
        </div>
    )
}

export default SubMenu