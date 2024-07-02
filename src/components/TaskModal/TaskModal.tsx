import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addTask, removeTask, updateTask, toggleTaskStatus, moveTaskToNextDay } from '../../store/tasksSlice';
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
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;
    const dateKey = `${year}-${monthIndex.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const tasks = useSelector((state: RootState) => state.tasks[username]?.[dateKey] || { todo: [], done: [] });

    const [newTask, setNewTask] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [isJsonVisible, setJsonVisible] = useState(false);
    const [jsonInput, setJsonInput] = useState('');

    const handleAddTask = () => {
        if (newTask.trim()) {
            dispatch(addTask({ username, date: dateKey, task: newTask.trim() }));
            setNewTask('');
            setError('');
        } else {
            setError('Task cannot be empty');
        }
    };

    const handleAddJson = () => {
        setJsonVisible(true);
    };

    const handleCloseJsonViewer = () => {
        setJsonVisible(false);
    };

    const handleJsonSubmit = () => {
        try {
            const parsedTasks = JSON.parse(jsonInput);
            if (Array.isArray(parsedTasks)) {
                parsedTasks.forEach(task => {
                    if (typeof task === 'string' && task.trim()) {
                        dispatch(addTask({ username, date: dateKey, task: task.trim() }));
                    }
                });
                setJsonInput('');
                setJsonVisible(false);
                setError('');
            } else {
                setError('Invalid JSON format: Expected an array of tasks');
            }
        } catch (e) {
            setError('Invalid JSON format');
        }
    };

    const handleRemoveTask = (index: number, isDone: boolean) => {
        dispatch(removeTask({ username, date: dateKey, index, isDone }));
    };

    const handleEditTask = (index: number, isDone: boolean) => {
        const task = isDone ? tasks.done[index] : tasks.todo[index];
        setNewTask(task);
        setIsEditing(true);
        setCurrentTaskIndex(index);
        setError('');
    };

    const handleUpdateTask = () => {
        if (newTask.trim() && currentTaskIndex !== null) {
            const isDone = tasks.done.includes(newTask);
            dispatch(updateTask({ username, date: dateKey, index: currentTaskIndex, newTask: newTask.trim(), isDone }));
            setNewTask('');
            setIsEditing(false);
            setCurrentTaskIndex(null);
            setError('');
        } else {
            setError('Task cannot be empty');
        }
    };

    const handleToggleTaskStatus = (index: number) => {
        dispatch(toggleTaskStatus({ username, date: dateKey, index }));
    };

    const handleMoveTaskToNextDay = (index: number) => {
        dispatch(moveTaskToNextDay({ username, date: dateKey, index }));
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (isEditing) {
                handleUpdateTask();
            } else {
                handleAddTask();
            }
        }
    };

    const handleJsonKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            handleJsonSubmit();
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
                onKeyPress={handleKeyPress}
                placeholder="Add new task"
            />
            {error && <p className="task-modal__error">{error}</p>}
            {isEditing ? (
                <button className="task-modal__update-button" onClick={handleUpdateTask}>Update Task</button>
            ) : (
                <>
                    <button className="task-modal__add-button" onClick={handleAddTask}>Add Task</button>
                    <button className="task-modal__add-button json_add" onClick={handleAddJson}>Add Json</button>
                </>
            )}
            <div className="task-modal__columns">
                <div className="task-modal__column">
                    <h3>Todo</h3>
                    <ul className="task-modal__list">
                        {tasks.todo && tasks.todo.map((task, index) => (
                            <li key={index} className="task-modal__list-item">
                                <p>{task}</p>
                                <div>
                                    <button className="task-modal__edit-button" onClick={() => handleEditTask(index, false)}>Edit</button>
                                    <button className="task-modal__remove-button" onClick={() => handleRemoveTask(index, false)}>Remove</button>
                                    <button className="task-modal__done-button" onClick={() => handleToggleTaskStatus(index)}>Done</button>
                                    <button className="task-modal__move-button" onClick={() => handleMoveTaskToNextDay(index)}>Move to Next Day</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="task-modal__column">
                    <h3>Done</h3>
                    <ul className="task-modal__list">
                        {tasks.done && tasks.done.map((task, index) => (
                            <li key={index} className="task-modal__list-item">
                                <p>{task}</p>
                                <div>
                                    <button className="task-modal__edit-button" onClick={() => handleEditTask(index, true)}>Edit</button>
                                    <button className="task-modal__remove-button" onClick={() => handleRemoveTask(index, true)}>Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {isJsonVisible && (
                <div className="json-modal">
                    <h3>Enter JSON tasks</h3>
                    <textarea
                        className="json-modal__input"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        onKeyPress={handleJsonKeyPress}
                        placeholder='["Task 1", "Task 2"]'
                    />
                    {error && <p className="task-modal__error">{error}</p>}
                    <div>
                        <button className="task-modal__add-button json-modal__submit-button" onClick={handleJsonSubmit}>Submit JSON</button>
                        <button className="task-modal__add-button json-modal__submit-button sub_close" onClick={handleCloseJsonViewer}>Close JSON Viewer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskModal;
