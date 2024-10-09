// src/components/FavouriteContainer.jsx
import React, { useContext, useRef, useEffect } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../header/header_css/header.css';

const FavouriteContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const favContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (favContainerRef.current && !favContainerRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        if (activeMenu === 'favourite') {
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
            ref={favContainerRef}
            className={`favouriteContainer ${activeMenu === 'favourite' ? 'active' : ''}`}
        >
            <button className="closeFavourite" onClick={closeMenu}>X</button>
            <h2>Producto Favorito</h2>
            <p>Nombre del producto: Camiseta de Algodón</p>
            <p>Precio: $20.00</p>
            <p>Descripción: Camiseta de algodón suave y cómoda, ideal para el uso diario.</p>
        </div>
    );
};

export default FavouriteContainer;
