import React, { useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/search.css';

import ManSectionHeader from '../../assets/header-sections/example-menu-header-man-section.jpg';
import WomanSectionHeader from '../../assets/header-sections/example-menu-header-woman-section.jpg';
import CollectionsSectionHeader from '../../assets/header-sections/example-menu-home-collections.jpg';
import DiscountSectionHeader from '../../assets/header-sections/example-menu-header-man-section.jpg';

const categoriesData = [
    { id: 1, name: "Otoño collection", image: ManSectionHeader, collection: "Otoño 2024" },
    { id: 2, name: "Invierno collection", image: WomanSectionHeader, collection: "Invierno 2024" },
    { id: 3, name: "Primavera collection", image: CollectionsSectionHeader, collection: "Primavera 2024" },
    { id: 4, name: "Verano collection", image: DiscountSectionHeader, collection: "Verano 2024" }
];

const HeaderSearch = () => {
    const { activeMenu, openMenu } = useContext(HeaderContext);
    const searchRef = useRef(null);

    const handleSearch = (e) => {
        console.log("Buscando:", e.target.value);
    };

    const handleCloseSearch = () => {
        openMenu(null);
    };

    return (
        <div
            ref={searchRef}
            className={`searchContainer ${activeMenu === 'searchBar' ? 'active' : ''}`}
        >
            <div className={`searchInputContainer ${activeMenu === 'searchBar' ? 'slideInVertical' : 'slideOutVertical'}`}>
                <div className="searchContent flexRow">
                    <input
                        type="text"
                        placeholder="Inserte su búsqueda..."
                        onChange={handleSearch}
                        className="searchBar"
                    />
                    <button className="closeButtonHeader" onClick={handleCloseSearch}>X</button>
                </div>
            </div>

            <div className={`additionalTextContainer ${activeMenu === 'searchBar' ? 'slideInWithDelay' : 'slideOutWithDelay'}`}>
                <div className="flexRow">
                    <div className="popularSearches">
                        <div className="genderSearch">
                            <div className="maleSearch">
                                <h4>Hombre</h4>
                                <ul>
                                    <li><NavLink to="/category/camisetas">Camisetas</NavLink></li>
                                    <li><NavLink to="/category/zapatos">Zapatos</NavLink></li>
                                    <li><NavLink to="/category/pantalones">Pantalones</NavLink></li>
                                </ul>
                            </div>
                            <div className="femaleSearch">
                                <h4>Mujer</h4>
                                <ul>
                                    <li><NavLink to="/category/vestidos">Vestidos</NavLink></li>
                                    <li><NavLink to="/category/tacones">Tacones</NavLink></li>
                                    <li><NavLink to="/category/accesorios">Accesorios</NavLink></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="productGridHeader">
                        <h3>Productos Destacados</h3>
                        <div className="gridContainer">
                            {categoriesData.map((category) => (
                                <NavLink
                                    to={`/products?${category.collection ? `collection=${encodeURIComponent(category.collection)}` : `type=${encodeURIComponent(category.type)}`}`}
                                    key={category.id}
                                    className="productItemHeader"
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className='searchHeader_Image'
                                    />
                                    <p>{category.name}</p>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderSearch;
