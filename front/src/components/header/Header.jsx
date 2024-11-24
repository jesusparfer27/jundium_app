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

    const news = [
        { text: 'Promoción especial', link: '/promocion' },
        { text: 'Descubre nuestras ofertas', link: '/ofertas' },
    ]
    const [activeNewsIndex, setActiveNewsIndex] = useState(0);
    const [isNewsVisible, setIsNewsVisible] = useState(true);

    useEffect(() => {
        setIsProductsPage(location.pathname === '/products');
    }, [location.pathname]);

    useEffect(() => {
        if (isNewsVisible) {
            const interval = setInterval(() => {
                setActiveNewsIndex((prevIndex) => (prevIndex + 1) % news.length);
            }, 3000); // Cambiar cada 3 segundos
            return () => clearInterval(interval);
        }
    }, [isNewsVisible]);

    const handleLoginClick = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            openMenu('login');
        } else {
            navigate('/profile');
        }
    };

    const removeHeaderNews = () => {
        setIsNewsVisible(false);
    };

    return (
        <>
            <header className="headerMainContainer">
                {isNewsVisible && (
                    <div className="headerNews_Container">
                        <div className="containerNews_sections">
                            <div className="pauseNews"></div>
                            <div className="newsInformation">
                                <p>
                                    <Link to={news[activeNewsIndex].link}>
                                        {news[activeNewsIndex].text}{' '}
                                    </Link>
                                </p>
                            </div>
                            <div className="removeNews" onClick={removeHeaderNews}>
                                <span className="material-symbols-outlined">close</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`headerContainer ${isProductsPage ? 'productsPageActive' : ''}`}>
                    <div className="headerLeft">
                        <div className="headerMenu">
                            <button className="button headerButton" onClick={() => openMenu('sideMenu')}>
                                <span className="material-symbols-outlined">menu</span>
                                <h3 className="h3Style">Menú</h3>
                            </button>
                        </div>
                        <div className="headerSearch">
                            <button className="button headerButton" onClick={() => openMenu('searchBar')}>
                                <span className="material-symbols-outlined">search</span>
                                <h3 className="h3Style">Buscar</h3>
                            </button>
                        </div>
                    </div>

                    <div className="headerCentral">
                        <Link to="/" className="logo">LOGO</Link>
                    </div>

                    <div className="headerRight">
                        <div className="contact">
                            <button className="button contactButton" onClick={() => openMenu('contact')}>
                                <h3 className="h3Style">Llámenos</h3>
                            </button>
                        </div>
                        <div className="like">
                            <button className="button favButton" onClick={() => navigate('/wish-list')}>
                                <span className="material-symbols-outlined">favorite</span>
                            </button>
                        </div>
                        <div className="logIn">
                            <button className="button logInButton" onClick={handleLoginClick}>
                                <span className="material-symbols-outlined">person</span>
                            </button>
                        </div>
                        <div className="shopCart">
                            <button className="button cartButton" onClick={() => openMenu('cart')}>
                                <span className="material-symbols-outlined">shopping_bag</span>
                            </button>
                        </div>
                    </div>
                </div>

                {isProductsPage && (
                    <div className="headerFilter_Container">
                        <div className="headerFilter">
                            <div className="flexButton_FilterColumn">
                                <div className="flexButton_Filter">
                                    <button className="button_filterButton" onClick={() => openMenu('filter')}>
                                        <span className="material-symbols-outlined">filter_list</span>
                                        <h3 className="h3Style_Filter">Filtrar</h3>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {activeMenu === 'sideMenu' && <HeaderMenu />}
            {activeMenu === 'login' && <LoginContainer />}
            {activeMenu === 'cart' && <CartContainer />}
            {activeMenu === 'contact' && <ContactContainer />}
            {activeMenu === 'searchBar' && <HeaderSearch />}
            {activeMenu === 'filter' && <FilterProducts />}
        </>
    );
};

export default Header;
