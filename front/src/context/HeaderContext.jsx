// HeaderContext.js
import React, { createContext, useState } from 'react';

export const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [filter, setFilter] = useState(null);
    const [search, setSearch] = useState({ term: '', mode: false });
    const [favouriteVisible, setFavouriteVisible] = useState(false);
    const [containerVisible, setContainerVisible] = useState('');

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
        if (filter) setFilter(null);
        if (search.mode) setSearch(prev => ({ ...prev, mode: false }));
    };

    const value = {
        menuOpen,
        filter,
        search,
        favouriteVisible,
        containerVisible,
        toggleMenu,
        setMenuOpen,
        setFilter,
        setSearch,
        setFavouriteVisible,
        setContainerVisible
    };

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    );
};
