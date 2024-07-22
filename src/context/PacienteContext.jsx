import { createContext, useState, useContext, useEffect } from 'react'

const PacienteContext = createContext();

export const PacienteProvider = ({ children }) => {
    const [idPaciente, setIdPaciente] = useState(0)
    const [idEmpresa, setIdEmpresa] = useState(0)

    const saveIdPaciente = async (id) => {
        setIdPaciente(id)
    }

    const saveIdEmpresa = async (id) => {
        setIdEmpresa(id)
    }

    return (
        <PacienteContext.Provider value={{ 
            idPaciente, 
            saveIdPaciente,
            idEmpresa,
            saveIdEmpresa 
        }}>
            {children}
        </PacienteContext.Provider>
    );
};

export const usePaciente = () => {
    return useContext(PacienteContext);
};
