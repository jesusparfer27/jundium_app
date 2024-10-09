// src/components/CartContainer.jsx
import React, { useContext, useRef, useEffect } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../header/header_css/header.css';

const CartContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const cartContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartContainerRef.current && !cartContainerRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        if (activeMenu === 'cart') {
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
            ref={cartContainerRef}
            className={`cartContainer ${activeMenu === 'cart' ? 'active' : ''}`}
        >
            <button className="closeContainer" onClick={closeMenu}>X</button>
            <h2>Carrito</h2>
            <p>No hay productos en su carrito.</p>
        </div>
    );
};

export default CartContainer;
