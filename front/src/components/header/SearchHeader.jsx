import React, { useContext, useRef, useState } from 'react';
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
    const [gender, setGender] = useState('');
    const [type, setType] = useState('');
    const [showRecommendations, setShowRecommendations] = useState(false); 
    const [recommendations, setRecommendations] = useState([]);
    const { VITE_API_BACKEND, VITE_PRODUCTS_ENDPOINT } = import.meta.env;

    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setShowRecommendations(term.length > 0); // Muestra recomendaciones si hay algo escrito

        if (term) {
            try {
                const response = await axios.get(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}`);
                const products = response.data;

                const filteredRecommendations = products
                    .filter((product) => {
                        const matchesSearchTerm =
                            product.name.toLowerCase().includes(term.toLowerCase()) ||
                            product.brand.toLowerCase().includes(term.toLowerCase()) ||
                            product.collection.toLowerCase().includes(term.toLowerCase()) ||
                            product.type.toLowerCase().includes(term.toLowerCase()) ||
                            product.gender.toLowerCase().includes(term.toLowerCase());

                        // Filtros adicionales por género y tipo si están definidos
                        const matchesGender = gender ? product.gender.toLowerCase() === gender.toLowerCase() : true;
                        const matchesType = type ? product.type.toLowerCase() === type.toLowerCase() : true;

                        return matchesSearchTerm && matchesGender && matchesType;
                    })
                    .map((product) => product.name);

                // Obtener recomendaciones únicas y limitar a 5
                const uniqueRecommendations = [...new Set(filteredRecommendations)].slice(0, 5);
                setRecommendations(uniqueRecommendations);
            } catch (error) {
                console.error('Error fetching product recommendations:', error);
            }
        } else {
            setRecommendations([]);
        }
    };

    const handleSearchSubmit = () => {
        let searchQuery = `/products?search=${encodeURIComponent(searchTerm)}`;

        if (gender) {
            searchQuery += `&gender=${encodeURIComponent(gender)}`;
        }

        if (type) {
            searchQuery += `&type=${encodeURIComponent(type)}`;
        }

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
                        className={`searchBar ${activeMenu === 'searchBar' ? 'activeSearch' : ''}`}
                    />
                    <div className="groupButtons_Header">
                        <button className="closeButtonHeader" onClick={handleCloseSearch}>X</button>
                        <button className="searchButton" onClick={handleSearchSubmit}>Buscar</button>
                    </div>
                </div>
            </div>

            <div className="searchBarRecentSearches_Container">
                <div className="recentSearches_Block">
                    <div className="recentSearches_Container">
                        <div className="recentSearches_block">
                            <ul className='recentSearches_flexRow'>
                                <span>Busquedas recientes</span>
                                <li><NavLink to="/products?search=Renueva%20en%20ofertas">Renueva en ofertas</NavLink></li>
                                <li><NavLink to="/products?search=Descubre%20trends">Descubre trends</NavLink></li>
                                <li><NavLink to="/products?search=Eventos%20de%20última%20hora">Eventos de última hora</NavLink></li>
                                <li><NavLink to="/products?search=Zapatillas%20de%20polietileno">Zapatillas de polietileno</NavLink></li>
                            </ul>
                        </div>
                    </div>

                    <div className={`searchRecomendation_Container ${showRecommendations ? 'visible' : 'hidden'}`}>
                        <div className="searchRecomendation_flexColumn"></div>
                        <div className="searchRecomendation_flexColumn">
                            <span>Para explorar...</span>
                            <ul className='groupList_searchesRecomendations'>
                                {recommendations.map((rec, index) => (
                                    <li className='recomendSearches'  key={index}>
                                        <NavLink  to={`/products?search=${encodeURIComponent(rec)}`}>{rec}</NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
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
                                        className="searchHeader_Image"
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
