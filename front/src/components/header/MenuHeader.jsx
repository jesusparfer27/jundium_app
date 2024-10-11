import React, { useContext, useRef, useState } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/header.css';
import '../../css/components/header/menu.css'

const HeaderMenu = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const sideMenuRef = useRef(null);
    
    // Estado para manejar la visibilidad de la sección de género
    const [showGenderSection, setShowGenderSection] = useState('');
    const [isClosing, setIsClosing] = useState(false); // Estado para controlar el cierre
    const [isClickable, setIsClickable] = useState(true); // Controla si se pueden hacer clics en el menú

    // Función para mostrar la sección de género
    const handleGenderClick = (gender) => {
        if (!isClickable) return; // Si no se puede hacer clic, salir
        if (showGenderSection !== gender) {
            setShowGenderSection(gender);
        }
    };

    // Manejar el clic en el botón de cerrar
    const handleCloseMenu = () => {
        setIsClosing(true); // Iniciar la animación de cierre
        setIsClickable(false); // Desactivar clics mientras se cierra
        setTimeout(() => {
            closeMenu(); // Cerrar el menú después de un tiempo
            setIsClosing(false); // Restablecer el estado de cierre
            setIsClickable(true); // Volver a activar los clics
        }, 300); // 300ms debe coincidir con la duración de la animación
    };

    return (
        <>
            <div
                ref={sideMenuRef}
                className={`sideMenu ${activeMenu === 'sideMenu' ? 'open slideInHorizontal' : (isClosing ? 'close slideOutHorizontal' : '')}`}
            >
                <button className="closeMenu" onClick={handleCloseMenu}>X</button>
                <h2>Filtrar por:</h2>
                <button className="filterButton" onClick={() => handleGenderClick('Hombre')}>Hombre</button>
                <button className="filterButton" onClick={() => handleGenderClick('Mujer')}>Mujer</button>
            </div>

            {/* Contenedor de la sección de género */}
            {showGenderSection && (
                <div className={`genderSection ${activeMenu === 'sideMenu' ? 'open' : 'close'}`}>
                    <h3>Productos de {showGenderSection}</h3>
                    <div className="productNav">
                        {showGenderSection === 'Mujer' && (
                            <>
                                <a href="#bolsos">Bolsos</a>
                                <a href="#vestidos">Vestidos</a>
                                <a href="#joyas">Joyas</a>
                            </>
                        )}
                        {showGenderSection === 'Hombre' && (
                            <>
                                <a href="#camisas">Camisas</a>
                                <a href="#pantalones">Pantalones</a>
                                <a href="#zapatos">Zapatos</a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default HeaderMenu;
