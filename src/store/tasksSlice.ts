import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskState {
    todo: string[];
    done: string[];
}

interface UserTasks {
    [date: string]: TaskState;
}

interface UserTaskState {
    tasks: { [username: string]: UserTasks };
    commonTasks: { [username: string]: string[] };
}

const loadState = (): UserTaskState => {
    try {
        const serializedState = localStorage.getItem('tasks');
        if (serializedState === null) {
            return { tasks: {}, commonTasks: {} };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return { tasks: {}, commonTasks: {} };
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
            if (!state.tasks[username]) {
                state.tasks[username] = {};
            }
            if (!state.tasks[username][date]) {
                state.tasks[username][date] = { todo: [], done: [] };
            }
            state.tasks[username][date].todo.push(task);
            saveState(state);
        },
        removeTask: (state, action: PayloadAction<{ username: string; date: string; index: number; isDone: boolean }>) => {
            const { username, date, index, isDone } = action.payload;
            if (state.tasks[username] && state.tasks[username][date]) {
                if (isDone) {
                    state.tasks[username][date].done.splice(index, 1);
                } else {
                    state.tasks[username][date].todo.splice(index, 1);
                }
                saveState(state);
            }
        },
        updateTask: (state, action: PayloadAction<{ username: string; date: string; index: number; newTask: string; isDone: boolean }>) => {
            const { username, date, index, newTask, isDone } = action.payload;
            if (state.tasks[username] && state.tasks[username][date]) {
                if (isDone) {
                    state.tasks[username][date].done[index] = newTask;
                } else {
                    state.tasks[username][date].todo[index] = newTask;
                }
                saveState(state);
            }
        },
        toggleTaskStatus: (state, action: PayloadAction<{ username: string; date: string; index: number }>) => {
            const { username, date, index } = action.payload;
            if (state.tasks[username] && state.tasks[username][date]) {
                const task = state.tasks[username][date].todo[index];
                state.tasks[username][date].todo.splice(index, 1);
                state.tasks[username][date].done.push(task);
                saveState(state);
            }
        },
        moveTaskToNextDay: (state, action: PayloadAction<{ username: string; date: string; index: number }>) => {
            const { username, date, index } = action.payload;
            if (state.tasks[username] && state.tasks[username][date]) {
                const task = state.tasks[username][date].todo[index];
                const currentDate = new Date(date);
                const nextDate = new Date(currentDate);
                nextDate.setDate(currentDate.getDate() + 1);
                const nextDateKey = nextDate.toISOString().split('T')[0];
                if (!state.tasks[username][nextDateKey]) {
                    state.tasks[username][nextDateKey] = { todo: [], done: [] };
                }
                state.tasks[username][nextDateKey].todo.push(task);
                state.tasks[username][date].todo.splice(index, 1);
                saveState(state);
            }
        },
        addCommonTask: (state, action: PayloadAction<{ username: string; task: string }>) => {
            const { username, task } = action.payload;
            if (!state.commonTasks[username]) {
                state.commonTasks[username] = [];
            }
            state.commonTasks[username].push(task);
            saveState(state);
        },
        removeCommonTask: (state, action: PayloadAction<{ username: string; index: number }>) => {
            const { username, index } = action.payload;
            if (state.commonTasks[username]) {
                state.commonTasks[username].splice(index, 1);
                saveState(state);
            }
        },
        assignCommonTaskToDate: (state, action: PayloadAction<{ username: string; date: string; task: string }>) => {
            const { username, date, task } = action.payload;
            if (!state.tasks[username]) {
                state.tasks[username] = {};
            }
            if (!state.tasks[username][date]) {
                state.tasks[username][date] = { todo: [], done: [] };
            }
            state.tasks[username][date].todo.push(task);
            state.commonTasks[username] = state.commonTasks[username].filter(t => t !== task);
            saveState(state);
        },
    },
});

export const { addTask, removeTask, updateTask, toggleTaskStatus, moveTaskToNextDay, addCommonTask, removeCommonTask, assignCommonTaskToDate } = tasksSlice.actions;
export default tasksSlice.reducer;
