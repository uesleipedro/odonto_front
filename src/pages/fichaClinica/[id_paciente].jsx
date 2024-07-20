import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
//import { ClientContext } from '../../context/ClientContext';
//import ClientProfile from '../../components/ClientProfile';
import { FichaClinicaContext } from '../../context/FichaClinicaContext'
import PacienteProfile from './pacienteProfile'

const PacienteProfilePage = () => {
  const router = useRouter();
  const { id_paciente } = router.query;
  const { 
    //pagamento, 
    //loading, 
    getPagamentoList, 
    //procedimento, 
    //procedimentoList, 
    getProcedimentoList,
    getOrcamentoList,
    //orcamento
  } = useContext(FichaClinicaContext)
  //const { setClientId } = useContext(ClientContext);

  useEffect(() => {
    if (id_paciente) {
      //setClientId(id_paciente)
      getPagamentoList(id_paciente)
      getProcedimentoList(id_paciente)
      getOrcamentoList(id_paciente)
    }
  }, [id_paciente]);

  return <PacienteProfile />;
    
};

export default PacienteProfilePage;
