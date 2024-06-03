import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskState {
    [day: number]: string[];
}

interface UserState {
    [username: string]: TaskState;
}

// Загрузка состояния из localStorage
const loadState = (): UserState => {
    try {
        const serializedState = localStorage.getItem('users');
        if (serializedState === null) {
            return {};
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {};
    }
};

// Сохранение состояния в localStorage
const saveState = (state: UserState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('users', serializedState);
    } catch (err) {
        // Игнор
    }
};

const initialState: UserState = loadState();

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<{ username: string }>) => {
            if (!state[action.payload.username]) {
                state[action.payload.username] = {};
                saveState(state);  // Сохраняем состояние в localStorage
            }
        },
        removeUser: (state, action: PayloadAction<{ username: string }>) => {
            delete state[action.payload.username];
            saveState(state);  // Сохраняем состояние в localStorage
        },
        renameUser: (state, action: PayloadAction<{ oldUsername: string; newUsername: string }>) => {
            const { oldUsername, newUsername } = action.payload;
            if (state[oldUsername] && !state[newUsername]) {
                state[newUsername] = state[oldUsername];
                delete state[oldUsername];
                saveState(state);  // Сохраняем состояние в localStorage
            }
        },
    },
});

export const { addUser, removeUser, renameUser } = usersSlice.actions;
export default usersSlice.reducer;
