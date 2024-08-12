import React from 'react';
import Tooth from './Tooth';

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
} from '../pages/icon';

const TeethDiagram = () => {

    const handleToothClick = (id) => {
        alert(`Você clicou no dente ${id}`);
        // Aqui você pode executar outras ações
    };

    return (
        <div style={{ display: 'grid', gridGap: '30px' }}>
            {/* // Arcada superior */}
            <div style={{ display: 'flex', alignSelf: 'flex-end', flexWrap: 'wrap', gap: 15 }}>
                <Tooth1 onClick={handleToothClick} tooth_number={18} />
                <Tooth1 onClick={handleToothClick} tooth_number={17} />
                <Tooth1 onClick={handleToothClick} tooth_number={16} />
                <Tooth2 onClick={handleToothClick} tooth_number={15} />
                <Tooth3 onClick={handleToothClick} tooth_number={14} />
                <Tooth4 onClick={handleToothClick} tooth_number={13} />
                <Tooth5 onClick={handleToothClick} tooth_number={12} />
                <Tooth5 onClick={handleToothClick} tooth_number={11} />
                <Tooth5 onClick={handleToothClick} tooth_number={21} />
                <Tooth5 onClick={handleToothClick} tooth_number={22} />
                <Tooth4 onClick={handleToothClick} tooth_number={23} />
                <Tooth3 onClick={handleToothClick} tooth_number={24} />
                <Tooth2 onClick={handleToothClick} tooth_number={25} />
                <Tooth1 onClick={handleToothClick} tooth_number={26} />
                <Tooth1 onClick={handleToothClick} tooth_number={27} />
                <Tooth1 onClick={handleToothClick} tooth_number={28} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
                <Tooth6 onClick={handleToothClick} tooth_number={48} />
                <Tooth6 onClick={handleToothClick} tooth_number={47} />
                <Tooth6 onClick={handleToothClick} tooth_number={46} />
                <Tooth6 onClick={handleToothClick} tooth_number={45} />
                <Tooth7 onClick={handleToothClick} tooth_number={44} />
                <Tooth8 onClick={handleToothClick} tooth_number={43} />
                <Tooth9 onClick={handleToothClick} tooth_number={42} />
                <Tooth9 onClick={handleToothClick} tooth_number={41} />
                <Tooth9 onClick={handleToothClick} tooth_number={31} />
                <Tooth9 onClick={handleToothClick} tooth_number={32} />
                <Tooth8 onClick={handleToothClick} tooth_number={33} />
                <Tooth7 onClick={handleToothClick} tooth_number={34} />
                <Tooth6 onClick={handleToothClick} tooth_number={35} />
                <Tooth6 onClick={handleToothClick} tooth_number={36} />
                <Tooth6 onClick={handleToothClick} tooth_number={37} />
                <Tooth6 onClick={handleToothClick} tooth_number={38} />
            </div>
        </div>
    );
};

export default TeethDiagram;