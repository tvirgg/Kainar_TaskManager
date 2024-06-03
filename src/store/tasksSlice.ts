import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskState {
    [key: string]: string[]; // key будет представлять строку формата "YYYY-MM-DD"
}

interface UserTaskState {
    [username: string]: TaskState;
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
        // Игнорируем ошибки
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
                state[username][date] = [];
            }
            state[username][date].push(task);
            saveState(state);
        },
        removeTask: (state, action: PayloadAction<{ username: string; date: string; index: number }>) => {
            const { username, date, index } = action.payload;
            if (state[username] && state[username][date]) {
                state[username][date].splice(index, 1);
                if (state[username][date].length === 0) {
                    delete state[username][date];
                }
                saveState(state);
            }
        },
        updateTask: (state, action: PayloadAction<{ username: string; date: string; index: number; newTask: string }>) => {
            const { username, date, index, newTask } = action.payload;
            if (state[username] && state[username][date]) {
                state[username][date][index] = newTask;
                saveState(state);
            }
        },
    },
});

export const { addTask, removeTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
