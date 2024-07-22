import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { FichaClinicaContext } from '../../context/FichaClinicaContext'
import PacienteProfile from './pacienteProfile'
import { usePaciente } from '../../context/PacienteContext'

const PacienteProfilePage = () => {
  const router = useRouter()
  //const { data } = router.query
  //const [id_paciente, id_empresa] = data?.split('-')
  // const {id_paciente} = router.query
  const { idPaciente, idEmpresa } = usePaciente()
  const id_paciente = idPaciente
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
