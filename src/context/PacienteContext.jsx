import { createContext, useState, useContext, useEffect } from 'react'

const PacienteContext = createContext();

export const PacienteProvider = ({ children }) => {
    const [idPaciente, setIdPaciente] = useState(0)

    const saveIdPaciente = async (id) => {
      await setIdPaciente(id)
    }

    return (
        <PacienteContext.Provider value={{ idPaciente, saveIdPaciente}}>
            {children}
        </PacienteContext.Provider>
    );
};

export const usePaciente = () => {
    return useContext(PacienteContext);
};
