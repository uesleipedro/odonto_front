import { createContext, useState, useContext } from 'react'

const PacienteContext = createContext()

export const PacienteProvider = ({ children }) => {
    const [idPaciente, setIdPaciente] = useState(0)
    const [idEmpresa, setIdEmpresa] = useState(0)
    const [dadosPaciente, setDadosPaciente] = useState({})

    const saveIdPaciente = async (id) => {
        setIdPaciente(id)
    }

    const saveDadosPaciente = async (dados) => {
        setDadosPaciente(dados)
    }

    const saveIdEmpresa = async (id) => {
        setIdEmpresa(id)
    }

    return (
        <PacienteContext.Provider value={{
            idPaciente,
            saveIdPaciente,
            idEmpresa,
            saveIdEmpresa,
            saveDadosPaciente,
            dadosPaciente
        }}>
            {children}
        </PacienteContext.Provider>
    )
}

export const usePaciente = () => {
    return useContext(PacienteContext)
}
