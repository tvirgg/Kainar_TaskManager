import React from 'react';
import './Day.css';

interface DayProps {
    day: number;
    isHoliday: boolean;
    hasTasks: boolean;
    onClick: (day: number) => void;
}

const Day: React.FC<DayProps> = ({ day, isHoliday, hasTasks, onClick }) => {
    return (
        <div className={`day ${isHoliday ? 'day--holiday' : ''}`} onClick={() => onClick(day)}>
            {day}
            {hasTasks && <span className="day__task-dot"></span>} {/* Показ точки если есть задачи */}
        </div>
    );
};

export default Day;
