import React from 'react';
import pictureProfile from '../../assets/photos/pexels-kaip-996329.jpg';
import '../../css/components/profile-header/profileheader.css';

const ProfileImage = ({ initials, userName, isAdmin }) => {
    const displayInitials = isAdmin ? 'ADMIN' : initials;

    return (
        <div className="profile-image">
            <img src={pictureProfile} alt="Perfil" />
            <div className="backgroundPadding_Image">
                <div className="profile-initials">{displayInitials}</div>
                <div className="user_name">{userName}</div>
            </div>
        </div>
    );
};

export default ProfileImage;
