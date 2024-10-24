import React, { useContext, useRef } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
// import PhotoMockup from '../../assets/photos/pexels-d-ng-thanh-tu-2922122-5693888.jpg';
import '../../css/components/header/search.css';

const HeaderSearch = () => {
    const { activeMenu, openMenu } = useContext(HeaderContext);
    const searchRef = useRef(null);

    const handleSearch = (e) => {
        console.log("Buscando:", e.target.value);
    };

    const handleCloseSearch = () => {
        openMenu(null); // o 'openMenu('')' si quieres establecer otro estado
    };

    return (
        <div
            ref={searchRef}
            className={`searchContainer ${activeMenu === 'searchBar' ? 'active' : ''}`}
        >
            {/* Primer div para la barra de búsqueda */}
            <div className={`searchInputContainer ${activeMenu === 'searchBar' ? 'slideInVertical' : 'slideOutVertical'}`}>
                <div className="searchContent flexRow"> {/* Agregar flexRow para alinear en fila */}
                    <input
                        type="text"
                        placeholder="Inserte su búsqueda..."
                        onChange={handleSearch}
                        className="searchBar"
                    />
                    <button className="closeButtonHeader" onClick={handleCloseSearch}>X</button>
                </div>
            </div>

            {/* Segundo div para el texto adicional */}
            <div className={`additionalTextContainer ${activeMenu === 'searchBar' ? 'slideInWithDelay' : 'slideOutWithDelay'}`}>
                <div className="flexRow">
                    {/* Div para lo más buscado por género */}
                    <div className="popularSearches">
                        <div className="genderSearch">
                            <div className="maleSearch">
                                <h4>Hombre</h4>
                                <ul>
                                    <li><a href="/category/camisetas">Camisetas</a></li>
                                    <li><a href="/category/zapatos">Zapatos</a></li>
                                    <li><a href="/category/pantalones">Pantalones</a></li>
                                </ul>
                            </div>
                            <div className="femaleSearch">
                                <h4>Mujer</h4>
                                <ul>
                                    <li><a href="/category/vestidos">Vestidos</a></li>
                                    <li><a href="/category/tacones">Tacones</a></li>
                                    <li><a href="/category/accesorios">Accesorios</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Div para la cuadrícula de productos */}
                    <div className="productGridHeader">
                        <h3>Productos Destacados</h3>
                        <div className="gridContainer">
                            <div className="productItemHeader">
                                <img src={PhotoMockup} alt="Producto 1" />
                                <p>Producto 1</p>
                            </div>
                            <div className="productItemHeader">
                                <img src={PhotoMockup} alt="Producto 2" />
                                <p>Producto 2</p>
                            </div>
                            <div className="productItemHeader">
                                <img src={PhotoMockup} alt="Producto 3" />
                                <p>Producto 3</p>
                            </div>
                            <div className="productItemHeader">
                                <img src={PhotoMockup} alt="Producto 4" />
                                <p>Producto 4</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderSearch;
