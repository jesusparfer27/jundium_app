// src/components/LoginContainer.jsx
import React, { useContext, useRef, useEffect } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../header/header_css/header.css';

const LoginContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const loginContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (loginContainerRef.current && !loginContainerRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        if (activeMenu === 'login') {
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
            ref={loginContainerRef}
            className={`loginContainer ${activeMenu === 'login' ? 'active' : ''}`}
        >
            <button className="closeContainer" onClick={closeMenu}>X</button>
            <h2>Iniciar Sesión</h2>
            <input type="text" placeholder="Correo electrónico" />
            <input type="password" placeholder="Contraseña" />
            <button>Iniciar Sesión</button>
        </div>
    );
};

export default LoginContainer;
