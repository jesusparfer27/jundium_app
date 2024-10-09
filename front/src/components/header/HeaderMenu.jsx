// src/components/SideMenu.jsx
import React, { useContext, useRef, useEffect } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../header/header_css/header.css';

const SideMenu = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const sideMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        if (activeMenu === 'sideMenu') {
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
            ref={sideMenuRef}
            className={`sideMenu ${activeMenu === 'sideMenu' ? 'open' : ''}`}
        >
            <button className="closeMenu" onClick={closeMenu}>X</button>
            <h2>Filtrar por:</h2>
            <button className="filterButton">Hombre</button>
            <button className="filterButton">Mujer</button>
        </div>
    );
};

export default SideMenu;
