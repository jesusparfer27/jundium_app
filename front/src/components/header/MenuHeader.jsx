import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/header.css';
import '../../css/components/header/menu.css';

const HeaderMenu = () => {
    const { activeMenu, closeMenu, setMenuOpen } = useContext(HeaderContext);
    const sideMenuRef = useRef(null);
    const location = useLocation();
    const [showGenderSection, setShowGenderSection] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [isClickable, setIsClickable] = useState(true);
    const [color, setColor] = useState('transparent');
    const [imageColor, setImageColor] = useState('transparent');

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname, setMenuOpen]);

    const handleGenderClick = (gender) => {
        if (!isClickable) return;
        setShowGenderSection((prev) => (prev === gender ? '' : gender));

        switch (gender) {
            case 'Hombre':
                setColor('#E0F7FA');
                setImageColor('#00796B'); // Color más oscuro
                break;
            case 'Mujer':
                setColor('#FCE4EC');
                setImageColor('#D81B60'); // Color más oscuro
                break;
            case 'Colecciones':
                setColor('#E8F5E9');
                setImageColor('#388E3C'); // Color más oscuro
                break;
            case 'Descuentos':
                setColor('#FFF3E0');
                setImageColor('#F57C00'); // Color más oscuro
                break;
            default:
                setColor('transparent');
                setImageColor('transparent');
                break;
        }
    };

    const handleCloseMenu = () => {
        setIsClosing(true);
        setIsClickable(false);
        setTimeout(() => {
            closeMenu();
            setIsClosing(false);
            setIsClickable(true);
        }, 300);
    };

    const handleLinkClick = () => {
        setMenuOpen(false);
        handleCloseMenu();
        window.scrollTo(0, 0);
    };

    return (
        <>
            <div
                ref={sideMenuRef}
                className={`sideMenu ${activeMenu === 'sideMenu' ? 'open slideInHorizontal' : (isClosing ? 'close slideOutHorizontal' : '')}`}
            >
                <button className="closeMenu" onClick={handleCloseMenu}>X</button>
                <h2>Filtrar por:</h2>
                <button className="filterButtonMenu" onClick={() => handleGenderClick('Hombre')}>Hombre</button>
                <button className="filterButtonMenu" onClick={() => handleGenderClick('Mujer')}>Mujer</button>
                <button className="filterButtonMenu" onClick={() => handleGenderClick('Colecciones')}>Colecciones</button>
                <button className="filterButtonMenu" onClick={() => handleGenderClick('Descuentos')}>Descuentos</button>
                <div className="headerFooter">
                    <div className="soporte">
                        <div className="title-headerFooter">Soporte</div>
                        <Link to="/contact-us">Contact Us</Link>
                        <Link to="/faq">FAQ</Link>
                        <Link to="/terms">Terms and Conditions</Link>
                    </div>
                </div>
            </div>

            {showGenderSection && (
                <div 
                    className={`genderSection ${activeMenu === 'sideMenu' ? 'open' : 'close'}`}
                    style={{ backgroundColor: color }} 
                >
                    
                    {/* Simulación de foto para cada sección */}
                    <div 
                        className="sectionImage"
                        style={{
                            backgroundColor: imageColor,
                            width: '90%',
                            height: '300px',
                            margin: '10px auto',
                            borderRadius: '8px',
                        }}
                    ></div>
                    <h3 
                    style={{
                        color: 'black',
                        paddingLeft: '1rem',
                        paddingTop: '2rem'
                    }}
                    >
                        Productos de {showGenderSection}</h3>
                    <div className="productNav">
                        {showGenderSection === 'Mujer' && (
                            <>
                                <Link to="/woman-bags" onClick={handleLinkClick}>Bolsos</Link>
                                <Link to="/woman-collection" onClick={handleLinkClick}>Winter Collection</Link>
                                <Link to="/woman-shoes" onClick={handleLinkClick}>Zapatos</Link>
                            </>
                        )}
                        {showGenderSection === 'Hombre' && (
                            <>
                                <Link to="/man-bags" onClick={handleLinkClick}>Bolsos</Link>
                                <Link to="/man-collection" onClick={handleLinkClick}>Ropa</Link>
                                <Link to="/man-shoes" onClick={handleLinkClick}>Zapatos</Link>
                            </>
                        )}
                        {showGenderSection === 'Colecciones' && (
                            <>
                                <Link to="/new-arrivals" onClick={handleLinkClick}>Nuevas Llegadas</Link>
                                <Link to="/seasonal-collection" onClick={handleLinkClick}>Colección de Temporada</Link>
                            </>
                        )}
                        {showGenderSection === 'Descuentos' && (
                            <>
                                <Link to="/discounts" onClick={handleLinkClick}>Ofertas Especiales</Link>
                                <Link to="/clearance" onClick={handleLinkClick}>Liquidaciones</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default HeaderMenu;
