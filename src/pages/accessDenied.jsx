import { AiFillCloseSquare } from "react-icons/ai"

const accessDenied = () => {

    return (
        <div className="flex flex-col h-3/4 w-full items-center justify-center gap-10">
            <AiFillCloseSquare
                size={100}
                color="red" />
            <h1 className="text-5xl bold text-purple-800">Acesso Negado</h1>
            <div>
                <p>Você não tem autorização para acessar esta página.</p>
                <p>Entre em contato com o administrador do sistema.</p>
            </div>
        </div>
    )
}

export default accessDenied