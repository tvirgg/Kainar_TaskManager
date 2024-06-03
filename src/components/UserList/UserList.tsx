import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addUser, removeUser, renameUser } from '../../store/usersSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import './UserList.css';

const UserList: React.FC = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => Object.keys(state.users));
    const [newUsername, setNewUsername] = useState('');
    const [editUsername, setEditUsername] = useState<string | null>(null);
    const [editedUsername, setEditedUsername] = useState('');
    const { setCurrentUser } = useUser();
    const navigate = useNavigate();

    const handleAddUser = () => {
        if (newUsername.trim()) {
            dispatch(addUser({ username: newUsername.trim() }));
            setNewUsername('');
        }
    };

    const handleRemoveUser = (username: string) => {
        dispatch(removeUser({ username }));
    };

    const handleEditUser = (username: string) => {
        setEditUsername(username);
        setEditedUsername(username);
    };

    const handleRenameUser = () => {
        if (editUsername && editedUsername.trim() && editUsername !== editedUsername.trim()) {
            dispatch(renameUser({ oldUsername: editUsername, newUsername: editedUsername.trim() }));
            setEditUsername(null);
            setEditedUsername('');
        }
    };

    const handleUserClick = (username: string) => {
        setCurrentUser(username);
        navigate(`/calendar/${username}`);
    };

    return (
        <div className="user-list">
            <h2 className="user-list__title">Users</h2>
            <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Add new user"
                className="user-list__input"
            />
            <button onClick={handleAddUser} className="user-list__add-button">Add User</button>
            <ul className="user-list__list">
                {users.map((username) => (
                    <li key={username} className="user-list__item">
                        {editUsername === username ? (
                            <>
                                <input
                                    value={editedUsername}
                                    onChange={(e) => setEditedUsername(e.target.value)}
                                    placeholder="Edit username"
                                    className="user-list__input user-list__input--edit"
                                />
                                <button onClick={handleRenameUser} className="user-list__save-button">Save</button>
                                <button onClick={() => setEditUsername(null)} className="user-list__cancel-button">Cancel</button>
                            </>
                        ) : (
                            <>
                                <span onClick={() => handleUserClick(username)} className="user-list__link">{username}</span>
                                <button onClick={() => handleEditUser(username)} className="user-list__edit-button">Edit</button>
                                <button onClick={() => handleRemoveUser(username)} className="user-list__remove-button">Remove</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
