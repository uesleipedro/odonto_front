import { useRouter } from 'next/navigation'

const opcoes = () => {
    const router = new useRouter()

    const menuItems = [
        { name: 'Usuário', link: '/usuario/listaUsuarios' },
        { name: 'Nível Acesso', link: '/nivelAcesso/listaNivelAcesso' },
    ]

    const handleClick = async (link) => {
        router.push(link)
    }


    return (
        <div className="flex flex-row h-full">
            <div className="mr-2 h-full">
                <ul className="flex flex-col gap-2 border p-1 h-full bg-gray-100  ">
                    {menuItems.map(e => (
                        <li
                            className="cursor-pointer font-bold text-purple-800"
                            onClick={() => handleClick(e.link)}
                        >{e.name}</li>
                    ))}

                </ul>
            </div>
            <div>Em construção...</div>
        </div>
    )
}

export default opcoes