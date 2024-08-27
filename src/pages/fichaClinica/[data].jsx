import { useContext, useEffect } from 'react'
import { FichaClinicaContext } from '../../context/FichaClinicaContext'
import PacienteProfile from './pacienteProfile'
import { usePaciente } from '../../context/PacienteContext'

const PacienteProfilePage = () => {
  const { idPaciente } = usePaciente()

  const {
    getPagamentoList,
    getProcedimentoList,
    getOrcamentoList,
  } = useContext(FichaClinicaContext)

  useEffect(() => {
    if (idPaciente) {
      getPagamentoList()
      getProcedimentoList()
      getOrcamentoList()
    }
  }, [idPaciente])

  return <PacienteProfile />

}

export default PacienteProfilePage
