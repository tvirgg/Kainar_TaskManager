import React from 'react';
import './Profile.css';


interface ProfileProps {
    name: string;
    profile_photo: string;
    dateOfBirth: Date;
}
const ProfilePage: React.FC<ProfileProps> = ({name, profile_photo, dateOfBirth}) =>{
    return(
        <div className="profile-page">
            <img src={profile_photo} alt={`${name}'s profile`} className="profile-photo" />
            <h1>{name}</h1>
            <p>Date of Birth: {dateOfBirth.toDateString()}</p>
        </div>
    );
}

export default ProfilePage;