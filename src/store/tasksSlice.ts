import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskState {
    todo: string[];
    done: string[];
}

interface UserTaskState {
    [username: string]: { [date: string]: TaskState };
}

const loadState = (): UserTaskState => {
    try {
        const serializedState = localStorage.getItem('tasks');
        if (serializedState === null) {
            return {};
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {};
    }
};

const saveState = (state: UserTaskState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('tasks', serializedState);
    } catch (err) {
        // Ignoring errors
    }
};

const initialState: UserTaskState = loadState();

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<{ username: string; date: string; task: string }>) => {
            const { username, date, task } = action.payload;
            if (!state[username]) {
                state[username] = {};
            }
            if (!state[username][date]) {
                state[username][date] = { todo: [], done: [] };
            }
            state[username][date].todo.push(task);
            saveState(state);
        },
        removeTask: (state, action: PayloadAction<{ username: string; date: string; index: number; isDone: boolean }>) => {
            const { username, date, index, isDone } = action.payload;
            if (state[username] && state[username][date]) {
                if (isDone) {
                    state[username][date].done.splice(index, 1);
                } else {
                    state[username][date].todo.splice(index, 1);
                }
                saveState(state);
            }
        },
        updateTask: (state, action: PayloadAction<{ username: string; date: string; index: number; newTask: string; isDone: boolean }>) => {
            const { username, date, index, newTask, isDone } = action.payload;
            if (state[username] && state[username][date]) {
                if (isDone) {
                    state[username][date].done[index] = newTask;
                } else {
                    state[username][date].todo[index] = newTask;
                }
                saveState(state);
            }
        },
        toggleTaskStatus: (state, action: PayloadAction<{ username: string; date: string; index: number }>) => {
            const { username, date, index } = action.payload;
            if (state[username] && state[username][date]) {
                const task = state[username][date].todo[index];
                state[username][date].todo.splice(index, 1);
                state[username][date].done.push(task);
                saveState(state);
            }
        },
        moveTaskToNextDay: (state, action: PayloadAction<{ username: string; date: string; index: number }>) => {
            const { username, date, index } = action.payload;
            if (state[username] && state[username][date]) {
                const task = state[username][date].todo[index];
                const currentDate = new Date(date);
                const nextDate = new Date(currentDate);
                nextDate.setDate(currentDate.getDate() + 1);
                const nextDateKey = nextDate.toISOString().split('T')[0];
                if (!state[username][nextDateKey]) {
                    state[username][nextDateKey] = { todo: [], done: [] };
                }
                state[username][nextDateKey].todo.push(task);
                state[username][date].todo.splice(index, 1);
                saveState(state);
            }
        },
    },
});

export const { addTask, removeTask, updateTask, toggleTaskStatus, moveTaskToNextDay } = tasksSlice.actions;
export default tasksSlice.reducer;
