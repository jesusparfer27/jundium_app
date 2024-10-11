// src/components/FavouriteContainer.jsx
import React, { useContext, useRef, useEffect } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/favourite.css';
import '../../css/components/header/header.css'

const FavouriteContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const favContainerRef = useRef(null);

    // Simulación de productos favoritos
    const favouriteItems = [
        {
            id: 1,
            name: 'Camiseta de Algodón',
            price: '$20.00',
            description: 'Camiseta de algodón suave y cómoda, ideal para el uso diario.',
        },
        {
            id: 2,
            name: 'Jeans Ajustados',
            price: '$35.00',
            description: 'Jeans ajustados que se adaptan a tu figura, perfectos para cualquier ocasión.',
        },
        {
            id: 3,
            name: 'Chaqueta de Cuero',
            price: '$50.00',
            description: 'Chaqueta de cuero de alta calidad, ideal para un look elegante.',
        },
        {
            id: 4,
            name: 'Zapatillas Deportivas',
            price: '$45.00',
            description: 'Zapatillas deportivas cómodas y con estilo para tu día a día.',
        },
        {
            id: 5,
            name: 'Vestido de Verano',
            price: '$30.00',
            description: 'Vestido ligero y fresco, perfecto para los días de verano.',
        },
    ];

    return (
        <div
            ref={favContainerRef}
            className={`favouriteContainer ${activeMenu === 'favourite' ? 'active' : ''}`}
        >
            <button className="closeFavourite" onClick={closeMenu}>X</button>
            <h2>Productos Favoritos</h2>
            <div className="favouriteItems">
                {favouriteItems.map(item => (
                    <div key={item.id} className="favouriteItem">
                        <h3>{item.name}</h3>
                        <p>Precio: {item.price}</p>
                        <p>Descripción: {item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavouriteContainer;
