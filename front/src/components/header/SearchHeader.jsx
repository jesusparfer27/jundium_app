import React, { useContext, useRef, useState, useEffect } from 'react'; 
import { NavLink, useNavigate } from 'react-router-dom';
import { HeaderContext } from '../../context/HeaderContext';
import axios from 'axios';

import '../../css/components/header/search.css';

import ManSectionHeader from '../../assets/header-sections/example-menu-header-man-section.jpg';
import WomanSectionHeader from '../../assets/header-sections/example-menu-header-woman-section.jpg';
import CollectionsSectionHeader from '../../assets/header-sections/example-menu-home-collections.jpg';
import DiscountSectionHeader from '../../assets/header-sections/example-menu-header-man-section.jpg';

const categoriesData = [
    { id: 1, name: "Otoño collection", image: ManSectionHeader, collection: "Otoño 2024", type: "Autumn" },
    { id: 2, name: "Invierno collection", image: WomanSectionHeader, collection: "Invierno 2024", type: "Winter" },
    { id: 3, name: "Primavera collection", image: CollectionsSectionHeader, collection: "Primavera 2024", type: "Spring" },
    { id: 4, name: "Verano collection", image: DiscountSectionHeader, collection: "Verano 2024", type: "Summer" }
];

const HeaderSearch = () => {
    const { activeMenu, openMenu } = useContext(HeaderContext);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [gender, setGender] = useState('');  // Estado para el filtro de género
    const [type, setType] = useState('');      // Estado para el filtro de tipo de producto

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (searchTerm) {
            // Hacer la llamada a la API para obtener productos filtrados según la búsqueda
            axios.get('/API/v1/products')
                .then(response => {
                    let filtered = response.data;

                    // Filtrar según el término de búsqueda
                    if (searchTerm) {
                        filtered = filtered.filter(product =>
                            product.name.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                    }

                    // Filtrar por género si está presente
                    if (gender) {
                        filtered = filtered.filter(product => 
                            product.gender.toLowerCase() === gender.toLowerCase()
                        );
                    }

                    // Filtrar por tipo si está presente
                    if (type) {
                        filtered = filtered.filter(product => 
                            product.type.toLowerCase() === type.toLowerCase()
                        );
                    }
                })
                .catch(error => {
                    console.error('Error al obtener los productos:', error);
                });
        }
    }, [searchTerm, gender, type]); // Ejecutar cuando cambian los filtros o el término de búsqueda

    const handleSearchSubmit = () => {
        // Construcción de la URL de búsqueda con filtros adicionales
        let searchQuery = `/products?search=${encodeURIComponent(searchTerm)}`;
        
        if (gender) {
            searchQuery += `&gender=${encodeURIComponent(gender)}`;
        }
        
        if (type) {
            searchQuery += `&type=${encodeURIComponent(type)}`;
        }

        // Redirigir a la página de resultados de búsqueda
        navigate(searchQuery);
    };

    const handleCloseSearch = () => {
        openMenu(null);
    };

    return (
        <div ref={searchRef} className={`searchContainer ${activeMenu === 'searchBar' ? 'active' : ''}`}>
            <div className={`searchInputContainer ${activeMenu === 'searchBar' ? 'slideInVertical' : 'slideOutVertical'}`}>
                <div className="searchContent flexRow">
                    <input
                        type="text"
                        placeholder="Inserte su búsqueda..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="searchBar"
                    />
                    <button className="closeButtonHeader" onClick={handleCloseSearch}>X</button>
                    <button className="searchButton" onClick={handleSearchSubmit}>Buscar</button>
                </div>
            </div>

            <div className={`additionalTextContainer ${activeMenu === 'searchBar' ? 'slideInWithDelay' : 'slideOutWithDelay'}`}>
                <div className="flexRow">
                    <div className="popularSearches">
                        <div className="genderSearch">
                            <div className="maleSearch">
                                <h4>Hombre</h4>
                                <ul>
                                    <li><NavLink to="/category/camisetas" onClick={() => setType('camisetas')}>Camisetas</NavLink></li>
                                    <li><NavLink to="/category/zapatos" onClick={() => setType('zapatos')}>Zapatos</NavLink></li>
                                    <li><NavLink to="/category/pantalones" onClick={() => setType('pantalones')}>Pantalones</NavLink></li>
                                </ul>
                            </div>
                            <div className="femaleSearch">
                                <h4>Mujer</h4>
                                <ul>
                                    <li><NavLink to="/category/vestidos" onClick={() => setType('vestidos')}>Vestidos</NavLink></li>
                                    <li><NavLink to="/category/tacones" onClick={() => setType('tacones')}>Tacones</NavLink></li>
                                    <li><NavLink to="/category/accesorios" onClick={() => setType('accesorios')}>Accesorios</NavLink></li>
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
