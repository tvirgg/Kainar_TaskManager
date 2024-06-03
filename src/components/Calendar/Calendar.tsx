import React, { useEffect, useState } from 'react';
import Day from '../Day/Day';
import { getMonthlyHolidays } from '../../api/isDayOff';
import TaskModal from '../TaskModal/TaskModal';
import './Calendar.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const getDaysInMonth = (year: number, month: number): number[] => {
    return Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);
};

interface CalendarProps {
    username: string;
}

const Calendar: React.FC<CalendarProps> = ({ username }) => {
    const [holidays, setHolidays] = useState<number[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const tasks = useSelector((state: RootState) => state.tasks[username] || {});

    const days = getDaysInMonth(currentYear, currentMonth);
    const fetchHolidays = async () => {
        try {
            const holidays = await getMonthlyHolidays(currentYear, currentMonth);
            setHolidays(holidays);
        } catch (error) {
            console.error('Failed to fetch holidays:', error);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, [currentMonth, currentYear]);

    const handleDayClick = (day: number) => {
        setSelectedDay(day);
    };

    const handleCloseModal = () => {
        setSelectedDay(null);
    };

    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(12);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (
        <div className="calendar">
            <div className="calendar__header">
                <button className="calendar__button" onClick={handlePrevMonth}>Prev</button>
                <span className="calendar__month">{monthNames[currentMonth - 1]} {currentYear}</span>
                <button className="calendar__button" onClick={handleNextMonth}>Next</button>
            </div>
            <div className="calendar__body">
                {days.map(day => {
                    const dateKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    return (
                        <Day
                            key={day}
                            day={day}
                            isHoliday={holidays.includes(day)}
                            hasTasks={!!tasks[dateKey]} // Проверка наличия задач для данного дня
                            onClick={handleDayClick}
                        />
                    );
                })}
            </div>
            {selectedDay !== null && (
                <TaskModal
                    username={username}
                    day={selectedDay}
                    month={monthNames[currentMonth - 1]} // Передаем название месяца как строку
                    year={currentYear}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Calendar;
