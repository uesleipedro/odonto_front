import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FichaClinicaContext } from '../../context/FichaClinicaContext'
import PacienteProfile from './pacienteProfile'
import { usePaciente } from '../../context/PacienteContext'
import { useAuth } from '../../auth/useAuth'

const PacienteProfilePage = () => {
  const { saveIdPaciente, saveIdEmpresa } = usePaciente()
  const router = useRouter()
  const { user } = useAuth()
  const id_empresa = user?.user?.foundUser.id_empresa

  const {
    getPagamentoList,
    getProcedimentoList,
    getOrcamentoList,
  } = useContext(FichaClinicaContext)

  useEffect(() => {
    if (router.isReady) {
      saveIdPaciente(router.query.data)
      saveIdEmpresa(id_empresa)
      getPagamentoList()
      getProcedimentoList()
      getOrcamentoList()
    }
  }, [router.isReady])

  return <PacienteProfile />

}

export default PacienteProfilePage
