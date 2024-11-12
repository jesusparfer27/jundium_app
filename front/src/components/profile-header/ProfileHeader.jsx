import React from 'react';
import '../../css/components/profile-header/profileheader.css';
import pictureProfile from '../../assets/profile-picture/example-profile-picture.jpg'

const ProfileImage = ({ initials, userName, isAdmin }) => {
    const displayInitials = isAdmin ? 'ADMIN' : initials;

    return (
        <div className="profile-image">
            <img className='imgHeader_Profile' src={pictureProfile} alt="Perfil" />
            <div className="containerPadding_Image"></div>
            <div className="backgroundPadding_Image">
                <div className="profile-initials">{displayInitials}</div>
                <div className="user_name">{userName}</div>
            </div>
        </div>
    );
};

export default ProfileImage;
