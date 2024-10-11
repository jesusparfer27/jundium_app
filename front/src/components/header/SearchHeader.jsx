// src/components/header/HeaderSearch.jsx
import React, { useContext, useRef, useEffect } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/search.css';
import '../../css/components/header/header.css'

const HeaderSearch = () => {
    const { search, setSearch, closeMenu } = useContext(HeaderContext);
    const searchRef = useRef(null);

    // Cierra el buscador si haces clic fuera

    const handleSearch = () => {
        if (search.term.trim()) {
            console.log("Buscando:", search.term);
        } else {
            console.log("Por favor, inserte un término de búsqueda.");
        }
    };

    const clearSearch = () => {
        setSearch({ ...search, term: '' });
    };

    return (
        <div ref={searchRef} className="headerSearchActive centeredSearch">
            <input
                type="text"
                placeholder="Inserte su búsqueda..."
                value={search.term}
                onChange={(e) => setSearch({ ...search, term: e.target.value })}
                className="searchBar"
            />
            <button className="button headerButton" onClick={handleSearch}>
                <span className="material-symbols-outlined">search</span>
            </button>
            <button className="button clearButton" onClick={clearSearch}>
                <span className="material-symbols-outlined">clear</span>
            </button>
        </div>
    );
};

export default HeaderSearch;
