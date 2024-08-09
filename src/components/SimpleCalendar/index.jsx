import React, { useState } from 'react';
//import './SimpleCalendar.module.css';

const SimpleCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const startDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = daysInMonth(month, year);
        const startDay = startDayOfMonth(month, year);

        const calendarDays = [];
        for (let i = 0; i < startDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="empty-day"></div>);
        }

        for (let i = 1; i <= days; i++) {
            calendarDays.push(
                <div key={`day-${i}`} className="calendar-day">
                    {i}
                </div>
            );
        }

        return calendarDays;
    };

    const changeMonth = (direction) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + direction));
        setCurrentDate(newDate);
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={() => changeMonth(-1)}>Anterior</button>
                <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
                <button onClick={() => changeMonth(1)}>Próximo</button>
            </div>
            <div className="calendar-grid">
                <div className="calendar-day-name">Dom</div>
                <div className="calendar-day-name">Seg</div>
                <div className="calendar-day-name">Ter</div>
                <div className="calendar-day-name">Qua</div>
                <div className="calendar-day-name">Qui</div>
                <div className="calendar-day-name">Sex</div>
                <div className="calendar-day-name">Sáb</div>
                {renderDays()}
            </div>
        </div>
    );
};

export default SimpleCalendar;