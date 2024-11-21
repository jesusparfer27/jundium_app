// src/components/ContactContainer.jsx
import React, { useContext, useState } from 'react';
import  { useUser } from '../../hooks/useUser'
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/checkout/checkout_component.css'

export const Modal = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    
    const { user } = useUser()
    console.log(user)

    return (
        <div
            className={`checkoutContainer_slide  ${activeMenu === 'modalInfo_CheckOut' ? 'active slideInHorizontalRightToLeft ' : ''}`}
        >
            
        </div>
    );
};

