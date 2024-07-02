import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import './App.css';
import Calendar from './components/Calendar/Calendar';
import UserList from './components/UserList/UserList';
import { UserProvider, useUser } from './contexts/UserContext';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import ProfilePage from './components/Profile/Profile';
import { log } from 'console';

function App() {
    // let comments = [
    //     {
    //       id: 1,
    //       text: "message 1",
    //     },
    //     {
    //       id: 2,
    //       text: "message 2",
    //       children: [
    //         {
    //           id: 4,
    //           text: "message 4",
    //           children: [
    //             {
    //               id: 7,
    //               text: "message 7",
    //             },
    //             {
    //               id: 8,
    //               text: "message 8",
    //               children: [
    //                 {
    //                   id: 9,
    //                   text: "message 9",
    //                 },
    //                 {
    //                   id: 10,
    //                   text: "message 10",
    //                 },
    //               ],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       id: 5,
    //       text: "message 5",
    //     },
    //   ];
    // useEffect(()=>{
    //     setTimeout(() => {
    //         console.log('Timeout');    
    //     }, 0);
        // const myPromise1 = new Promise(() => {
        //     console.log('Promise');
        //   });
        // var alex = {age: 26};
        // alex.age = 29; 
        // var hery = {...(alex = {...alex}, alex, 42)};
        // alex.age = 31;
        // console.log(hery);

        //   let myPromise = new Promise((resolve, reject) => {
        
        //       resolve("Операция завершена успешно!"); // успешное завершение

        //       reject("Произошла ошибка."); // завершение с ошибкой

        //   });
        //   const promise = new Promise((resolve) => {
        //     console.log(2);
        //     resolve(new Promise((resolve) => {
        //       console.log(3);
        //       resolve(3);
        //     }));
        //   });
          
        //   promise.then((message) => {
        //     console.log(message);
        //   });
        //   console.log(4);

        //   async function myAsyncFunction() {
        //     try {
        //         // Создание и ожидание завершения промиса
        //          await console.log('SNaff');
        //         }
        //     catch (error) {
        //         // Этот блок выполнится, если промис завершится с ошибкой
        //         console.log(error); // Этот код выполнится в случае ошибки и выведет "Произошла ошибка."
        //     }
        // }
        
        // myPromise1.then();
        // setTimeout(() => {
        //     console.log(1);
        //   });
    // },[])
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

interface Comment{
    id: number
    text: string
    children?: Comment[]
}

const Comment: React.FC <{ comment: Comment }> = ({ comment }) => {
    let [isClose, SetisClose] = React.useState(true);
    let onHendleClose = ()=>{
        SetisClose(!isClose);
    }
    return(
    <li>
        <p onClick={onHendleClose}>
            {comment.text}
        </p>
        <li>
            {comment.children && isClose && <Comments  comments={comment.children}/>}
        </li>
    </li>
    )
};
const Comments: React.FC <{ comments: Comment[] }> = ({ comments }) => {
    return(
        <div>
            {
                comments.map( msg => (
                    <ul>
                        <Comment key={msg.id} comment={msg}/>
                    </ul>
                ))
            }
        </div>
    );
};
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
