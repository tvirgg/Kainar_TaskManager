import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { assignCommonTaskToDate, addCommonTask } from '../../store/tasksSlice';
import './CommonTasks.css';
const CommonTasks: React.FC<{ username: string }> = ({ username }) => {
    const dispatch = useDispatch();
    const commonTasks = useSelector((state: RootState) => state.tasks.commonTasks[username] || []);
    const [newTask, setNewTask] = useState('');

    const handleAddCommonTask = () => {
        if (newTask.trim()) {
            dispatch(addCommonTask({ username, task: newTask.trim() }));
            setNewTask('');
        }
    };

    const handleAssignTask = (task: string, date: string) => {
        dispatch(assignCommonTaskToDate({ username, date, task }));
    };

    return (
        <div className="common-tasks">
            <h2>Common Tasks</h2>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new common task"
            />
            <button onClick={handleAddCommonTask}>Add Task</button>
            <ul>
                {commonTasks.map((task, index) => (
                    <li key={index}>
                        {task}
                        <button onClick={() => handleAssignTask(task, new Date().toISOString().split('T')[0])}>Assign to Today</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommonTasks;
