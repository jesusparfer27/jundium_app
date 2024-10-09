// src/components/ContactContainer.jsx
import React, { useContext, useRef, useEffect } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../header/header_css/header.css';

const ContactContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const contactContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contactContainerRef.current && !contactContainerRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        if (activeMenu === 'contact') {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenu, closeMenu]);

    return (
        <div
            ref={contactContainerRef}
            className={`contactContainer ${activeMenu === 'contact' ? 'active' : ''}`}
        >
            <button className="closeContainer" onClick={closeMenu}>X</button>
            <h2>Contáctenos</h2>
            <p>Teléfono: 123-456-7890</p>
        </div>
    );
};

export default ContactContainer;
