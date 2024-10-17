import React, { createContext, useState } from 'react';

// Crear el contexto
export const HeaderContext = createContext();

// Proveedor del contexto
export const HeaderProvider = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar si el menú está abierto
    const [activeMenu, setActiveMenu] = useState(''); // Estado para el menú activo
    const [overlayVisible, setOverlayVisible] = useState(false); // Estado para la capa de superposición

    // Función para alternar el menú
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev); // Alterna el estado del menú
    };

    // Función para cerrar el menú
    const closeMenu = () => {
        setActiveMenu(''); // Restablece el menú activo
        setOverlayVisible(false); // Oculta la capa al cerrar el menú
        setMenuOpen(false); // Asegura que el menú se cierre
    };

    // Función para abrir un menú específico
    const openMenu = (type) => {
        if (activeMenu === type) {
            closeMenu(); // Si el menú activo es el mismo, se cierra
        } else {
            setActiveMenu(type); // Establece el nuevo menú activo
            setOverlayVisible(true); // Muestra la capa de superposición
        }
    };

    // Función para manejar el clic en la capa de superposición
    const handleOverlayClick = () => {
        closeMenu(); // Cierra el menú al hacer clic en la superposición
    };

    // Valores del contexto que se pasan a los componentes hijos
    const value = {
        menuOpen,
        activeMenu,
        overlayVisible,
        toggleMenu,
        closeMenu,
        openMenu,
        setMenuOpen,
        handleOverlayClick, // Función para cerrar el menú al hacer clic en la superposición
    };

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    );
};
