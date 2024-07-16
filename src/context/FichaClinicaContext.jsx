import { createContext, useState, useContext, useEffect } from 'react'
import api from "../utils/Api.js"

const FichaClinicaContext = createContext();

export const FichaClinicaProvider = ({ children }) => {
    const [teste, setTeste] = useState('Teste context');
    const [pagamento, setPagamento] = useState()
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
      getPagamentoList()
    },[])
    

    const getPagamentoList = async () => {
      await api.get(`contas_receber/paciente/14`)
        .then(response => {
          setPagamento([...response.data])
      })
      .then(response => {
        setLoading(false)
      })
      .catch(function (error) {
        console.error(error);
      })
    }

    return (
        <FichaClinicaContext.Provider value={{ pagamento, loading, getPagamentoList}}>
            {children}
        </FichaClinicaContext.Provider>
    );
};

export const useFichaClinica = () => {
    return useContext(FichaClinicaContext);
};
