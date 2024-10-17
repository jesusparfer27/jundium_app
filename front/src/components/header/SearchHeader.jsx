import React, { useContext, useRef } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/search.css';

const HeaderSearch = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const searchRef = useRef(null);

    const handleSearch = (e) => {
        // Aquí puedes manejar la lógica de búsqueda, si es necesario
        console.log("Buscando:", e.target.value);
    };

    return (
        <div
            ref={searchRef}
            className={`searchContainer ${activeMenu === 'searchBar' ? 'active slideIn' : 'slideOut'}`}
        >

            {/* Primer div para la barra de búsqueda */}
            <div className="searchInputContainer">
                <div className="searchContent">
                    <input
                        type="text"
                        placeholder="Inserte su búsqueda..."
                        onChange={handleSearch}
                        className="searchBar"
                    />
                    <button className="clearButton" onClick={() => (searchRef.current.value = '')}>Eliminar</button>
                </div>
            </div>

            {/* Segundo div para el texto adicional */}
            <div className="additionalTextContainer">
                <p>Aquí puedes buscar productos, colecciones, y más.</p>
            </div>
        </div>
    );
};

export default HeaderSearch;
