import React from 'react';
import './App.css';
import Calendar from './components/Calendar/Calendar';
import UserList from './components/UserList/UserList';
import { UserProvider, useUser } from './contexts/UserContext';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import ProfilePage from './components/Profile/Profile';

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
                            <Route path="/profile/:username" element={<ProtectedRoute component={ProfilePageWrapper} />} />
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
    const handleProfile = (username: string) => {
        navigate(`/profile/${username}`);
    };
    return (
        <div>
            <h3>Kainar To-Do List calendar</h3>
            {currentUser && (
                <div className="app__nav">
                    <span>Current User: </span>
                    <button onClick={() => handleProfile(currentUser.toString())} className="app__link"><Profile_nav username={currentUser.toString()}/></button>
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

const Profile_nav: React.FC<{username: string}> = ({username}) => {
    if (!username) {
        return <div>Error: Username is required</div>;
    }
    return (
        <div className="profile-page_nav">
            <img src={'https://cs14.pikabu.ru/post_img/big/2023/02/13/8/1676296367166243426.png'} alt={`${username}'s profile`} className="profile-page_nav__img" />
            <h3>{username}</h3>
        </div>
    );;
};

const CalendarWrapper: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    if (!username) {
        return <div>Error: Username is required</div>;
    }
    return <Calendar username={username} />;
};
const ProfilePageWrapper: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    if (!username) {
        return <div>Error: Username is required</div>;
    }
    return <ProfilePage name={username} profile_photo={'https://cs14.pikabu.ru/post_img/big/2023/02/13/8/1676296367166243426.png'} dateOfBirth={ new Date(1990, 1, 1)} />;
};

export default App;
