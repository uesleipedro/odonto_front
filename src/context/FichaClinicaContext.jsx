import { createContext, useState, useContext, useEffect } from 'react'
import api from "../utils/Api.js"
import { usePaciente } from './PacienteContext'

export const FichaClinicaContext = createContext()

export const FichaClinicaProvider = ({ children }) => {
    const [pagamento, setPagamento] = useState()
    const [loading, setLoading] = useState(true)
    const [procedimento, setProcedimento] = useState()
    const [procedimentoList, setProcedimentoList] = useState()
    const [orcamento, setOrcamento] = useState()
    //const { idPaciente } = usePaciente()

    useEffect(() => {
      getPagamentoList()
      getProcedimentoList()
      getOrcamentoList()
    },[])

    const getPagamentoList = async (idPaciente) => {
      await api.get(`contas_receber/paciente/${idPaciente}`)
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

    const getProcedimentoList = async (idPaciente) => {
        await api.get(`procedimento/paciente/${idPaciente}`)
            .then(response => {
                setProcedimento([...response.data])
                setLoading(false)
            })
            .catch(function (error) {
                console.error(error);
            })

        await api.get('procedimento_list')
            .then(response => {
                setProcedimentoList([...procedimentoList, ...response.data])
            })
            .catch(function (error) {
                console.error(error);
            })
    }

    const getOrcamentoList = async (idPaciente) => {
      await api.get(`orcamento/paciente/${idPaciente}`)
        .then(response => {
          setOrcamento([...response.data])
        })
          .catch(function (error) {
            console.error(error);
          })
    }


    return (
        <FichaClinicaContext.Provider value={{ 
            pagamento, 
            loading, 
            getPagamentoList, 
            procedimento, 
            procedimentoList, 
            getProcedimentoList,
            getOrcamentoList,
            orcamento
          }}>
            {children}
        </FichaClinicaContext.Provider>
    );
};

/*export const useFichaClinica = () => {
    return useContext(FichaClinicaContext);
};*/
