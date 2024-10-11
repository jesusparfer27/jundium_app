// src/components/Header.jsx
import React, { useContext, useEffect, useState } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/header.css';
import HeaderMenu from './MenuHeader';
import FavouriteContainer from './FavouriteHeader';
import LoginContainer from './LoginHeader';
import CartContainer from './CartHeader';
import ContactContainer from './ContactHeader';
import HeaderSearch from './SearchHeader'; // Importamos el nuevo componente HeaderSearch

const Header = () => {
    const { activeMenu, openMenu, search } = useContext(HeaderContext);
    const [isScrolled, setIsScrolled] = useState(false);

    // Manejar el evento de scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Limpiar el evento al desmontar el componente
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <header>
                <div className={`headerContainer ${isScrolled ? 'scrolled' : ''}`}>
                    {!search.mode ? (
                        <>
                            <div className="headerLeft">
                                <div className="headerMenu">
                                    <button className='button headerButton' onClick={() => openMenu('sideMenu')}>
                                        <span className="material-symbols-outlined">menu</span>
                                        <h3 className="h3Style">Menú</h3>
                                    </button>
                                </div>
                                <div className="headerSearch">
                                    <button className='button headerButton' onClick={() => openMenu('searchBar')}>
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
                                    <button className='button contactButton' onClick={() => openMenu('contact')}>
                                        <h3 className='h3Style'>Llámenos</h3>
                                    </button>
                                </div>
                                <div className="like">
                                    <button className='button favButton' onClick={() => openMenu('favourite')}>
                                        <span className="material-symbols-outlined">favorite</span>
                                    </button>
                                </div>
                                <div className="logIn">
                                    <button className='button logInButton' onClick={() => openMenu('login')}>
                                        <span className="material-symbols-outlined">person</span>
                                    </button>
                                </div>
                                <div className="shopCart">
                                    <button className='button cartButton' onClick={() => openMenu('cart')}>
                                        <span className="material-symbols-outlined">shopping_bag</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <HeaderSearch /> // Renderiza el componente HeaderSearch cuando el modo de búsqueda está activo
                    )}
                </div>
            </header>

            {/* Componentes de Contenedores */}
            {activeMenu === 'sideMenu' && <HeaderMenu />}
            {activeMenu === 'favourite' && <FavouriteContainer />}
            {activeMenu === 'login' && <LoginContainer />}
            {activeMenu === 'cart' && <CartContainer />}
            {activeMenu === 'contact' && <ContactContainer />}
        </>
    );
};

export default Header;
