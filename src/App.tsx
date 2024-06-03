import React from 'react';
import './App.css';
import Calendar from './components/Calendar/Calendar';
import UserList from './components/UserList/UserList';
import { UserProvider, useUser } from './contexts/UserContext';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate, useParams } from 'react-router-dom';

function App() {
    return (
        <UserProvider>
            <Router>
                <div className="app">
                    <header className="app__header">
                        <Header />
                    </header>
                    <main>
                        <Routes>
                            <Route path="/" element={<UserList />} />
                            <Route path="/calendar/:username" element={<ProtectedRoute component={CalendarWrapper} />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </UserProvider>
    );
}

const Header: React.FC = () => {
    const { currentUser, setCurrentUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        setCurrentUser(null);
        navigate('/');
    };

    return (
        <div>
            <h3>Kainar To-Do List calendar</h3>
            {currentUser && (
                <div className="app__nav">
                    <span>Current User: {currentUser}</span>
                    <button onClick={handleLogout} className="app__link">Change User</button>
                </div>
            )}
            {/*<nav>*/}
            {/*    <Link to="/" className="app__link">Home</Link>*/}
            {/*</nav>*/}
        </div>
    );
};

const ProtectedRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
    const { currentUser } = useUser();

    if (!currentUser) {
        return <Navigate to="/" />;
    }

    return <Component />;
};

const CalendarWrapper: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    if (!username) {
        return <div>Error: Username is required</div>;
    }
    return <Calendar username={username} />;
};

export default App;
