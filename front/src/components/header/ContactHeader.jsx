// src/components/ContactContainer.jsx
import React, { useContext, useRef, useEffect } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/header.css';
import '../../css/components/header/contact.css'

const ContactContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const contactContainerRef = useRef(null);


    return (
        <div
            ref={contactContainerRef}
            className={`contactContainer ${activeMenu === 'contact' ? 'active slideInVertical' : ''}`}
        >
            <button className="closeContainer" onClick={closeMenu}>X</button>
            <h2>Contáctenos</h2>
            <p>Teléfono: 123-456-7890</p>
        </div>
    );
};

export default ContactContainer;
