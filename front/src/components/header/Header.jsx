// src/components/Header.jsx
import React, { useContext } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../header/header_css/header.css';
import SideMenu from '../header/HeaderMenu';
import FavouriteContainer from '../header/HeaderFavourite';
import LoginContainer from '../header/HeaderLogIn';
import CartContainer from '../header/HeaderCart';
import ContactContainer from '../header/HeaderContact';
import FilterMenu from '../header/Header.jsx'; // Asegúrate de importar el componente de filtro

const Header = () => {
    const { activeMenu, toggleMenu, closeMenu, setActiveMenu } = useContext(HeaderContext);
    const { search, setSearch } = useContext(HeaderContext);

    const activateSearchMode = () => {
        setSearch({ term: '', mode: true });
        setActiveMenu(null); // Cierra cualquier otro menú
    };

    const handleSearch = () => {
        if (search.term.trim()) {
            console.log("Buscando:", search.term);
            // Aquí puedes agregar la lógica para buscar productos
        } else {
            console.log("Por favor, inserte un término de búsqueda.");
        }
    };

    const clearSearch = () => {
        setSearch({ ...search, term: '' });
    };

    const handleContainerToggle = (type) => {
        toggleMenu(type);
    };

    return (
        <>
            <div className="advertiseNews"></div>
            <header>
                <div className="headerContainer">
                    {!search.mode ? (
                        <>
                            <div className="headerLeft">
                                <div className="headerMenu">
                                    <button className='button headerButton' onClick={() => toggleMenu('sideMenu')}>
                                        <span className="material-symbols-outlined">menu</span>
                                        <h3 className="h3Style">Menú</h3>
                                    </button>
                                </div>
                                <div className="headerSearch">
                                    <button className='button headerButton' onClick={activateSearchMode}>
                                        <span className="material-symbols-outlined">search</span>
                                        <h3 className='h3Style'>Buscar</h3>
                                    </button>
                                </div>
                            </div>

                            <div className="headerCentral">
                                <h2 className="logo">LOGO</h2>
                            </div>

                            <div className="headerRight">
                                <div className="contact">
                                    <button className='button contactButton' onClick={() => handleContainerToggle('contact')}>
                                        <h3 className='h3Style'>Llámenos</h3>
                                    </button>
                                </div>
                                <div className="like">
                                    <button className='button favButton' onClick={() => handleContainerToggle('favourite')}>
                                        <span className="material-symbols-outlined">favorite</span>
                                    </button>
                                </div>
                                <div className="logIn">
                                    <button className='button logInButton' onClick={() => handleContainerToggle('login')}>
                                        <span className="material-symbols-outlined">person</span>
                                    </button>
                                </div>
                                <div className="shopCart">
                                    <button className='button cartButton' onClick={() => handleContainerToggle('cart')}>
                                        <span className="material-symbols-outlined">shopping_bag</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="headerSearchActive">
                            <input
                                type="text"
                                placeholder="Inserte su búsqueda..."
                                value={search.term}
                                onChange={(e) => setSearch({ ...search, term: e.target.value })}
                                className="searchBar"
                            />
                            <button className='button headerButton' onClick={handleSearch}>
                                <span className="material-symbols-outlined">search</span>
                            </button>
                            <button className='button clearButton' onClick={clearSearch}>
                                <span className="material-symbols-outlined">clear</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Componentes de Contenedores */}
            <SideMenu />
            <FavouriteContainer />
            <LoginContainer />
            <CartContainer />
            <ContactContainer />
            <FilterMenu /> {/* Asegúrate de incluir el componente de filtro */}
        </>
    );
};

export default Header;
