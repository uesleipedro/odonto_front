import {
    Tooth1,
    Tooth2,
    Tooth3,
    Tooth4,
    Tooth5,
    Tooth6,
    Tooth7,
    Tooth8,
    Tooth9
} from '../pages/fichaClinica/dentes'
import { useEffect, useState } from 'react'
import api from '../utils/Api'

const TeethDiagram = ({ setTooth, id_paciente, id_empresa }) => {
    const [listaDentesComProcedimento, setListaDentesComProcedimento] = useState()

    useEffect(() => {
        getDentesComProcedimento()
    }, [])

    useEffect(() => {
        console.log("lista dentes ", listaDentesComProcedimento?.[11])
    }, [listaDentesComProcedimento])

    const getDentesComProcedimento = async () => {
        await api.get(`dentes/dentesComProcedimento?id_paciente=${id_paciente}&id_empresa=${id_empresa}`)
            .then(response => {
                setListaDentesComProcedimento(response.data[0]?.dentes)
            })
    }

    return (
        <div style={{ display: 'grid', gridGap: '30px' }}>
            {/* // Arcada superior */}
            <div style={{ display: 'flex', alignSelf: 'flex-end', flexWrap: 'wrap', gap: 15 }}>
                <Tooth1 onClick={setTooth} tooth_number={18} cor_dente={listaDentesComProcedimento?.[18]} />
                <Tooth1 onClick={setTooth} tooth_number={17} cor_dente={listaDentesComProcedimento?.[17]} />
                <Tooth1 onClick={setTooth} tooth_number={16} cor_dente={listaDentesComProcedimento?.[16]} />
                <Tooth2 onClick={setTooth} tooth_number={15} cor_dente={listaDentesComProcedimento?.[15]} />
                <Tooth3 onClick={setTooth} tooth_number={14} cor_dente={listaDentesComProcedimento?.[14]} />
                <Tooth4 onClick={setTooth} tooth_number={13} cor_dente={listaDentesComProcedimento?.[13]} />
                <Tooth5 onClick={setTooth} tooth_number={12} cor_dente={listaDentesComProcedimento?.[12]} />
                <Tooth5 onClick={setTooth} tooth_number={11} cor_dente={listaDentesComProcedimento?.[11]} />
                <Tooth5 onClick={setTooth} tooth_number={21} cor_dente={listaDentesComProcedimento?.[21]} />
                <Tooth5 onClick={setTooth} tooth_number={22} cor_dente={listaDentesComProcedimento?.[22]} />
                <Tooth4 onClick={setTooth} tooth_number={23} cor_dente={listaDentesComProcedimento?.[23]} />
                <Tooth3 onClick={setTooth} tooth_number={24} cor_dente={listaDentesComProcedimento?.[24]} />
                <Tooth2 onClick={setTooth} tooth_number={25} cor_dente={listaDentesComProcedimento?.[25]} />
                <Tooth1 onClick={setTooth} tooth_number={26} cor_dente={listaDentesComProcedimento?.[26]} />
                <Tooth1 onClick={setTooth} tooth_number={27} cor_dente={listaDentesComProcedimento?.[27]} />
                <Tooth1 onClick={setTooth} tooth_number={28} cor_dente={listaDentesComProcedimento?.[28]} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
                <Tooth6 onClick={setTooth} tooth_number={48} cor_dente={listaDentesComProcedimento?.[48]} />
                <Tooth6 onClick={setTooth} tooth_number={47} cor_dente={listaDentesComProcedimento?.[47]} />
                <Tooth6 onClick={setTooth} tooth_number={46} cor_dente={listaDentesComProcedimento?.[46]} />
                <Tooth6 onClick={setTooth} tooth_number={45} cor_dente={listaDentesComProcedimento?.[45]} />
                <Tooth7 onClick={setTooth} tooth_number={44} cor_dente={listaDentesComProcedimento?.[44]} />
                <Tooth8 onClick={setTooth} tooth_number={43} cor_dente={listaDentesComProcedimento?.[43]} />
                <Tooth9 onClick={setTooth} tooth_number={42} cor_dente={listaDentesComProcedimento?.[42]} />
                <Tooth9 onClick={setTooth} tooth_number={41} cor_dente={listaDentesComProcedimento?.[41]} />
                <Tooth9 onClick={setTooth} tooth_number={31} cor_dente={listaDentesComProcedimento?.[31]} />
                <Tooth9 onClick={setTooth} tooth_number={32} cor_dente={listaDentesComProcedimento?.[32]} />
                <Tooth8 onClick={setTooth} tooth_number={33} cor_dente={listaDentesComProcedimento?.[33]} />
                <Tooth7 onClick={setTooth} tooth_number={34} cor_dente={listaDentesComProcedimento?.[34]} />
                <Tooth6 onClick={setTooth} tooth_number={35} cor_dente={listaDentesComProcedimento?.[35]} />
                <Tooth6 onClick={setTooth} tooth_number={36} cor_dente={listaDentesComProcedimento?.[36]} />
                <Tooth6 onClick={setTooth} tooth_number={37} cor_dente={listaDentesComProcedimento?.[37]} />
                <Tooth6 onClick={setTooth} tooth_number={38} cor_dente={listaDentesComProcedimento?.[38]} />
            </div>
        </div>
    );
};

export default TeethDiagram;