import React from 'react';
import './Day.css';

interface DayProps {
    day: number;
    isHoliday: boolean;
    hasTasks: boolean;
    isCurrentDay: boolean;  // Обновите наименование переменной
    onClick: (day: number) => void;
}

const Day: React.FC<DayProps> = ({ day, isHoliday, hasTasks, isCurrentDay, onClick }) => {
    return (
<div className={`day ${isHoliday ? 'day--holiday' : ''} ${isCurrentDay ? 'currentDay' : ''}`} onClick={() => onClick(day)}>
            {day}
            {hasTasks && <span className="day__task-dot"></span>} {/* Показ точки если есть задачи */}
        </div>
    );
};

export default Day;
