// src/context/HeaderContext.js
import React, { createContext, useState } from 'react';

export const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState({ term: '', mode: false });
    const [activeMenu, setActiveMenu] = useState('');

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
        if (search.mode) setSearch(prev => ({ ...prev, mode: false }));
    };

    const closeMenu = () => {
        setActiveMenu('');
    };

    const openMenu = (type) => {
        if (type === 'searchBar') {
            setSearch({ ...search, mode: true });
            closeMenu(); // Cierra cualquier otro menú
        } else {
            setActiveMenu(type);
        }
    };

    const value = {
        menuOpen,
        search,
        activeMenu,
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
