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

    const getDentesComProcedimento = async () => {
        await api.get(`dentes/dentesComProcedimento?id_paciente=${id_paciente}&id_empresa=${id_empresa}`)
            .then(response => {
                setListaDentesComProcedimento(response.data[0]?.dentes)
            })
    }

    const comProcedimento = async (tooth_number) => {
        return ["1", "2"].includes("1")
            ? "red"
            : "none"
    }

    return (
        <div style={{ display: 'grid', gridGap: '30px' }}>
            {/* // Arcada superior */}
            <div style={{ display: 'flex', alignSelf: 'flex-end', flexWrap: 'wrap', gap: 15 }}>
                <Tooth1 onClick={setTooth} cor_dente={console.log("asdf", comProcedimento())} tooth_number={18} />
                <Tooth1 onClick={setTooth} tooth_number={17} />
                <Tooth1 onClick={setTooth} tooth_number={16} />
                <Tooth2 onClick={setTooth} tooth_number={15} />
                <Tooth3 onClick={setTooth} tooth_number={14} />
                <Tooth4 onClick={setTooth} tooth_number={13} />
                <Tooth5 onClick={setTooth} tooth_number={12} />
                <Tooth5 onClick={setTooth} tooth_number={11} />
                <Tooth5 onClick={setTooth} tooth_number={21} />
                <Tooth5 onClick={setTooth} tooth_number={22} />
                <Tooth4 onClick={setTooth} tooth_number={23} />
                <Tooth3 onClick={setTooth} tooth_number={24} />
                <Tooth2 onClick={setTooth} tooth_number={25} />
                <Tooth1 onClick={setTooth} tooth_number={26} />
                <Tooth1 onClick={setTooth} tooth_number={27} />
                <Tooth1 onClick={setTooth} tooth_number={28} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
                <Tooth6 onClick={setTooth} tooth_number={48} />
                <Tooth6 onClick={setTooth} tooth_number={47} />
                <Tooth6 onClick={setTooth} tooth_number={46} />
                <Tooth6 onClick={setTooth} tooth_number={45} />
                <Tooth7 onClick={setTooth} tooth_number={44} />
                <Tooth8 onClick={setTooth} tooth_number={43} />
                <Tooth9 onClick={setTooth} tooth_number={42} />
                <Tooth9 onClick={setTooth} tooth_number={41} />
                <Tooth9 onClick={setTooth} tooth_number={31} />
                <Tooth9 onClick={setTooth} tooth_number={32} />
                <Tooth8 onClick={setTooth} tooth_number={33} />
                <Tooth7 onClick={setTooth} tooth_number={34} />
                <Tooth6 onClick={setTooth} tooth_number={35} />
                <Tooth6 onClick={setTooth} tooth_number={36} />
                <Tooth6 onClick={setTooth} tooth_number={37} />
                <Tooth6 onClick={setTooth} tooth_number={38} />
            </div>
        </div>
    );
};

export default TeethDiagram;