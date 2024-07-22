import { createContext, useState, useContext, useEffect } from 'react'
import api from "../utils/Api"
import { usePaciente } from './PacienteContext'

export const FichaClinicaContext = createContext()

export const FichaClinicaProvider = ({ children }) => {
  const [pagamento, setPagamento] = useState()
  const [loading, setLoading] = useState(true)
  const [procedimento, setProcedimento] = useState()
  const [procedimentoList, setProcedimentoList] = useState()
  const [orcamento, setOrcamento] = useState()
  const { idPaciente, idEmpresa } = usePaciente()

  useEffect(() => {
    getPagamentoList()
    getProcedimentoList()
    getOrcamentoList()
  }, [idPaciente])

  const getPagamentoList = async () => {
    await api.get(`contas_receber/paciente/${idPaciente}/${idEmpresa}`)
      .then(response => {
        setPagamento([...response.data])
      })
      .then(response => {
        setLoading(false)
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  const getProcedimentoList = async () => {
    await api.get(`procedimento/paciente/${idPaciente}/${idEmpresa}`)
      .then(response => {
        setProcedimento([...response.data])
        setLoading(false)
      })
      .catch(function (error) {
        console.error(error)
      })

    await api.get('procedimento_list')
      .then(response => {
        setProcedimentoList([...procedimentoList, ...response.data])
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  const getOrcamentoList = async () => {
    await api.get(`orcamento/paciente/${idPaciente}`)
      .then(response => {
        setOrcamento([...response.data])
      })
      .catch(function (error) {
        console.error(error)
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
  )
}

