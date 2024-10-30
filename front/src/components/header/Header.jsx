import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/header.css';
import HeaderMenu from './MenuHeader';
import LoginContainer from './LoginHeader';
import CartContainer from './CartHeader';
import ContactContainer from './ContactHeader';
import HeaderSearch from './SearchHeader';
import { FilterProducts } from './FilterProducts';

const Header = () => {
    const { activeMenu, openMenu } = useContext(HeaderContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [isProductsPage, setIsProductsPage] = useState(false);

    // Determinar si estamos en ProductsPage
    useEffect(() => {
        setIsProductsPage(location.pathname === '/products');
    }, [location.pathname]);

    // Función para manejar el clic en el botón de login
// Función para manejar el clic en el botón de login
useEffect(() => {
    const isProducts = location.pathname === '/products';
    if (isProducts !== isProductsPage) {
        setIsProductsPage(isProducts);
    }
}, [location.pathname, setIsProductsPage]);

const handleLoginClick = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        openMenu('login');
    } else {
        navigate('/profile');
    }
};

    return (
        <>
            <header className={`headerContainer ${isProductsPage ? 'productsPageActive' : ''}`}>
                <div className="headerContainer">
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
                        <Link to="/" className="logo">LOGO</Link>
                    </div>

                    <div className="headerRight">
                        <div className="contact">
                            <button className='button contactButton' onClick={() => openMenu('contact')}>
                                <h3 className='h3Style'>Llámenos</h3>
                            </button>
                        </div>
                        <div className="like">
                            <button className='button favButton' onClick={() => navigate('/wish-list')}>
                                <span className="material-symbols-outlined">favorite</span>
                            </button>
                        </div>
                        <div className="logIn">
                            <button className='button logInButton' onClick={handleLoginClick}>
                                <span className="material-symbols-outlined">person</span>
                            </button>
                        </div>
                        <div className="shopCart">
                            <button className='button cartButton' onClick={() => openMenu('cart')}>
                                <span className="material-symbols-outlined">shopping_bag</span>
                            </button>
                        </div>
                    </div>
                </div>

                {isProductsPage && (
                    <div className="headerFilter_Container">
                        <div className="headerFilter">
                            <button className='button_filterButton' onClick={() => openMenu('button_filterButton')}>
                                <span className="material-symbols-outlined">filter_list</span>
                                <h3 className='h3Style'>Filtrar</h3>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Componentes de Contenedores */}
            {activeMenu === 'sideMenu' && <HeaderMenu />}
            {activeMenu === 'login' && <LoginContainer />}
            {activeMenu === 'cart' && <CartContainer />}
            {activeMenu === 'contact' && <ContactContainer />}
            {activeMenu === 'searchBar' && <HeaderSearch />}
            {activeMenu === 'button_filterButton' && <FilterProducts />}
        </>
    );
};

export default Header;
