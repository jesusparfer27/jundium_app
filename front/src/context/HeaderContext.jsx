// src/context/HeaderContext.js
import React, { createContext, useState } from 'react';

export const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState({ term: '', mode: false });
    const [activeMenu, setActiveMenu] = useState('');
    const [overlayVisible, setOverlayVisible] = useState(false); // Nuevo estado para la capa

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
        if (search.mode) setSearch(prev => ({ ...prev, mode: false }));
        setOverlayVisible(!overlayVisible); // Alterna la visibilidad de la capa
    };

    const closeMenu = () => {
        setActiveMenu('');
        setOverlayVisible(false); // Oculta la capa al cerrar el menú
    };

    const openMenu = (type) => {
        if (activeMenu === type) {
            closeMenu();
        } else {
            setActiveMenu(type);
            setOverlayVisible(true); // Muestra la capa cuando se abre un menú
        }

        if (type === 'searchBar') {
            setSearch({ ...search, mode: true });
            closeMenu();
        }
    };

    const value = {
        menuOpen,
        search,
        activeMenu,
        overlayVisible,
        toggleMenu,
        closeMenu,
        openMenu,
        setSearch,
    };

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    );
};
