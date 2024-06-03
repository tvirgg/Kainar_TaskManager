import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addTask, removeTask, updateTask } from '../../store/tasksSlice';
import './TaskModal.css';

interface TaskModalProps {
    username: string;
    day: number;
    month: string;
    year: number;
    onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ username, day, month, year, onClose }) => {
    const dispatch = useDispatch();
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1; // Получаем числовое значение месяца
    const dateKey = `${year}-${monthIndex.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const tasks = useSelector((state: RootState) => state.tasks[username]?.[dateKey] || []);
    const [newTask, setNewTask] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleAddTask = () => {
        if (newTask.trim()) {
            dispatch(addTask({ username, date: dateKey, task: newTask.trim() }));
            setNewTask('');
            setError('');
        } else {
            setError('Task cannot be empty');
        }
    };

    const handleRemoveTask = (index: number) => {
        dispatch(removeTask({ username, date: dateKey, index }));
    };

    const handleEditTask = (index: number) => {
        setNewTask(tasks[index]);
        setIsEditing(true);
        setCurrentTaskIndex(index);
        setError('');
    };

    const handleUpdateTask = () => {
        if (newTask.trim() && currentTaskIndex !== null) {
            dispatch(updateTask({ username, date: dateKey, index: currentTaskIndex, newTask: newTask.trim() }));
            setNewTask('');
            setIsEditing(false);
            setCurrentTaskIndex(null);
            setError('');
        } else {
            setError('Task cannot be empty');
        }
    };

    return (
        <div className="task-modal">
            <button className="task-modal__close" onClick={onClose}>×</button>
            <h2 className="task-modal__title">Tasks for {month} {day}, {year}</h2>
            <input
                className="task-modal__input"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add new task"
            />
            {error && <p className="task-modal__error">{error}</p>}
            {isEditing ? (
                <button className="task-modal__update-button" onClick={handleUpdateTask}>Update Task</button>
            ) : (
                <button className="task-modal__add-button" onClick={handleAddTask}>Add Task</button>
            )}
            <ul className="task-modal__list">
                {tasks.map((task, index) => (
                    <li key={index} className="task-modal__list-item">
                        {task}
                        <div>
                            <button className="task-modal__edit-button" onClick={() => handleEditTask(index)}>Edit</button>
                            <button className="task-modal__remove-button" onClick={() => handleRemoveTask(index)}>Remove</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskModal;
